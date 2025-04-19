import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import classes from './offer-detail.module.scss';

const OfferDetailSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div className={classes.containerOfferDetail}>
      <div className={classes.headerOfferDetail}>
        <div className={classes.titleDetail}>
          <Skeleton />
        </div>
        <Skeleton />
      </div>
      <div className={classes.titleOfferDetail}>
        <Skeleton />
      </div>
      <div className={classes.wrapChip}>
        <span className={classes.chip}>
          <Skeleton />
        </span>
        <span className={classes.chip}>
          <Skeleton />
        </span>
        <br className={classes.showWhenMobile} />
        <span className={classes.chip}>
          <Skeleton />
        </span>
        <span className={classes.chip}>
          <Skeleton />
        </span>
      </div>
      {new Array(10).fill(0).map((item, index) => (
        <Card key={String(index)} className={classes.containerActivity}>
          <Row className={classes.resetMargin}>
            <Col sm={12} md={7}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Col>
            <Col sm={12} md={5}>
              <Skeleton />
              <Skeleton />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default OfferDetailSkeleton;
