import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Card from '@ui/Cards';
import classes from './product.module.scss';

const ProductSkeleton = () => {
  return (
    <>
      <Row>
        <Col md={6}>
          <Skeleton />
          <Skeleton />
        </Col>
        <Col md={6} className="d-flex align-items-end flex-column">
          <Skeleton />
          <Skeleton />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className={classes.image}>
            <Skeleton />
          </Card>
        </Col>

        <Col md={6}>
          <Card className={classes.price}>
            <Skeleton />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductSkeleton;
