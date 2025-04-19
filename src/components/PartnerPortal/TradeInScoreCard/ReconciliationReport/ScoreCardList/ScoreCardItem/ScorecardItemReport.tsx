import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Card from '@ui/Cards';
import cx from 'classnames';
import { ReportScorecardResponse } from 'model/store/partner/scorecard.model';
import images from '@images';
import classes from './score-card-item.module.scss';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  renderHeader?: boolean;
  reportScorecardResponse: ReportScorecardResponse;
}

const ScoreCardItem: FC<Props> = ({ renderHeader, reportScorecardResponse }) => {
  const [visibleDescription, setVisibleDescription] = useState(false);

  function formatDateWithTime(date: any) {
    if (date) {
      return dayjs(date).local().format('MM/DD/YYYY, hh:mm A');
    }
    return '';
  }

  function formatDateNotTime(date: any) {
    return dayjs(date).local().format('MM/DD/YYYY');
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
                <h4 className={classes.description}>{reportScorecardResponse?.partnerName || '-'}</h4>
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
                  {formatDateWithTime(reportScorecardResponse?.receivedDate) || '-'}
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
                <h4 className={classes.description}>{reportScorecardResponse?.tradeInValue || '-'}</h4>
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
                  <h4 className={classes.title}>Inventory: Created Date</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>
                    {formatDateNotTime(reportScorecardResponse?.createdDate) || '-'}
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Shipping State/Province</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reportScorecardResponse?.shippingState || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>ScoreCard ID</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reportScorecardResponse?.scorecardId || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>ScoreCard Status</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reportScorecardResponse?.scorecardStatus || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Inventory: Inventory Record</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reportScorecardResponse?.inventoryRecord || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h4 className={classes.title}>Name</h4>
                </Col>
                <Col md={6}>
                  <h4 className={classes.description}>{reportScorecardResponse?.name || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Owner Name</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reportScorecardResponse?.ownerName || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Account Manager</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{reportScorecardResponse?.accountManager || '-'}</h4>
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
