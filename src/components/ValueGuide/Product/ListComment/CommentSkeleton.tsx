import React, { FC } from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import classes from './comment.module.scss';

const CommentSkeleton: FC = () => {
  return (
    <div className={classes.commentItem}>
      <div className={'d-flex'}>
        <div className={cx(classes.avatar, 'rounded-circle')}>
          <Skeleton />
        </div>
        <div className={'ml-4'}>
          <Skeleton />
        </div>
      </div>
      <div className="d-flex align-content-center align-items-center mt-2">
        <Skeleton />
      </div>

      <Skeleton />
    </div>
  );
};

export default CommentSkeleton;
