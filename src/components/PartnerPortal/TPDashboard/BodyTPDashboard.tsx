import Card from '@ui/Cards';
import cx from 'classnames';
import StoreState from 'model/store';
import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Table from 'reactstrap/lib/Table';
import { Doughnut } from 'react-chartjs-2';
import { roundNumberLarge } from 'helpers/utilities.helper';
import { formatCurrency } from 'helpers/string.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './tp-dashboard.module.scss';

const BodyTPDashboard: FC = () => {
  const dataTradeInScorecardReports = useSelector(
    (store: StoreState) => store.partner.account.dataTradeInScorecardReports,
  );
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { currentWidthScreen } = useScreenDetect();
  const conversionRate = useMemo(() => {
    return roundNumberLarge(
      (dataTradeInScorecardReports?.completedScorecard / dataTradeInScorecardReports?.allScorecard) * 100,
    );
  }, [dataTradeInScorecardReports]);

  const renderStoreRank = useMemo(() => {
    return Array.isArray(dataTradeInScorecardReports?.storeRank) && dataTradeInScorecardReports?.storeRank?.length ? (
      dataTradeInScorecardReports?.storeRank?.map((it) => {
        return (
          <tr>
            <td>
              <div className={classes.description}>{it?.partnerName || '-'}</div>
            </td>
            <td>
              <div className={classes.description}>{it?.numberOfTradeReceived || '-'}</div>
            </td>
            <td>
              <div className={classes.description}>{it?.rank || '-'}</div>
            </td>
          </tr>
        );
      })
    ) : (
      <div className={cx(classes.description, classes.textCenter)}>Empty records</div>
    );
  }, [dataTradeInScorecardReports]);

  return (
    <>
      <Card
        className={cx(classes.wrapContainer, 'pb-0', {
          [classes.wrapContainerTour]: stepTour === 2 && currentWidthScreen >= 768,
        })}>
        <div className={cx(classes.header, classes.wrapHeader)}>Scorecard Conversions</div>
        <Row>
          <Col md={6}>
            <div className={classes.wrapContent}>
              <div className={classes.wrapTitle}>Scorecards complete</div>
              <div className={cx(classes.textNumber, classes.textPrimary)}>
                {dataTradeInScorecardReports?.completedScorecard || '0'}
              </div>
            </div>
            <div>
              <div className={classes.wrapTitle}>Scorecards initiated</div>
              <div className={cx(classes.textNumber, classes.textWarning)}>
                {' '}
                {dataTradeInScorecardReports?.allScorecard || '0'}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.wrapContent}>
              <div className={classes.wrapTitle}>Conversion rate</div>
              <div className={cx(classes.textNumber, classes.textPrimary)}>{roundNumberLarge(conversionRate)}%</div>
            </div>
            <div className={classes.wrapChart}>
              <div className={classes.leftPercent}>0%</div>
              <div className={classes.chart}>
                <Doughnut
                  width={300}
                  height={200}
                  data={{
                    datasets: [
                      {
                        data: [100, Number(conversionRate), 100 - Number(conversionRate)],
                        backgroundColor: ['#fff', '#2faae3', '#f8f8f8'],
                        borderWidth: 0,
                        hoverBackgroundColor: ['#fff', '#2faae3', '#f8f8f8'],
                      },
                    ],
                  }}
                  // plugins={plugins}
                  options={{
                    legend: { display: false },
                    title: { display: false },
                    tooltips: {
                      enabled: false,
                    },
                    hover: {
                      intersect: false,
                      mode: 'point',
                    },
                  }}
                />
              </div>
              <div className={classes.rightPercent}>100%</div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        className={cx(classes.wrapContainer, 'pb-0', {
          [classes.wrapContainerTour]: stepTour === 2 && currentWidthScreen >= 768,
        })}>
        <div className={cx(classes.header, classes.wrapHeader)}>Store Rank</div>
        <div className={classes.wrapTableStoreRank}>
          <Table>
            <thead>
              <tr>
                <td>
                  <div className={classes.wrapTitle}>Name</div>
                </td>
                <td>
                  <div className={classes.wrapTitle}>Received</div>
                </td>
                <td>
                  <div className={classes.wrapTitle}>Rank</div>
                </td>
              </tr>
            </thead>
            <tbody>{renderStoreRank}</tbody>
          </Table>
        </div>
      </Card>

      <Card
        className={cx(classes.wrapContainer, 'pb-0', {
          [classes.wrapContainerTour]: stepTour === 2 && currentWidthScreen >= 768,
        })}>
        <Row className="pb-4">
          <Col md={6}>
            <div className={classes.spaceMobile}>
              <div className={cx(classes.header, 'mb-1')}>Average trade in value</div>
              <div className={cx(classes.textNumber, classes.textPrimary)}>
                {formatCurrency(dataTradeInScorecardReports?.avgCompletedTV || 0)}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div>
              <div className={cx(classes.header, 'mb-1')}>Compliance</div>
              <div className={cx(classes.textNumber, classes.textPrimary)}>
                {roundNumberLarge(dataTradeInScorecardReports?.complianceScorecard || 0)}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default BodyTPDashboard;
