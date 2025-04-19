import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import classes from '../conversation.module.scss';

const ItemSkeleton: FC = () => {
  return (
    <div className={classes.conversationContainer}>
      <div className={classes.checkboxContainer} style={{ marginRight: 32 }}>
        <Skeleton width={26} height={26} />
      </div>
      <div className={classes.conversationContent}>
        <Skeleton width={60} height={60} />
        <div className={classes.infoConversation}>
          <div>
            <Skeleton width={200} height={26} />
          </div>
          <div>
            <Skeleton width={200} height={26} />
          </div>
        </div>
        <div className={classes.infoConversation} style={{ maxWidth: 100 }}>
          <Skeleton width={100} height={26} />
          <div className={classes.icon} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Skeleton width={23} height={23} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSkeleton;
