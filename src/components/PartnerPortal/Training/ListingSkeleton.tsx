import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@ui/Cards';

const ListingSkeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <>
      {new Array(3).fill(0).map((item, index) => (
        <Card key={String(index)} className="mb-3">
          <Skeleton height={50} />
        </Card>
      ))}
    </>
  );
};

export default ListingSkeleton;
