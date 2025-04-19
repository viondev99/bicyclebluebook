import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import classes from './wishlist.module.scss';

const WishListSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div>
      <Card className={classes.cardWishList}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
      <Card className={classes.cardWishList}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
      <Card className={classes.cardWishList}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
    </div>
  );
};

export default WishListSkeleton;
