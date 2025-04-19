import React, { useState, useEffect } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import { useRouter } from 'next/router';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useSelector } from 'react-redux';
import StoreState from 'model/store/index';
import Button from '@ui/Buttons/Primary/Button';
import images from 'assets/images';
import useScreenDetect from 'hooks/useScreenDetect';
import { uuid } from 'uuidv4';
import { checkExistLocalStorage, kountConfigEnv } from 'helpers/utilities.helper';
import RegisterHeading from '../Heading';
import Form, { RegisterForm } from './Form';
import classes from './personalForm.module.scss';
import SocialForm, { FormData } from './SocialForm';
import BackButton from '../BackButton';

const PersonalForm = () => {
  const currentDevice = useScreenDetect();
  const router = useRouter();
  const twitterInfo = useSelector((store: StoreState) => store.authenticate.twitterInfo);
  const [formInitValue, setFormInitValue] = useState<RegisterForm>({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    country: 'US',
    zip_code: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    is_setting: false,
    user_name: '',
    description: '',
  });
  const [googleToken, setGoogleToken] = useState<null | string>(null);
  const [facebookToken, setFacebookToken] = useState<null | string>(null);
  const [twitterToken, setTwitterToken] = useState<null | {
    twitter_token?: string;
    twitter_token_secret?: string;
  }>(null);
  const [displayEmailFormMobile, setDisplayEmailFormMobile] = useState<boolean>(false);

  const initValue = {
    form: formInitValue,
    googleToken,
    facebookToken,
    ...twitterToken,
  };
  useEffect(() => {
    if (twitterInfo) {
      let payload = {
        ...formInitValue,
        first_name: twitterInfo?.name || '',
      };
      if (twitterInfo?.email) {
        payload = { ...payload, email: twitterInfo?.email };
      }
      setFormInitValue(payload);
      setTwitterToken({
        twitter_token: twitterInfo?.twitter_token,
        twitter_token_secret: twitterInfo?.twitter_token_secret,
      });
    }
  }, [twitterInfo]);

  useEffect(() => {
    let session_id: string;
    if (!localStorage.getItem('sessionIDForKount')) {
      session_id = uuid().replace(/-/g, '');
      localStorage.setItem('sessionIDForKount', session_id);
    }
    session_id = checkExistLocalStorage() && localStorage.getItem('sessionIDForKount');
    import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
      kountSDK(kountConfigEnv(), session_id);
    });
  }, []);

  const handleSocialForm = (provider: string, data: FormData) => {
    setFormInitValue({ ...formInitValue, ...data });
    setDisplayEmailFormMobile(true);
    switch (provider) {
      case 'google':
        setGoogleToken(data.accessToken);
        break;
      case 'facebook':
        setFacebookToken(data.accessToken);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cx('container', classes.personal_form)}>
      <Row>
        <Col>
          <BackButton
            onClick={() => {
              router.push('/register');
            }}
          />
        </Col>
      </Row>
      <RegisterHeading title="Personal" />

      <Row
        className={cx(classes.body, {
          'd-none': !displayEmailFormMobile && currentDevice.isMediumScreen(),
          'd-flex': displayEmailFormMobile || !currentDevice.isMediumScreen(),
        })}>
        <Col lg={9} className={classes.rightSection}>
          <Card className={cx(classes.card)}>
            <Form initValue={initValue} />
          </Card>
        </Col>
        <Col lg={3} className={classes.leftSection}>
          <Card className={cx(classes.card)}>
            <h4>Sign up with</h4>
            <SocialForm handleSubmit={handleSocialForm} />
          </Card>
        </Col>
      </Row>
      <Row
        className={cx(classes.body, {
          'd-flex d-lg-none': !displayEmailFormMobile && currentDevice.isMediumScreen(),
          'd-none': (displayEmailFormMobile && currentDevice.isMediumScreen()) || !currentDevice.isMediumScreen(),
        })}>
        <Col className={classes.mobileForm}>
          <div className={cx(classes.card)}>
            <Button
              className={cx(classes.socialBtn)}
              buttonType={'transparent'}
              onClick={() => setDisplayEmailFormMobile(true)}>
              <img src={images.icEmail} alt="Email logo" />
              <span className={cx(classes.socialLinkMobile)}>
                Sign up with Email <img src={images.messages.icArrowRightGrey} alt="Icon next" />
              </span>
            </Button>
            <SocialForm handleSubmit={handleSocialForm} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalForm;
