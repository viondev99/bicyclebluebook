import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import {
  constHistoryPartnerTradeInTabName,
  constHistoryPartnerTypeTradeInParams,
  statusToTextHistoryQuotes,
} from 'components/PartnerPortal/CostCalculator/constraint';
import {
  archiveActionTradeHistory,
  cancelActionTradeHistory,
  patchTradeInActiveRequest,
  PatchTradeInActiveResponse,
  getTradeInExpireRequest,
  GetTradeInExpireResponse,
  moveToInboxActionTradeHistory,
  PatchTradeInCancelResponse,
  patchTradeInCancelRequest,
  patchReactivateQuoteRequest,
  getTradeInExpireQuotesRequest,
} from 'api/partner/scorecard.api';
import cx from 'classnames';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { formatMoney } from 'helpers/string.helper';
import ModalCompareChangePriceCustomQuote from '@ui/Modal/ModalCompareChangePriceCustomQuote';
import { ScorecardStatuses } from 'constants/scorecard';
import scorecardAction, { GetScorecardPayload } from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import { deleteQuote } from 'api/trade-in.api';
import useScreenDetect from 'hooks/useScreenDetect';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import useCheckTrekStore from 'hooks/useCheckTrekStore';
import ScoreCardItem, { ScorecardSkeleton } from './ScorecardItem/ScoreCardItem';
import HistoryTradeInRequestItem from './HistoryTradeInRequestItem';
import HistoryInstantPayoutItem from './HistoryInstantPayoutItem';
import classes from './score-card-list.module.scss';
import HistoryRedBarnQuotes from './HistoryRedBarnQuote';

function isSameDate(prev: string, current: string) {
  return dayjs(prev).isSame(dayjs(current), 'days');
}

