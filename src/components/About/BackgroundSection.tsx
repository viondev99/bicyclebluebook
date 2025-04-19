import React, { FC } from 'react';
import cx from 'classnames';
import classes from './about.module.scss';

const BackgroundSection: FC = () => {
  return (
    <section className={cx(classes.cover)}>
      <div className={cx('container', classes.sectionContainer)}>
        <p className={classes.title}>About Bicycle Blue Book</p>
        <h2>In 2011, Bicycle Blue Book founders set out to answer the question "What's your bike worth?"</h2>
      </div>
      <div className={cx('container', classes.sectionCover)}>
        <div className={classes.section}>
          <div className={classes.sectionRectangle}>
            <p className={classes.firstLine}>
              They leveraged their extensive cycling industry knowledge, analyzed millions of transactions, and created
              a high performance predictive analytics platform that uses automated machine learning to accurately report
              on bicycle values. The result was the Bicycle Blue Book Value Guide, the cycling industry’s definitive
              valuation authority.
            </p>
            <p>
              With the Value Guide as its foundation, the company created the Authorized Trade in Program and
              Marketplace to help the cycling community upgrade to better bikes more frequently, fairly, safely and
              conveniently.
            </p>
          </div>
          <div className={classes.sectionMask} />
        </div>
      </div>
    </section>
  );
};

export default BackgroundSection;
