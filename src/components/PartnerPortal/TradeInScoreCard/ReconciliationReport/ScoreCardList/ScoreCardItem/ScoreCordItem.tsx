import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Card from '@ui/Cards';
import cx from 'classnames';
import { ReconciliationReportModel } from 'api/partner/reconciliation-report.api';
import images from '@images';
import classes from './score-card-item.module.scss';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  renderHeader?: boolean;
  reconciliationReportModel: ReconciliationReportModel;
}

const ScoreCardItem: FC<Props> = ({ renderHeader, reconciliationReportModel }) => {
  const [visibleDescription, setVisibleDescription] = useState(false);

  function formatDateWithTime(date: any) {
    if (date) {
      return dayjs(date).local().format('MM/DD/YYYY, hh:mm A');
    }
    return '';
  }

  return (
    <div>
      <div className={classes.card}>
        <Row>
          <Col md={6} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Account Name</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{reconciliationReportModel?.account_name || '-'}</h4>
              </Col>
            </Row>
          </Col>
          <Col md={3} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Date Received</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>
                  {formatDateWithTime(reconciliationReportModel?.inventory_date_received) || '-'}
                </h4>
              </Col>
            </Row>
          </Col>
          <Col md={3} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Trade in Value</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{reconciliationReportModel?.inventory_trade_in || '-'}</h4>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={'mb-2'}>
          <Col onClick={() => setVisibleDescription(!visibleDescription)}>
            <span className={cx(classes.labelDetail, 'pr-1')}>Full Details</span>
            <img
              src={images.icArrowDownBlue}
              alt=""
              className={cx('cursor-pointer', visibleDescription && classes.isRotate180)}
            />
          </Col>
        </Row>
        {visibleDescription ? (
          <Row>
            <Col md={12} xs={12}>
              <Row>
                <Col>
                  <h4 className={classes.title}>Scorecard ID</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reconciliationReportModel?.inventory_scorecard_id || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Inventory Created</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>
                    {formatDateWithTime(reconciliationReportModel?.inventory_created_date) || '-'}
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Purchase Order</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reconciliationReportModel?.purchase_order_code || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Override Trade in value</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>
                    {reconciliationReportModel?.inventory_override_trade_in || '-'}
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Value of Additional Components</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>
                    {reconciliationReportModel?.inventory_value_additional_component || '-'}
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Purchase Order: Subtotal</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reconciliationReportModel?.purchase_order_subtotal || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Purchase Order: Status</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reconciliationReportModel?.purchase_order_status || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h4 className={classes.title}>Name</h4>
                </Col>
                <Col md={6}>
                  <h4 className={classes.description}>{reconciliationReportModel?.inventory_name || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Employee Name</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reconciliationReportModel?.inventory_employee_name || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Owner Name</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reconciliationReportModel?.inventory_owner_name || '-'}</h4>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}
      </div>
    </div>
  );
};

export const ScorecardSkeleton: FC = () => {
  return (
    <Card className={classes.card}>
      <div className={classes.cardRow}>
        <div className={classes.cardLeft}>
          <h4 className={classes.title}>
            <Skeleton />
          </h4>
          <p className={classes.location}>
            <Skeleton />
          </p>
          <p className={classes.infoParagraph}>
            <Skeleton />
          </p>
        </div>
        <div className={classes.cardRight}>
          <div>
            <p className={classes.price}>
              <Skeleton />
            </p>
            <p className={cx(classes.status)}>
              <Skeleton />
            </p>
          </div>
          <div>
            <Skeleton width={60} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScoreCardItem;
