import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

const OrderSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div {...props}>
      <Skeleton />

      <Card className="mt-3">
        <Row className="w-100">
          <Col xs={12} md={4}>
            <Skeleton width="100%" />
          </Col>
          <Col xs={12} md={8}>
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
