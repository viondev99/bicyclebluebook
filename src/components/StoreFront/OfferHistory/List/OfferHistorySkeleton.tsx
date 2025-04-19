import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './list-offer-history.module.scss';

const OfferSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <>
      {new Array(10).fill(0).map((item, index) => (
        <Card {...props} key={String(index)} className={classes.offerItem}>
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
      ))}
    </>
  );
};

export default OfferSkeleton;
