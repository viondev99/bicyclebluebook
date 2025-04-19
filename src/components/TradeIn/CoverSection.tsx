import React, { FC } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import classes from './trade-in.module.scss';

const CoverSection: FC = () => {
  return (
    <section className={classes.cover}>
      <div className={cx('container', classes.sectionContainer)}>
        <div className={classes.siteTitle}>
          <h1>Trade in your old bike for a new one.</h1>
        </div>
        <div className={classes.siteDescription}>
          Instantly unlock the value of one of your current bicycles by trading it in towards the purchase of a new one
          at one of our Authorized Trade-in Partners
        </div>
        <Link href={'/trade-in/request'}>
          <a>
            <Button buttonSize={'l'} className={classes.tradeInButton}>
              Request a Trade in
            </Button>
          </a>
        </Link>
      </div>
    </section>
  );
};

export default CoverSection;
