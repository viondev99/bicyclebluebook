import React, { FC } from 'react';
import { Formik, FormikProps, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { login } from 'store/authenticate/authenticate.action';
import * as Yup from 'yup';
import t from 'helpers/language';
import icAuthPassword from 'assets/img/authenticate/ic_password.svg';
import icAuthEmail from 'assets/img/authenticate/ic_email.svg';
import CheckBox from '@ui/CheckBox';
import FormikInput from 'components/Formik/Input/FormikInput';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import classes from './loginForm.module.scss';

interface LoginForm {
  username: string;
  password: string;
}

interface Props {}

const LoginSchema = Yup.object().shape({
  email: Yup.string().required(t('authenticate.validate.emailInvalid')).email(t('authenticate.validate.emailRequired')),
  password: Yup.string()
    .required(t('authenticate.validate.passwordRequired'))
    .min(8, t('authenticate.validate.passwordLength')),
});

const initFormValue = {
  email: '',
  password: '',
};

export const LoginForm: FC<Props> = () => {
  const dispatch = useDispatch();

  const handleFormSubmit = (values: LoginForm) => {
    dispatch(login(values));
  };
  return (
    <Formik initialValues={initFormValue} onSubmit={handleFormSubmit} validationSchema={LoginSchema}>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit} className={cx(classes.form)}>
          <h3 className={classes.label}>Email Address</h3>
          <FormikInput
            name="email"
            placeholder="Email Address"
            renderPrefix={<img src={icAuthEmail} style={{ width: 25, height: 25 }} alt={'error-icon'} />}
          />
          <h3 className={classes.label} style={{ marginTop: 30 }}>
            Password
          </h3>
          <FormikInput
            name="password"
            type="password"
            placeholder="Password"
            renderPrefix={<img src={icAuthPassword} style={{ width: 25, height: 25 }} alt={'error-icon'} />}
          />

          <CheckBox name="remember_me" className={classes.rememberCheckBox} label={'Keep me signed in'} />

          <Button type="submit" style={{ width: '100%' }}>
            Sign in
          </Button>
        </Form>
      )}
    </Formik>
  );
};
