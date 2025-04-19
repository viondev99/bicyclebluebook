import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';
import classes from './sub-step-three.module.scss';

interface Props {
  loading?: boolean;
}

const ProductSkeleton: FC<Props> = (props) => {
  return (
    <Card className={classes.item}>
      <div className={classes.imageContainer}>
        <Skeleton height={168} width={'100%'} />
      </div>
      <span className={classes.name}>
        <Skeleton />
      </span>
    </Card>
  );
};

export default ProductSkeleton;
