import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Card from '@ui/Cards';
import cx from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DataRedBarnReport } from 'model/store/partner/scorecard.model';
import { formatDateNoTime } from 'helpers/date.helper';
import images from '@images';
import classes from './score-card-item.module.scss';

dayjs.extend(utc);

interface Props {
  dataRedBarnReportModal: DataRedBarnReport;
}

const ScoreCardItem: FC<Props> = ({ dataRedBarnReportModal }) => {
  const [visibleDescription, setVisibleDescription] = useState(false);

  return (
    <div>
      <div className={classes.card}>
        <Row>
          <Col md={3} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Created Date</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{formatDateNoTime(dataRedBarnReportModal?.createdDate) || '-'}</h4>
              </Col>
            </Row>
          </Col>
          <Col md={6} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Bike Name</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{dataRedBarnReportModal?.bikeName || '-'}</h4>
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
                <h4 className={classes.description}>
                  {dataRedBarnReportModal?.tradeInValue ? `$${dataRedBarnReportModal?.tradeInValue}` : '-'}
                </h4>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={classes.rowSecond}>
          <Col md={3} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Licensing Sorecard ID</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{dataRedBarnReportModal?.licensingScorecardId || '-'}</h4>
              </Col>
            </Row>
          </Col>
          <Col md={6} xs={12}>
            <Row>
              <Col>
                <h4 className={classes.title}>Account Name</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className={classes.description}>{dataRedBarnReportModal?.accountName || '-'}</h4>
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
                  <h4 className={classes.title}>Scorecard Status</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>
                    {dataRedBarnReportModal?.scorecardStatus.replace('_RED_BARN', '') || '-'}
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className={classes.title}>Owner Name</h4>
                </Col>
                <Col>
                  <h4 className={classes.description}>{dataRedBarnReportModal?.ownerName || '-'}</h4>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h4 className={classes.title}>Account Manager</h4>
                </Col>
                <Col md={6}>
                  <h4 className={classes.description}>{dataRedBarnReportModal?.accountManger || '-'}</h4>
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
