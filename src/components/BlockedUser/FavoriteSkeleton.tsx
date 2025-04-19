import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';

const FavoriteSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <Card>
      <div>
        <Skeleton width="100%" height={50} />
      </div>
    </Card>
  );
};

export default FavoriteSkeleton;
