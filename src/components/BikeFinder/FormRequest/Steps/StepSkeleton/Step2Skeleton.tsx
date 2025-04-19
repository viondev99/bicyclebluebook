import React, { FC, HtmlHTMLAttributes } from 'react';
import Skeleton from 'react-loading-skeleton';
import classes from '../step.module.scss';

const Step2Skeleton: FC<HtmlHTMLAttributes<HTMLDivElement>> = () => {
  return (
    <div className={classes.customCard}>
      <Skeleton width="100%" height="100%" />

      <div className={classes.contentCard}>
        <div className={classes.headerCard}>
          <Skeleton width="100%" height="100%" />
        </div>
        <div className={classes.introduction}>
          <Skeleton width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
};
export default Step2Skeleton;
