import React, { FC, useCallback } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import { exportXlsxFile } from 'helpers/utilities.helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getRedBarnReportRequest, RedBarnReportPayload } from 'api/partner/trade-in-account.api';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { formatDateNotTime, formatDateWithTime } from 'helpers/date.helper';
import { useRouter } from 'next/router';
import classes from './score-total-card.module.scss';
import { populateDataExport } from './reconciliation-report';

dayjs.extend(utc);

export const ROW_LABELS = [
  { id: 1, name: '' },
  { id: 2, name: 'Scorecard Created Date' },
  { id: 3, name: 'Account Name' },
  { id: 4, name: 'Bike Name' },
  { id: 5, name: 'Licensing Scorecard ID' },
  { id: 6, name: 'Scorecard Status' },
  { id: 7, name: 'Trade-in value' },
  { id: 8, name: 'Owner Name' },
  { id: 9, name: 'Account Manager' },
];

const ScoreTotalCard: FC = () => {
  const loading = useSelector((state: StoreState) => !!state.partner.scorecard.loading);
  const dataRedBarnReport = useSelector((state: StoreState) => state.partner.scorecard.dataRedBarnReport);
  const { query } = useRouter();

  const handleGetDataExport = useCallback(async (body: RedBarnReportPayload) => {
    const data = await getRedBarnReportRequest(body);
    const dateField = `Inventory: Created Date equals (${
      formatDateNotTime(body?.startDateFilter) !== 'Invalid date'
        ? `${formatDateNotTime(body?.startDateFilter)} to `
        : 'to '
    }${formatDateNotTime(body?.endDateFilter)})`;
    const labelExcel = [
      [`Trek Red Barn Program`],
      [],
      [`Filtered By`],
      [`Show: All accounts`],
      [dateField],
      [],
      ROW_LABELS.filter((it: any) => !!it.name).map((it: any) => it.name),
    ].filter((item: any) => item !== null);

    const dataExport = labelExcel.concat(populateDataExport(data));
    return exportXlsxFile(dataExport, `${formatDateWithTime(dayjs())}_Trek Red Barn Program`, [
      { width: 25 },
      { width: 35 },
      { width: 45 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 35 },
      { width: 35 },
      { width: 25 },
      { width: 25 },
      { width: 50 },
      { width: 50 },
      { width: 50 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
    ]);
  }, []);

  const handleExport = useCallback(async () => {
    const body = {
      ...query,
      page: 1,
      size: -1,
    };
    !loading && handleGetDataExport(body);
  }, [handleGetDataExport, loading, query]);

  return (
    <div>
      <div className={classes.card}>
        <Row>
          <Col md={3} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Total Records</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{dataRedBarnReport?.total_item || '-'}</h4>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={'mt-3'}>
          <Col>
            <Button disabled={loading} onClick={handleExport}>
              Export
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ScoreTotalCard;
