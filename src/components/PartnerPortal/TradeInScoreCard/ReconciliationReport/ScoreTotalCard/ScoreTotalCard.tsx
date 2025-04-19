import React, { FC, useCallback, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import { exportXlsxFile, formatNumberLargeDecimal } from 'helpers/utilities.helper';
import { ROW_LABELS } from 'constants/reconciliation-report';
import { ReconciliationReportObject } from 'api/partner/reconciliation-report.api';
import classes from './score-total-card.module.scss';
import { populateDataExport } from './reconciliation-report';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  renderScoreTotalCard: ReconciliationReportObject;
}

const valueEndOfDate = dayjs().endOf('day');
const last13days = dayjs(valueEndOfDate).subtract(13, 'days');
const status = [
  { label: 'Due', value: 'Due' },
  { label: 'Non-Compliant', value: 'Non-Compliant' },
  { label: 'Open', value: 'Open' },
];
const ScoreTotalCard: FC<Props> = ({ renderScoreTotalCard }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, seTodate] = useState(last13days);

  function formatDateWithTime(date: any) {
    if (date) {
      return dayjs(date).local().format('MM/DD/YYYY, hh:mm A');
    }
    return '';
  }

  function formatDateNotTime(date: any) {
    return dayjs(date).local().format('MM/DD/YYYY');
  }

  const handleExport = useCallback(() => {
    const statusFilter =
      status && status.length > 0 ? `Purchase Order: Status equals: ${status.map((item) => item.label).join()}` : null;

    const dateField = `Date Recieved equals Custom (${
      formatDateNotTime(fromDate) !== 'Invalid date' ? `${formatDateNotTime(fromDate)} to ` : 'to '
    }${formatDateNotTime(toDate)})`;

    const labelExcel = [
      [`Reconciliation Report`],
      [],
      ['Filtered By'],
      ['Show: All accounts'],
      [dateField],
      statusFilter && [statusFilter],
      ROW_LABELS.filter((it: any) => !!it.name).map((it: any) => it.name),
    ].filter((item: any) => item !== null);

    const dataExport = labelExcel.concat(populateDataExport(renderScoreTotalCard));
    return exportXlsxFile(dataExport, `${formatDateWithTime(dayjs())}_Reconciliation Report`, [
      { width: 60 },
      { width: 20 },
      { width: 30 },
      { width: 30 },
      { width: 25 },
      { width: 30 },
      { width: 15 },
      { width: 25 },
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
  }, [fromDate, renderScoreTotalCard, toDate]);
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
                <h4 className={classes.description}>{renderScoreTotalCard?.total_po || '-'}</h4>
              </Col>
            </Row>
          </Col>
          <Col md={4} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Total Trade in Value</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>
                  ${`${formatNumberLargeDecimal(renderScoreTotalCard?.total_po_trade_in_value || 0) || '0.00'}`}
                </h4>
              </Col>
            </Row>
          </Col>
          <Col md={5} xs={12}>
            <Row>
              <Col>
                <Row>
                  <Col>
                    <h4 className={classes.title}>Total Override Trade in Value</h4>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4 className={classes.description}>
                      $
                      {`${
                        formatNumberLargeDecimal(renderScoreTotalCard?.total_po_override_trade_in_value || 0) || '0.00'
                      }`}
                    </h4>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={'mt-3'}>
          <Col>
            <Button onClick={handleExport}>Export</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ScoreTotalCard;
