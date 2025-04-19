import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import Card from '@ui/Cards';
import classes from './listing.module.scss';

const ListingSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <>
      {new Array(10).fill(0).map((item, index) => (
        <Card key={String(index)} className={cx('row', classes.listingItem)}>
          <div className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
            <Skeleton count={3} height={30} />
          </div>
          <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
            <Skeleton height="100%" width={50} />
          </div>
        </Card>
      ))}
    </>
  );
};

export default ListingSkeleton;
