import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import { constHistoryPartnerTypeTradeInParams } from 'components/PartnerPortal/CostCalculator/constraint';
import {
  GetTradeInExpireResponse,
  patchReactivateQuoteRequest,
  getTradeInExpireQuotesRequest,
  postReactivateQuoteRequest,
} from 'api/partner/scorecard.api';
import cx from 'classnames';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { formatMoney } from 'helpers/string.helper';
import ModalCompareChangePriceCustomQuote from '@ui/Modal/ModalCompareChangePriceCustomQuote';
import scorecardAction, { GetScorecardPayload } from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import classes from '../History/ScoreCardList/score-card-list.module.scss';
import { ScorecardSkeleton } from '../History/ScoreCardList/ScorecardItem/ScoreCardItem';
import HistoryQuotes from '../History/ScoreCardList/HistoryQuotes';

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

  const handleGetListHistory = useCallback(() => {
    if (userInfo) {
      let body: GetScorecardPayload = {
        isArchived: false,
        statuses: String(query.statuses || ''),
        content: String(query.content || ''),
        stages: String(query.stages || ''),
        page: Number(query.page || 1),
        sort: 'DESC',
        typeSort: 'DATE',
        tabName: 'quotes',
        typeTradeIn: constHistoryPartnerTypeTradeInParams.QUOTES,
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
  }, [dispatch, query, userInfo]);

  useEffect(() => {
    handleGetListHistory();
  }, [dispatch, handleGetListHistory, query.content, query.page, query.statuses, userInfo]);

  const handleCheckStatusTradeIn = useCallback(() => {
    handleGetListHistory();
    return toastSuccess(`Reactivate successfully`);
  }, [handleGetListHistory]);

  const handleTradeInActive = useCallback(
    async (tradeInIdSelected: string) => {
      try {
        await postReactivateQuoteRequest(tradeInIdSelected);
        handleCheckStatusTradeIn();
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
      } catch (error) {
        toastError(error);
      }
    },
    [handleTradeInActive],
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

  const handleTradeInReactivate = useCallback(
    async (tradeInIdSelected: string) => {
      try {
        await patchReactivateQuoteRequest(tradeInIdSelected);
        handleCheckStatusTradeIn();
        setDataModalReactivateQuote(null);
      } catch (error) {
        toastError(error);
      }
    },
    [handleCheckStatusTradeIn],
  );

  const renderScoreCardList = useMemo(() => {
    return scorecardList?.data?.length ? (
      scorecardList.data.map((item, index, array) => {
        const prev = index > 0 ? array[index - 1] : null;
        const renderHeader = !prev || !isSameDate(prev.createdTime, item.createdTime);

        return (
          <HistoryQuotes
            renderHeader={renderHeader}
            title={item.bicycleName}
            location={item.partnerAddress}
            id={item.tradeInQuoteId}
            customer={item.customerName}
            status={item.status}
            tradeInValue={item.tradeInValue}
            key={item.tradeInQuoteId}
            createdTime={item.createdTime}
            lastModifyCancelBy={item.lastModifyCancelBy}
            customerEmail={item.customerEmail}
            partner={item?.partnerName}
            handleReactiveItem={handleReactiveItem}
            handleGetListHistory={handleGetListHistory}
          />
        );
      })
    ) : (
      <Card className={classes.notFoundText}>There’s no data.</Card>
    );
  }, [handleGetListHistory, handleReactiveItem, scorecardList]);

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
