import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import classes from './users.module.scss';
import Card from '@ui/Cards';

const UserSkeleton: FC = () => {
  return (
    <Card className={classes.user}>
      <div className={classes.userDetail}>
        <div className={classes.userName}>
          <Skeleton width={200} height={20} />
        </div>
        <div className={classes.userInfo}>
          <div className={classes.info}>
            <Skeleton width={200} height={20} />
          </div>
          <div className={classes.info}>
            <Skeleton width={200} height={20} />
          </div>
        </div>
      </div>
      <Skeleton width={20} height={40} />
    </Card>
  );
};

export default UserSkeleton;
