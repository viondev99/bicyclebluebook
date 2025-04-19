import React from 'react';
import Link from 'next/link';

import images from 'assets/images';

import classes from './register-full-screen.module.scss';

const RegisterFullScreen = () => {
  return (
    <div style={{ background: '#fff', margin: '20px 0px' }}>
      <div className={classes.content}>
        <h2 style={{ marginBottom: 30 }}>Create an account</h2>
        <p className={classes.description}>
          Whether you're buying, selling, or trading – join the definitive bicycle marketplace.
        </p>
        <Link href={'/register/personal'}>
          <a className={classes.card}>
            <img src={images.authenticate.icAuthPersonal} alt={'icon-error'} />
            <div className={classes.text}>
              <h4>Personal</h4>
              <p>Register to buy or sell as an individual.</p>
            </div>
          </a>
        </Link>
        <Link href={'/register/online-store'}>
          <a className={classes.card}>
            <img src={images.authenticate.icAuthStorefront} alt={'icon-error'} />
            <div className={classes.text}>
              <h4>Online Store</h4>
              <p>Register to sell as a store within our marketplace.</p>
            </div>
          </a>
        </Link>
        <Link href={'/register/trade-in-partner'}>
          <a className={classes.card}>
            <img src={images.authenticate.icAuthTradeIn} alt={'icon-error'} />
            <div className={classes.text}>
              <h4>Trade in Partner</h4>
              <p>Register to join our trade in partner network.</p>
            </div>
          </a>
        </Link>
        <div className={classes.loginText}>
          Already have an account?{' '}
          <Link href={'/login'}>
            <a className={classes.link}>Sign in.</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterFullScreen;
