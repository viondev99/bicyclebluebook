import React from 'react';
import Card from '@ui/Cards';
import Skeleton from 'react-loading-skeleton/lib';
import classes from './order-item.module.scss';

const OrderSkeleton = () => {
  return (
    <Card className={classes.card}>
      <Skeleton />
      <Skeleton />
    </Card>
  );
};

export default OrderSkeleton;
