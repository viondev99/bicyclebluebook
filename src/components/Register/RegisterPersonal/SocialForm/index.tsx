import React, { FC, useCallback } from 'react';
import images from 'assets/images';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Button from '@ui/Buttons/Primary/Button';
import CONFIG from 'config';
import cx from 'classnames';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import classes from './socialForm.module.scss';
import LoginWithTwitter from '../../../Login/LoginWithTwitter/LoginWithTwitter';

export interface FormData {
  email: string;
  first_name: string;
  last_name: string;
  accessToken: string;
}
interface SocialLoginFormProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  handleSubmit: (provider: string, data: FormData) => void;
}

const SocialForm: FC<Props> = ({ handleSubmit }) => {
  const responseFacebook = useCallback(
    (response: any) => {
      const data = {
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        accessToken: response.accessToken,
      };
      handleSubmit('facebook', data);
    },
    [handleSubmit],
  );

  const responseGoogleSuccess = useCallback(
    async (response) => {
      const profileData = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
          Authorization: `Bearer ${response?.access_token}`,
        },
      });
      const data = {
        email: profileData.data.email,
        first_name: profileData.data.given_name,
        last_name: profileData.data.family_name,
        accessToken: response?.access_token,
      };
      handleSubmit('google', data);
    },
    [handleSubmit],
  );

  const responseGoogleFail = useCallback(() => {}, []);

  const login = useGoogleLogin({
    onSuccess: responseGoogleSuccess,
    onError: responseGoogleFail,
  });
  return (
    <div className={classes.wrap}>
      <Button type="button" className={cx(classes.social_btn)} onClick={() => login()} buttonType={'transparent'}>
        <img src={images.iconGoogleLogo} alt="Google logo" className={classes.googleIcon} />
        <span className={cx(classes.socialLinkMobile)}>
          Sign up with Google <img src={images.messages.icArrowRightGrey} alt="Icon next" />
        </span>
      </Button>
      <FacebookLogin
        appId={CONFIG.SOCIAL.FB_APP_ID}
        callback={responseFacebook}
        fields="name,email,first_name,last_name"
        render={(renderProps) => (
          <Button
            type="button"
            onClick={renderProps.onClick}
            className={cx(classes.social_btn)}
            buttonType={'transparent'}>
            <img src={images.iconFacebookLogo} alt="Facebook logo" />
            <span className={cx(classes.socialLinkMobile)}>
              Sign up with Facebook <img src={images.messages.icArrowRightGrey} alt="Icon next" />
            </span>
          </Button>
        )}
      />
      <LoginWithTwitter>
        <Button type="button" className={cx(classes.social_btn, classes.btn_twitter)} buttonType={'transparent'}>
          <img src={images.iconTwitterBlue} alt="Google logo" className={classes.googleIcon} />
          <span className={cx(classes.socialLinkMobile)}>
            Sign up with Twitter <img src={images.messages.icArrowRightGrey} alt="Icon next" />
          </span>
        </Button>
      </LoginWithTwitter>
    </div>
  );
};

export default SocialForm;
