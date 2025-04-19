import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import icLeftArrowPrimary from 'assets/img/listing/ic_left_arrow.svg';
import icAuthContact from 'assets/img/authenticate/ic_contact.svg';
import classes from './check-email-full-screen.module.scss';

const CheckEmailFullScreen: FC = () => {
  const { pathname, asPath, query } = useRouter();

  return (
    <div style={{ flex: 1, background: '#fff', margin: '20px 0px' }}>
      <div className={classes.content}>
        <div>
          <h2 style={{ marginBottom: 30 }}>Check Your Email</h2>
          <p className={classes.description}>
            We’ve sent a reset link to the below email address. If you haven’t received it, check you have entered your
            email correctly or get in touch.
          </p>
          <p className={classes.email}>{query.email || 'Avx'}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href={'/forgot-password'}>
            <a className={classes.link}>
              <img src={icLeftArrowPrimary} alt={'error-icon'} />
              Re-enter email address
            </a>
          </Link>
          <Link
            scroll={false}
            href={{
              pathname,
              query: { contact: true, backOnClose: true, redirectUrl: asPath, ...query },
            }}
            as={'/contact'}>
            <a className={classes.link} style={{ marginTop: 20 }}>
              <img style={{ width: 25, height: 25 }} src={icAuthContact} alt={'error-icon'} />
              Contact us
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CheckEmailFullScreen;
