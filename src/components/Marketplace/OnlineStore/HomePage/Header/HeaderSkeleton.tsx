import React from 'react';
import images from 'assets/images';
import Skeleton from 'react-loading-skeleton/lib';
import classes from './header.module.scss';

const HeaderSkeleton = () => {
  return (
    <div className={classes.wrapHeader}>
      <div className={classes.headerImgDefault} />
      <div className={classes.wrapInfoHeader}>
        <div className={classes.wrapAvatar}>
          <div className={classes.avatarDefault}>
            <img src={images.marketplace.iconStoreGray} alt="avatar" />
          </div>
          <div className={classes.name}>
            <Skeleton width={140} />
          </div>
        </div>
        <div className={classes.infoUser} />
      </div>
    </div>
  );
};

export default HeaderSkeleton;
