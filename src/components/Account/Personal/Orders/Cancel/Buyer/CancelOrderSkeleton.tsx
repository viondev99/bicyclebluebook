import React from 'react';
import Card from '@ui/Cards';
import Skeleton from 'react-loading-skeleton/lib';

const CancelOrderSkeleton = () => {
  return (
    <div className={'mt-4'}>
      <Card>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
    </div>
  );
};

export default CancelOrderSkeleton;
