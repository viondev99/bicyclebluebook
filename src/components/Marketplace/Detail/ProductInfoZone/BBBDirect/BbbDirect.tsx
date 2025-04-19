import React, { FC } from 'react';

import classes from './bbb-direct.module.scss';

const BBBDirect: FC = () => {
  return (
    <section className={classes.contain}>
      <div className={'my-5'}>
        <div className={classes.title}>Bicycle Blue Book Verified</div>
        <div className={classes.description}>
          The advantages to buying our verified bikes are:
          <ul className="mt-3">
            <li>No hassle, 30 day return policy</li>
            <li>Purchasing from a trusted source</li>
            <li>Examined by Bicycle Blue Book certified mechanics</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BBBDirect;
