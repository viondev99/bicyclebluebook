import React, { FC } from 'react';
import Link from 'next/link';
import Container from 'reactstrap/lib/Container';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import Divider from '@ui/Divider';

import Redirect from '../../Router/Redirect';
import { LoginForm } from '../Form/LoginForm';
import SocialForm from '../Form/SocialForm';
import StoreState from '../../../model/store';
import classes from '../Modal/loginModal.module.scss';

const LoginScreen: FC = () => {
  const token = useSelector((state: StoreState) => state.authenticate.token);

  return (
    <Container style={{ maxWidth: 700, background: '#fff', margin: '20px auto' }}>
      <div className={classes.content}>
        {token && <Redirect to={'/'} replace={true} />}
        <h2 style={{ marginBottom: 40 }}>Sign In</h2>
        <LoginForm />
        <Divider className={cx(classes.divider)} />
        <SocialForm />
        <Divider className={cx(classes.loginDivider)} />
        <div className={cx(classes.registerText, 'd-none d-md-block')}>
          Not registered?{' '}
          <Link href={'/register'}>
            <a className={classes.link}>Create an account</a>
          </Link>
        </div>

        <div className="d-flex d-md-none justify-content-between">
          <div>
            <Link href={'/register'}>
              <a className={classes.link}>Create an account.</a>
            </Link>
          </div>
          <Link href={'/forgot-password'}>
            <a className={classes.forgotPasswordText}>Forgot password</a>
          </Link>
        </div>
      </div>
    </Container>
  );
};
export default LoginScreen;
