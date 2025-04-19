import React from 'react';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Skeleton from 'react-loading-skeleton/lib';

const OrderSkeleton = () => {
  return (
    <div className={'mt-4'}>
      <Card>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
      <Card className={'mt-4'}>
        <Row className={'w-100 ml-0 mr-0'}>
          <Col xs={12} md={5} lg={4}>
            <Skeleton width={'100%'} height={'150px'} />
          </Col>
          <Col xs={12} md={7} lg={8}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderSkeleton;
