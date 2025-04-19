import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import cx from 'classnames';
import scorecardAction, { GetScorecardPayload } from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import { ScorecardSkeleton } from '../History/ScoreCardList/ScorecardItem/ScoreCardItem';
import HistoryLead from '../History/ScoreCardList/HistoryLead';
import classes from '../History/ScoreCardList/score-card-list.module.scss';

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
        tabName: 'lead',
        typeTradeIn: undefined,
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

  const renderScoreCardList = useMemo(() => {
    return scorecardList?.data?.length ? (
      scorecardList.data.map((item, index, array) => {
        const prev = index > 0 ? array[index - 1] : null;
        const renderHeader = !prev || !isSameDate(prev.createdTime, item.createdTime);

        return (
          <HistoryLead
            renderHeader={renderHeader}
            bike={item?.bike}
            location={item.partnerAddress}
            status={item.status_view || item?.status}
            stages={item?.stage_view}
            tradeInValue={item.trade_in_value}
            key={item._id}
            id={item?._id}
            createdTime={item.date_created}
            lastModifyCancelBy={item.lastModifyCancelBy}
            customerEmail={item.email}
            partner={item?.partner?.name}
            customerName={item?.name}
            ZipCode={item?.zip_code}
            phone={item?.phone}
            handleGetListHistory={handleGetListHistory}
          />
        );
      })
    ) : (
      <Card className={classes.notFoundText}>There’s no data.</Card>
    );
  }, [handleGetListHistory, scorecardList]);

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
    </div>
  );
};

export default ScoreCardList;
