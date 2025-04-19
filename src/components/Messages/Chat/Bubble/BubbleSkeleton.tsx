import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import classes from '../chat.module.scss';

const BubbleSkeleton: FC = () => {
  return (
    <>
      <div className={classes.leftBubbleContainer}>
        <div className={classes.senderName}>
          <Skeleton width={100} height={20} />
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.avatarContainer}>
            <Skeleton width={50} height={50} circle={true} />
          </div>
          <div>
            <Skeleton width={250} height={50} />
          </div>
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.avatarContainer} />
          <div>
            <Skeleton width={150} height={50} />
          </div>
        </div>
      </div>
      <div className={classes.rightBubbleContainer}>
        <div className={classes.senderName}>
          <Skeleton width={100} height={20} />
        </div>
        <div style={{ clear: 'both', float: 'right', marginBottom: 10 }}>
          <Skeleton width={250} height={50} />
        </div>
        <div style={{ clear: 'both', float: 'right', marginBottom: 10 }}>
          <Skeleton width={150} height={50} />
        </div>
      </div>
      <div className={classes.leftBubbleContainer}>
        <div className={classes.senderName}>
          <Skeleton width={100} height={20} />
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.avatarContainer}>
            <Skeleton width={50} height={50} circle={true} />
          </div>
          <div>
            <Skeleton width={250} height={50} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BubbleSkeleton;
