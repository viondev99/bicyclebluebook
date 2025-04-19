import React, { FC, useCallback } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import Image from 'next/image';
import iconGoogleLogo from 'assets/img/logo/ic_google.png';
import iconFacebookLogo from 'assets/img/logo/ic_facebook.png';
import { useDispatch } from 'react-redux';
import { loginByGoogle, loginByFacebook } from 'store/authenticate/authenticate.action';
import CONFIG from 'config';
import { useGoogleLogin } from '@react-oauth/google';
import classes from './socialForm.module.scss';
import LoginWithTwitter from '../LoginWithTwitter/LoginWithTwitter';

interface SocialLoginFormProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  handleClose?: () => void;
}

const SocialForm: FC<Props> = ({ handleClose }) => {
  const dispatch = useDispatch();

  const responseFacebook = useCallback(
    (response: any) => {
      dispatch(loginByFacebook(response.accessToken));
    },
    [dispatch],
  );

  const responseGoogleSuccess = useCallback(
    (response) => {
      dispatch(loginByGoogle(response?.access_token));
    },
    [dispatch],
  );

  const responseGoogleFail = useCallback(() => {}, []);

  const login = useGoogleLogin({
    onSuccess: responseGoogleSuccess,
    onError: responseGoogleFail,
  });
  return (
    <div className={classes.wrap}>
      <span className={classes.label}>or sign in with</span>
      <Button type="button" className={cx(classes.button)} onClick={() => login()} buttonType={'transparent'}>
        <Image unsized src={iconGoogleLogo} alt="Google logo" className={classes.icon} />
      </Button>
      <FacebookLogin
        appId={CONFIG.SOCIAL.FB_APP_ID}
        callback={responseFacebook}
        render={(renderProps) => (
          <Button type="button" onClick={renderProps.onClick} className={cx(classes.button)} buttonType={'transparent'}>
            <Image unsized src={iconFacebookLogo} alt="Facebook logo" className={classes.icon} />
          </Button>
        )}
      />
      <LoginWithTwitter />
    </div>
  );
};

export default SocialForm;
