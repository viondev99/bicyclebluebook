import React, { FC, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import Divider from '@ui/Divider';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { LoginForm } from '../Form/LoginForm';
import SocialForm from '../Form/SocialForm';
import classes from './loginModal.module.scss';

const LoginModal: FC = () => {
  const token = useSelector((state: StoreState) => state.authenticate.token);

  const { replace, back, push, pathname, query } = useRouter();
  const isOpen = !!query.login;
  const handleToggle = useCallback(() => {
    if (pathname === '/login') {
      replace('/login');
      return;
    }
    if (query.backOnClose) {
      // back({ shallow: true });
      back();
    } else {
      push({ pathname: '/' }, undefined, { shallow: true });
    }
  }, [replace, back, push, pathname, query]);
  useEffect(() => {
    if (isOpen && token && !query.redirecting) {
      replace({ pathname: '/' });
    }
  }, [isOpen, token, replace, query.redirecting]);
  // const handleToggle = () => {
  //   onClose();
  // };
  return (
    <Modal
      closeable={false}
      isOpen={isOpen}
      onClose={handleToggle}
      title="Sign In"
      className={cx(classes.modal)}
      contentClassName={cx(classes.content)}
      centered={true}
      toggle={handleToggle}>
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
    </Modal>
  );
};

export default LoginModal;
