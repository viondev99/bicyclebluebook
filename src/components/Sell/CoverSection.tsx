import React, { FC } from 'react';
import cx from 'classnames';
import Link from 'next/link';

import Button from 'components/ui/Buttons/Primary/Button';
// eslint-disable-next-line import/no-unresolved
import classes from './sell.module.scss';
import icDown from '../../assets/img/sell/ic_down.svg';

const CoverSection: FC = (props) => {
  return (
    <section className={classes.cover}>
      <div className={cx('container', classes.sectionContainer)}>
        <div style={{ maxWidth: 650 }}>
          <h1 className={classes.siteTitle}>It’s easy and secure to sell your bike with us.</h1>
          <Link href="/account/mylistings/create">
            <Button className="mt-sm-5">Create a Listing</Button>
          </Link>
        </div>
        <div
          className={classes.learn_more_text}
          onClick={() => {
            document.getElementById('info_service').scrollIntoView();
          }}>
          <img className="mr-sm-4" src={icDown} alt={''} />
          LEARN MORE
        </div>
      </div>
    </section>
  );
};

export default CoverSection;
