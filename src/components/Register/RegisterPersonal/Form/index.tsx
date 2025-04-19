/* eslint-disable no-param-reassign */
import React, { FC, useCallback, useRef, useState } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import Button from '@ui/Buttons/Primary/Button';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import t from 'helpers/language';
import { useDispatch } from 'react-redux';
import {
  registerPersonal,
  registerPersonalByGoogle,
  registerPersonalByFacebook,
  registerPersonalByTwitter,
} from 'store/authenticate/authenticate.action';
import { useListCommonState } from 'hooks/useListCommonState';
import Recaptcha from 'react-recaptcha';
import FormikCheckBox from 'components/Formik/CheckBox/FormikCheckbox';
import _set from 'lodash/set';
import cx from 'classnames';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import CONFIG from 'config';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icClose from 'assets/img/account/personal/ic_close_circle.svg';
import useScreenDetect from 'hooks/useScreenDetect';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import classes from './form.module.scss';

export interface RegisterForm {
  email: string;
  user_name: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  country: string;
  zip_code: string;
  phone: string;
  apartment?: string;
  address: string;
  city: string;
  state: string;
  is_setting: boolean;
  description: string;
}

const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required(t('common.validate.firstNameRequired'))
    .max(250, t('common.validate.firstNameLength')),
  last_name: Yup.string().required(t('common.validate.lastNameRequired')).max(250, t('common.validate.lastNameLength')),
  email: Yup.string()
    .required(t('authenticate.validate.emailRequiredRegister'))
    .matches(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      t('authenticate.validate.emailInvalid'),
    ),
  phone: Yup.string()
    .notRequired()
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  zip_code: Yup.string()
    .notRequired()
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  password: Yup.string()
    .required(t('authenticate.validate.passwordRequired'))
    .min(8, t('authenticate.validate.passwordLength')),
  confirm_password: Yup.string()
    .required(t('authenticate.validate.confirmPasswordRequired'))
    .oneOf([Yup.ref('password')], t('authenticate.validate.confirmPasswordMatch')),
});

interface Props {
  initValue: {
    form: RegisterForm;
    googleToken: string | null;
    facebookToken: string | null;
    twitter_token?: string;
    twitter_token_secret?: string;
  };
}

const RegisterForm: FC<Props> = ({ initValue }) => {
  const dispatch = useDispatch();
  const recaptchaInstance = useRef(null);
  const [verifyCaptcha, setVerifyCaptcha] = useState(null);
  const stateOptions = useListCommonState();
  const [error, setError] = useState({
    captcha: false,
  });
  const [show, setShow] = useState(false);
  const { currentWidthScreen } = useScreenDetect();
  const session_id = checkExistLocalStorage() && localStorage.getItem('sessionIDForKount');
  const callback = useCallback(() => {}, []);

  const verifyCaptchaCallback = useCallback((response: any) => {
    setVerifyCaptcha(response);
    setError({
      ...error,
      captcha: false,
    });
  }, []);

  const resetCaptcha = useCallback(() => {
    recaptchaInstance.current.reset();
  }, []);

  const expiredCaptchaCallback = useCallback(() => {
    resetCaptcha();
  }, [resetCaptcha]);

  const handleFormSubmit = useCallback(
    (values: RegisterForm) => {
      if (!show) {
        delete values.apartment;
      }
      const data = {
        ...values,
        token_captcha: verifyCaptcha,
        session_id,
      };

      if (initValue.googleToken) {
        const formData = _set(data, 'google_token', initValue.googleToken);
        dispatch(registerPersonalByGoogle(formData));
      } else if (initValue.facebookToken) {
        const formData = _set(data, 'facebook_token', initValue.facebookToken);
        dispatch(registerPersonalByFacebook(formData));
      } else if (initValue.twitter_token) {
        dispatch(
          registerPersonalByTwitter({
            ...data,
            twitter_token: initValue.twitter_token,
            twitter_token_secret: initValue.twitter_token_secret,
          }),
        );
      } else {
        dispatch(registerPersonal(data));
      }

      resetCaptcha();
      setVerifyCaptcha(null);
    },
    [
      show,
      verifyCaptcha,
      initValue.googleToken,
      initValue.facebookToken,
      initValue.twitter_token,
      initValue.twitter_token_secret,
      resetCaptcha,
      dispatch,
    ],
  );

  const handleValidateCustom = () => {
    let error = {
      captcha: false,
    };
    if (!verifyCaptcha) {
      error.captcha = true;
    }
    setError(error);
  };

  const handleShowOrUnshow = useCallback(() => {
    setShow(!show);
  }, [show]);

  return (
    <Formik
      initialValues={initValue.form}
      onSubmit={handleFormSubmit}
      validationSchema={RegisterSchema}
      enableReinitialize
      validate={handleValidateCustom}>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit}>
          <div>
            <h3>Personal Information</h3>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>First Name</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="first_name" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Last Name</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="last_name" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Email Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput
                  className={cx(classes.input)}
                  name="email"
                  disabled={
                    (initValue.facebookToken !== null || initValue.googleToken !== null) && !!initValue?.form?.email
                  }
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Username</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput autoComplete={'off'} className={cx(classes.input)} name="user_name" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Password</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput
                  className={cx(classes.input)}
                  name="password"
                  type="password"
                  autoComplete={'new_password'}
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Confirm password</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="confirm_password" type="password" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Phone number</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextMask className={cx(classes.input)} name="phone" typeMask="phone" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Description</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextarea className={cx(classes.input)} name="description" rows={3} />
              </div>
            </div>
          </div>

          <div>
            <h3 className={cx(classes.contentTitle)}>Your Address</h3>
            <Button buttonSize="s" buttonType="transparent" onClick={handleShowOrUnshow}>
              <img src={!show ? icAdd : icClose} alt="" />
              <h4 className={cx(classes.label_col, classes.apartmentLabel)}>
                {!show ? 'Add' : 'Remove'} Apartment/Suite Number
              </h4>
            </Button>
            {show && (
              <div className={cx('form-group row', classes.formItem)}>
                <h4 className={cx('col-sm-4', classes.label_col)}>
                  Apartment/{currentWidthScreen < 1200 && currentWidthScreen >= 576 && <br />}Suite No.
                </h4>
                <div className={cx('col-sm-8', classes.input_col)}>
                  <FormikInput className={cx(classes.input)} name="apartment" />
                </div>
              </div>
            )}
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="address" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>City</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="city" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>State</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikSelect
                  inputId={'state-select-step2-register-personal'}
                  options={stateOptions}
                  className={cx(classes.input)}
                  name="state"
                  isSearchable={true}
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Zip code</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="zip_code" />
              </div>
            </div>
          </div>
          <div className="form-group mt-4 d-flex">
            <FormikCheckBox name="is_setting" className={cx(classes.checkBox)} />
            <span className={classes.checkboxText}>
              Check if you would like to receive marketing communications regarding Bicycle Blue Book products,
              services, and events. (You can unsubscribe in your preferences at any time.)
            </span>
          </div>
          <div className="form-group mt-4">
            <Recaptcha
              ref={recaptchaInstance}
              render="explicit"
              verifyCallback={verifyCaptchaCallback}
              onloadCallback={callback}
              expiredCallback={expiredCaptchaCallback}
              sitekey={CONFIG.RECAPCHA_SITE_KEY}
              // size="compact"
            />
            {error.captcha && <div className={classes._errorText}>{t('capcha.empty')}</div>}
          </div>
          <FormikInput name="country" type="hidden" />
          <div className="mt-4 ">
            <Button type="submit" className="float-right float-md-left">
              Create Account
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
