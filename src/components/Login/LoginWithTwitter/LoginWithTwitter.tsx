import React, { FC, useCallback, ReactElement } from 'react';
import TwitterLogin from 'react-twitter-auth';
import CONFIG from 'config';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { loginByTwitter } from 'store/authenticate/authenticate.action';
import iconTwitterBlue from 'assets/img/logo/ic_twitter_blue.svg';
// import { toastError } from 'helpers/utils.helper';
import classes from './login-twitter.module.scss';

const loginUrl = `${CONFIG.BASE_URL}auth/api/v1/personal/twitter-auth`;
const requestTokenUrl = `${CONFIG.BASE_URL}auth/api/v1/personal/twitter-reverse`;

interface Props {
  children?: ReactElement;
  className?: string;
}

const LoginWithTwitter: FC<Props> = ({ children, className }) => {
  const dispatch = useDispatch();

  const loginFailed = useCallback(() => {
    // toastError('Login failed !.');
  }, []);

  const handleLogin = useCallback(
    async (response: Response) => {
      const payload = await response.json();
      dispatch(loginByTwitter(JSON.stringify(payload)));
    },
    [dispatch],
  );
  return (
    <div className={cx(className, { [classes.wrap]: !children })}>
      <TwitterLogin
        loginUrl={loginUrl}
        onFailure={loginFailed}
        onSuccess={(handleLogin as unknown) as (response: string) => void} // hack-around using type assertion
        style={{ display: 'block', background: 'none', border: 'none', margin: 0, padding: 0 }}
        requestTokenUrl={requestTokenUrl}
        showIcon={false}
        credentials={'include'}>
        {children || <img src={iconTwitterBlue} alt="icon twitter" className={classes.icon} />}
      </TwitterLogin>
    </div>
  );
};

export default LoginWithTwitter;
