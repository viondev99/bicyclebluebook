import Card from '@ui/Cards';
import Pagination from '@ui/Pagination/Pagination';
import { RedBarnReportPayload } from 'api/partner/trade-in-account.api';
import StoreState from 'model/store';
import { DataRedBarnReport } from 'model/store/partner/scorecard.model';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import scorecardAction from 'store/partner/scorecard/score-card.action';
import ScoreTotalCard from '../ScoreTotalCard/ScoreTotalCard';
import classes from './score-card-list.module.scss';
import ScoreCardItem, { ScorecardSkeleton } from './ScoreCardItem/ScoreCordItem';

const ScoreCardList: FC = () => {
  const { query, pathname, replace } = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const loading = useSelector((state: StoreState) => state.partner.scorecard.loading);
  const dataRedBarnReport = useSelector((state: StoreState) => state.partner.scorecard.dataRedBarnReport);

  const handleGetListRedBarnReport = useCallback(() => {
    if (userInfo) {
      const body = (query as unknown) as RedBarnReportPayload;

      dispatch(scorecardAction.getRedBarnReport(body));
    }
  }, [dispatch, userInfo, query]);

  useEffect(() => {
    handleGetListRedBarnReport();
  }, [dispatch, handleGetListRedBarnReport]);

  const handleChangePage = useCallback(
    (page: number) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [pathname, query, replace],
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
    const dataRedBarnReportConvert = dataRedBarnReport?.data;
    return dataRedBarnReportConvert?.length ? (
      <>
        {dataRedBarnReportConvert.map((item: DataRedBarnReport) => {
          return <ScoreCardItem dataRedBarnReportModal={item} key={item.licensingScorecardId} />;
        })}
        <Pagination
          totalPage={dataRedBarnReport.total_page}
          page={dataRedBarnReport.page}
          onChangePage={handleChangePage}
        />
      </>
    ) : (
      <Card className={classes.notFoundText}>There’s no data.</Card>
    );
  }, [dataRedBarnReport, handleChangePage]);

  const renderScoreTotalCard = useMemo(() => {
    return <ScoreTotalCard />;
  }, []);

  return (
    <div>
      {renderScoreTotalCard}
      {loading ? renderLoading : renderScoreCardList}
    </div>
  );
};

export default ScoreCardList;
