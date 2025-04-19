import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import cx from 'classnames';
import classes from 'components/StoreFront/Listings/listing.module.scss';

const CustomSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <Card className={cx('row', classes.listingItem)}>
      <div className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}>
        <Skeleton width="100%" height="100%" />
      </div>
      <div className={cx('col-xs-12 col-sm-8', classes.contentItemListing)}>
        <div className="mt-4">
          <Skeleton height={30} />
        </div>
      </div>
    </Card>
  );
};

export default CustomSkeleton;
