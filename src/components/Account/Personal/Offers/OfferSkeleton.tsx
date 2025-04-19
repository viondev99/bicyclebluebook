import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import classes from './offers.module.scss';

const OfferSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <Card {...props} className={classes.offerItem}>
      <Row className={classes.resetMargin}>
        <Col xs={10} sm={10}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Col>
        <Col xs={2} sm={2}>
          <Skeleton />
          <Skeleton />
        </Col>
      </Row>
    </Card>
  );
};

export default OfferSkeleton;