const ScoreCardList: FC = () => {
  const router = useRouter();
  const { query, replace, pathname } = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const scorecardList = useSelector((state: StoreState) => state.partner.scorecard.scorecardList);
  const loading = useSelector((state: StoreState) => state.partner.scorecard.loading);
  const { currentWidthScreen } = useScreenDetect();
  const [dataModalReactive, setDataModalReactive] = useState(null);
  const [dataModalReactivateQuote, setDataModalReactivateQuote] = useState(null);
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { operationRedbarn } = useSelector((state: StoreState) => ({
    operationRedbarn: state.partner?.account?.detailPartnerLocation?.operation_redbarn,
  }));
  // const isTrekAccount = useCheckTrekStore();

  const isRedBarnQuote = useMemo(() => {
    return `${query?.tab}` === constHistoryPartnerTradeInTabName.RED_BARN_QUOTE;
  }, [query]);

  const handleGotoStandardPage = useCallback(
    (tradeInIdSelected: string, step: number) => {
      router.push({ pathname: `/trade-in-account/trade-in/${tradeInIdSelected}`, query: { step } });
    },
    [router],
  );

  const renderTypeTradeInParams = useMemo(() => {
    if (`${query?.tab}` === constHistoryPartnerTradeInTabName.INBOX || !query.tab) {
      return constHistoryPartnerTypeTradeInParams.SCORECARD;
    }
    return undefined;
  }, [query]);

  const handleGetListHistory = useCallback(() => {
    if (userInfo) {
      let body: GetScorecardPayload = {
        isArchived: query.tab === 'archive',
        statuses: String(query.statuses || ''),
        content: String(query.content || ''),
        stages: String(query.stages || ''),
        page: Number(query.page || 1),
        sort: 'DESC',
        typeSort: 'DATE',
        tabName: query.tab,
        typeTradeIn: renderTypeTradeInParams,
      };
      if (query.startDate && query.endDate) {
        body = {
          ...body,
          startDate: `${query?.startDate}`,
          endDate: `${query?.endDate}`,
        };
      }
      dispatch(scorecardAction.getScorecard(body));
    }
  }, [dispatch, query, renderTypeTradeInParams, userInfo]);

  useEffect(() => {
    handleGetListHistory();
  }, [dispatch, handleGetListHistory, query.content, query.page, query.statuses, query.tab, userInfo]);

  const handleCheckStatusTradeIn = useCallback(
    (tradeInIdSelected: string, statusTradeIn: string) => {
      switch (statusTradeIn) {
        case ScorecardStatuses.INCOMPLETE_SUMMARY: {
          handleGotoStandardPage(tradeInIdSelected, 1);
          break;
        }
        case ScorecardStatuses.INCOMPLETE_DETAIL: {
          handleGotoStandardPage(tradeInIdSelected, 2);
          break;
        }
        case ScorecardStatuses.QUOTE: {
          handleGotoStandardPage(tradeInIdSelected, 2);
          break;
        }
        case ScorecardStatuses.INCOMPLETE_UPLOAD_IMAGES: {
          handleGotoStandardPage(tradeInIdSelected, 3);
          break;
        }
        case ScorecardStatuses.SHIPPING: {
          handleGotoStandardPage(tradeInIdSelected, 4);
          break;
        }
        case ScorecardStatuses.COMPLETED: {
          handleGotoStandardPage(tradeInIdSelected, 5);
          break;
        }
        default:
          break;
      }
    },
    [handleGotoStandardPage],
  );

  const handleTradeInActive = useCallback(
    async (tradeInIdSelected: string) => {
      try {
        const response: PatchTradeInActiveResponse = await patchTradeInActiveRequest(tradeInIdSelected);
        handleCheckStatusTradeIn(tradeInIdSelected, response?.statusTradeIn);
        setDataModalReactive(null);
      } catch (error) {
        toastError(error);
      }
    },
    [handleCheckStatusTradeIn],
  );

  const handleReactiveItem = useCallback(
    async (tradeInIdSelected: string, status: string) => {
      try {
        switch (status) {
          case statusToTextHistoryQuotes.EXPIRED_QUOTE: {
            const responseExpire: GetTradeInExpireResponse = await getTradeInExpireQuotesRequest(tradeInIdSelected);
            if (responseExpire?.currentTradeInValue && responseExpire?.newTradeInValue) {
              if (formatMoney(responseExpire?.currentTradeInValue) === formatMoney(responseExpire?.newTradeInValue)) {
                handleTradeInActive(tradeInIdSelected);
                return;
              }
              setDataModalReactive({
                title: 'scorecard',
                currentPrice: responseExpire?.currentTradeInValue,
                newPrice: responseExpire?.newTradeInValue,
                tradeInIdSelected,
              });
            }
            break;
          }
          case ScorecardStatuses.CANCELED_SHIPPING: {
            const responseCancel: PatchTradeInCancelResponse = await patchTradeInCancelRequest(tradeInIdSelected);
            handleCheckStatusTradeIn(tradeInIdSelected, responseCancel.status);
            break;
          }
          case ScorecardStatuses.CANCELED_IMAGE: {
            const responseCancel: PatchTradeInCancelResponse = await patchTradeInCancelRequest(tradeInIdSelected);
            handleCheckStatusTradeIn(tradeInIdSelected, responseCancel.status);
            break;
          }
          default: {
            const responseExpire: GetTradeInExpireResponse = await getTradeInExpireRequest(tradeInIdSelected);
            if (responseExpire?.currentTradeInValue && responseExpire?.newTradeInValue) {
              if (formatMoney(responseExpire?.currentTradeInValue) === formatMoney(responseExpire?.newTradeInValue)) {
                handleTradeInActive(tradeInIdSelected);
                return;
              }
              setDataModalReactive({
                title: 'scorecard',
                currentPrice: responseExpire?.currentTradeInValue,
                newPrice: responseExpire?.newTradeInValue,
                tradeInIdSelected,
              });
            }
            break;
          }
        }
      } catch (error) {
        toastError(error);
      }
    },
    [handleCheckStatusTradeIn, handleTradeInActive],
  );

  const handleChangePage = useCallback(
    (page) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [replace, pathname, query],
  );

  const renderLoading = useMemo(() => {
    return (
      <div>
        {new Array(4).fill(0).map((_, index) => (
          <ScorecardSkeleton key={String(index)} />
        ))}
      </div>
    );
  }, []);

  const handleCancelAction = useCallback(
    async (tradeInId: number) => {
      try {
        await cancelActionTradeHistory(tradeInId);
        handleGetListHistory();
        toastSuccess('Cancel Successfully.');
      } catch (error) {
        toastError(error);
      }
    },
    [handleGetListHistory],
  );

  const handleArchiveAction = useCallback(
    async (tradeInId: number) => {
      try {
        await archiveActionTradeHistory(tradeInId);
        handleGetListHistory();
        toastSuccess('Archive Successfully.');
      } catch (error) {
        toastError(error);
      }
    },
    [handleGetListHistory],
  );

  const handleMoveToInboxAction = useCallback(
    async (tradeInId: number) => {
      try {
        await moveToInboxActionTradeHistory(tradeInId);
        handleGetListHistory();
        toastSuccess('Move to inbox Successfully.');
      } catch (error) {
        toastError(error);
      }
    },
    [handleGetListHistory],
  );

  const handleDeleteAction = useCallback(
    async (tradeInId: number) => {
      try {
        await deleteQuote(tradeInId);
        handleGetListHistory();
        toastSuccess(`Delete Quote Successfully.`);
      } catch (error) {
        toastError(error);
      }
    },
    [handleGetListHistory],
  );

  const handleTradeInReactivate = useCallback(
    async (tradeInIdSelected: string) => {
      try {
        const response: PatchTradeInActiveResponse = await patchReactivateQuoteRequest(tradeInIdSelected);
        handleCheckStatusTradeIn(tradeInIdSelected, response?.statusTradeIn);
        setDataModalReactivateQuote(null);
      } catch (error) {
        toastError(error);
      }
    },
    [handleCheckStatusTradeIn],
  );

  const handleReactivated = useCallback(
    async (tradeInIdSelected: string) => {
      try {
        const response: GetTradeInExpireResponse = await getTradeInExpireRequest(tradeInIdSelected);
        if (response?.currentTradeInValue && response?.newTradeInValue) {
          if (formatMoney(response?.currentTradeInValue) === formatMoney(response?.newTradeInValue)) {
            handleTradeInReactivate(tradeInIdSelected);
            return;
          }
          setDataModalReactivateQuote({
            title: 'quote',
            currentPrice: response?.currentTradeInValue,
            newPrice: response?.newTradeInValue,
            tradeInIdSelected,
          });
        }
      } catch (error) {
        toastError(error);
      }
    },
    [handleTradeInReactivate],
  );

  const renderScoreCardList = useMemo(() => {
    return scorecardList?.data?.length ? (
      scorecardList.data.map((item, index, array) => {
        const prev = index > 0 ? array[index - 1] : null;
        const renderHeader = !prev || !isSameDate(prev.createdTime, item.createdTime);

        if (query?.tab === constHistoryPartnerTradeInTabName.TRADE_IN_REQUEST) {
          return (
            <HistoryTradeInRequestItem
              renderHeader={renderHeader}
              title={item.titleBicycle}
              location={item.partnerAddress}
              id={item.tradeInId}
              customer={item.customerName}
              statusName={item.statusName}
              status={item.status}
              tradeInValue={item.tradeInValue}
              key={item.tradeInId}
              createdTime={item.createdTime}
              lastModifyCancelBy={item.lastModifyCancelBy}
              customerEmail={item.customerEmail}
              tradeInId={item.tradeInId}
              tradeInRequestId={item.tradeInRequestId}
              partnerName={item?.partnerName}
              bicycleId={item?.bicycleId}
              bicycleBrand={item?.brand}
              bicycleModel={item?.model}
              bicycleYear={item?.year}
              handleGetListHistory={handleGetListHistory}
            />
          );
        }

        if (query?.tab === constHistoryPartnerTradeInTabName.INSTANT_PAYOUT) {
          return (
            <HistoryInstantPayoutItem
              renderHeader={renderHeader}
              title={item.titleBicycle}
              location={item.partnerAddress}
              id={item.tradeInId}
              customer={item.customerName}
              statusName={item.statusName}
              status={item.status}
              tradeInValue={item.tradeInValue}
              key={item.tradeInId}
              createdTime={item.createdTime}
              partnerName={item.partnerName}
              reimbursementStatus={item.reimbursementStatus}
              payoutValue={item.payoutValue}
              lastModifyCancelBy={item.lastModifyCancelBy}
              cancelAction={handleCancelAction}
              archiveAction={handleArchiveAction}
              moveToInboxAction={handleMoveToInboxAction}
              handleReactiveItem={handleReactiveItem}
            />
          );
        }

        if (isRedBarnQuote && operationRedbarn) {
          return (
            <HistoryRedBarnQuotes
              renderHeader={renderHeader}
              title={item.bicycleName}
              location={item.partnerAddress}
              customQuoteId={item?.customQuoteId}
              id={item.id}
              customer={item.partnerName}
              status={item.status}
              tradeInValue={item.tradeInValue}
              key={item._id}
              createdTime={item.createdTime}
              lastModifyCancelBy={item.lastModifyCancelBy}
              cancelAction={handleCancelAction}
              archiveAction={handleArchiveAction}
              moveToInboxAction={handleMoveToInboxAction}
              handleReactiveItem={handleReactiveItem}
              handleDeleteAction={handleDeleteAction}
              handleReactivated={handleReactivated}
              handleGetListHistory={handleGetListHistory}
            />
          );
        }

        return (
          <ScoreCardItem
            renderHeader={renderHeader}
            title={item.titleBicycle}
            location={item.partnerAddress}
            customQuoteId={item?.customQuoteId}
            id={item.tradeInId}
            customer={item.customerName}
            statusName={item.statusName}
            status={item.status}
            tradeInValue={item.tradeInValue}
            key={item.tradeInId}
            createdTime={item.createdTime}
            lastModifyCancelBy={item.lastModifyCancelBy}
            shippingType={item?.shippingType}
            cancelAction={handleCancelAction}
            archiveAction={handleArchiveAction}
            moveToInboxAction={handleMoveToInboxAction}
            handleReactiveItem={handleReactiveItem}
            handleDeleteAction={handleDeleteAction}
            handleReactivated={handleReactivated}
          />
        );
      })
    ) : (
      <Card className={classes.notFoundText}>There’s no data.</Card>
    );
  }, [
    handleArchiveAction,
    handleCancelAction,
    handleDeleteAction,
    handleGetListHistory,
    handleMoveToInboxAction,
    handleReactivated,
    handleReactiveItem,
    isRedBarnQuote,
    operationRedbarn,
    query,
    scorecardList,
  ]);

  return (
    <div>
      {stepTour === 4 && currentWidthScreen < 768 && (
        <div
          className={cx(classes.wrapModal, {
            [classes.step4]: stepTour === 4,
          })}>
          {currentWidthScreen >= 768 && <div className={classes.arrowLeft} />}
          <div>
            Trade-in is where you can start a new scorecard, view your shop’s scorecard history, and view reimbursement
            status for trades you’ve sent to Bicycle Blue Book.
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 3 }));
                if (currentWidthScreen < 768) {
                  router.replace('/trade-in-account/my-account/profile');
                }
              }}
              className={classes.buttonBack}>
              Back
            </button>
            <button
              type="button"
              className={classes.buttonNext}
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 5 }));
                router.replace('/trade-in-account/marketing/digital');
              }}>
              Next
            </button>
          </div>
        </div>
      )}
      {loading ? renderLoading : renderScoreCardList}
      {!loading && scorecardList?.data?.length ? (
        <div style={{ marginTop: 50 }}>
          <Pagination
            onChangePage={handleChangePage}
            totalPage={scorecardList.total_page}
            page={+String(query.page || '') || scorecardList.page}
          />
        </div>
      ) : null}

      {dataModalReactive && (
        <ModalCompareChangePriceCustomQuote
          isOpen={dataModalReactive}
          onClose={() => setDataModalReactive(null)}
          onSubmit={handleTradeInActive}
          dataModalReactive={dataModalReactive}
        />
      )}
      {dataModalReactivateQuote && (
        <ModalCompareChangePriceCustomQuote
          isOpen={dataModalReactivateQuote}
          onClose={() => setDataModalReactivateQuote(null)}
          onSubmit={handleTradeInReactivate}
          dataModalReactive={dataModalReactivateQuote}
        />
      )}
    </div>
  );
};

export default ScoreCardList;
