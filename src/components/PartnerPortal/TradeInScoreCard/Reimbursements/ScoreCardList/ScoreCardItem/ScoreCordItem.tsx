import React, { FC } from 'react';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { ReimbursementStatus } from 'model/store/partner/scorecard.model';
import Card from '@ui/Cards';
import { formatCurrencyFixed, setStatusReimbursement } from 'helpers/string.helper';
import classes from './score-card-item.module.scss';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

interface Props {
  location: string;
  id: number;
  status: ReimbursementStatus;
  createdTime: string;
  renderHeader?: boolean;
  tradeId?: number;
  poNumber?: string;
  Total?: number;
}

const ScoreCardItem: FC<Props> = ({ renderHeader, location, createdTime, tradeId, poNumber, Total, status }) => {
  return (
    <div>
      {renderHeader && <h4 className={classes.timeHeader}>{dayjs(createdTime).format('LL')}</h4>}
      <div className={classes.card}>
        <Row>
          <Col lg={4} sm={10}>
            <h4 className={classes.title}>Location</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.title}>Trade ID</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.title}>PO Number</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.title}>Total</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.title}>Status</h4>
          </Col>
        </Row>
        <Row className={classes.rowDescription}>
          <Col lg={4} sm={10}>
            <h4 className={classes.description}>{location}</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.description}>{tradeId}</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.description}>{poNumber}</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.description}>{formatCurrencyFixed(Total)}</h4>
          </Col>
          <Col lg={2} sm={10}>
            <h4 className={classes.description}>{setStatusReimbursement(status)}</h4>
          </Col>
        </Row>
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
            <p className={classNames(classes.status)}>
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
