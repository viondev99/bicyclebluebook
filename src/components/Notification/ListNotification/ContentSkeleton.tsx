import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import classes from './list-notification.module.scss';

const ContentSkeleton: FC = () => {
  return (
    <div className={classes.notification}>
      <div className={classes.iconContainer}>
        <Skeleton width={50} height={50} />
      </div>
      <div className={classes.info}>
        <div className={classes.title}>
          <Skeleton width={300} height={40} />
        </div>
        <div className={classes.dateTime}>
          <Skeleton width={120} height={30} />
        </div>
      </div>
    </div>
  );
};

export default ContentSkeleton;
