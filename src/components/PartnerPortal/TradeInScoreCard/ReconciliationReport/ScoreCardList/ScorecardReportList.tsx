import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards';
import scorecardAction from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import { convertToUnixTime } from 'helpers/date.helper';
import { ReconciliationReportModel, ReconciliationReportPayload } from 'api/partner/reconciliation-report.api';
import dayjs from 'dayjs';
import { sortDataByFields } from 'helpers/utilities.helper';
import { ReportScorecardResponse } from 'model/store/partner/scorecard.model';
import ScorecardItemReport, { ScorecardSkeleton } from './ScoreCardItem/ScorecardItemReport';
import classes from './score-card-list.module.scss';
import ScorecardTotalReport from '../ScoreTotalCard/ScorecardTotalReport';

interface Props {
  sortField: string;
}

const valueEndOfDate = dayjs().endOf('day');
const last13days = dayjs(valueEndOfDate).subtract(13, 'days');
const ScoreCardList: FC<Props> = ({ sortField }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const reconciliationReportList = useSelector((state: StoreState) => state.partner.scorecard.reconciliationReport);
  const dataReportScorecard = useSelector((state: StoreState) => state.partner.scorecard.dataReportScorecard);
  const checkDataExist = useSelector((state: StoreState) => state.partner.scorecard.checkDataExist);
  const loading = useSelector((state: StoreState) => state.partner.scorecard.loading);
  const { partnerId } = useSelector((store: StoreState) => ({
    partnerId: store.authenticate?.user?.partner,
  }));
  const handleGetListReimbursement = useCallback(() => {
    if (userInfo) {
      const body: ReconciliationReportPayload = {
        status: 'Due,Non-Compliant,Open',
        start_time: 0,
        end_time: convertToUnixTime(last13days),
        parent_id: partnerId,
        is_exists_salesforce_id: true,
      };

      dispatch(scorecardAction.getListReconciliationReport(body));
    }
  }, [dispatch, partnerId, userInfo]);

  useEffect(() => {
    handleGetListReimbursement();
  }, [dispatch, handleGetListReimbursement, userInfo]);

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
    const dataReportScorecardConvert = sortDataByFields(dataReportScorecard, sortField, 'desc');
    return dataReportScorecardConvert.length ? (
      dataReportScorecardConvert.map((item: ReportScorecardResponse) => {
        return <ScorecardItemReport renderHeader={true} reportScorecardResponse={item} key={item.inventoryId} />;
      })
    ) : (
      <Card className={classes.notFoundText}>There’s no data.</Card>
    );
  }, [dataReportScorecard, sortField]);

  const renderScoreTotalCard = useMemo(() => {
    return <ScorecardTotalReport />;
  }, []);

  return (
    <div>
      {renderScoreTotalCard}
      {loading || !checkDataExist ? renderLoading : renderScoreCardList}
    </div>
  );
};

export default ScoreCardList;
