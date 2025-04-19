/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import Button from '@ui/Buttons/Primary/Button';
import Link from 'next/link';
import React, { FC } from 'react';
import classes from './footer-not-exactly-sure.module.scss';

const FooterNotExactlySure: FC = () => {
  return (
    <section className={classes.section}>
      <div className={classes.wrapFooterNotExactlySure}>
        <h4>Not exactly sure?</h4>
        <div className={classes.description}>
          Let us help find the perfect bike for you by answering a few, quick questions and we will show you options
          that fit your requirements.
        </div>

        <Button className={classes.customButtonSize}>
          <Link href={`/bike-finder/request`}>
            <a>Use our Bike Finder</a>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FooterNotExactlySure;
