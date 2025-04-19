import React, { FC, useCallback, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { exportXlsxFile, formatNumberLarge, parseJwt } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import classes from './score-total-card.module.scss';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Button from '@ui/Buttons/Primary/Button';
import { populateDataScoreCardExport } from './scorecard-report';
import { SCORECARD_REPORT_ROW_LABELS } from 'constants/scorecard-report';

dayjs.extend(utc);

interface Props {}

const valueEndOfDate = dayjs().endOf('day');
const last13days = dayjs(valueEndOfDate).subtract(13, 'days');
const ScorecardTotalReport: FC<Props> = () => {
  const dataReportScorecard = useSelector((state: StoreState) => state.partner.scorecard.dataReportScorecard);
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
    const dateField = `Date Recieved equals Custom (${
      formatDateNotTime(fromDate) !== 'Invalid date' ? `${formatDateNotTime(fromDate)} to ` : 'to '
    }${formatDateNotTime(toDate)})`;

    const labelExcel = [
      [`ScoreCard Report`],
      [],
      ['Filtered By'],
      ['Show: All accounts'],
      [dateField],
      SCORECARD_REPORT_ROW_LABELS.filter((it: any) => !!it.name).map((it: any) => it.name),
    ].filter((item: any) => item !== null);

    const dataExport = labelExcel.concat(populateDataScoreCardExport(dataReportScorecard));

    return exportXlsxFile(dataExport, `${formatDateWithTime(dayjs())}_ScoreCard Report`, [
      { width: 50 },
      { width: 30 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 40 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
    ]);
  }, [dataReportScorecard, fromDate, toDate]);
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
                <h4 className={classes.description}>
                  {dataReportScorecard && Array.isArray(dataReportScorecard)
                    ? formatNumberLarge(dataReportScorecard?.length)
                    : 0}
                </h4>
              </Col>
            </Row>
          </Col>
          <Col md={8} xs={12} className={classes.exportBtn}>
            <Button onClick={handleExport}>Export</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ScorecardTotalReport;
