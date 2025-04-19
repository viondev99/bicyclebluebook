import React from 'react';
import Card from '@ui/Cards';
import Skeleton from 'react-loading-skeleton/lib';

const UserSkeleton = () => {
  return (
    <Card>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Card>
  );
};

export default UserSkeleton;
