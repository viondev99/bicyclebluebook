import React, { FC, useMemo } from 'react';
import cx from 'classnames';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Form, Formik, FormikProps } from 'formik';
import Modal from '@ui/Modal/Modal';
import CheckBox from '@ui/CheckBox';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import { login } from 'store/authenticate/authenticate.action';
import StoreState from 'model/store';
import { LoginModel } from 'model/store/authenticate.model';
import { Roles } from 'constants/roles';
import { useRouter } from 'next/router';
import FormikInput from '../../Formik/Input/FormikInput';
import classes from './modal-login-cart-p2p.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface LoginForm {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().required(t('authenticate.validate.emailRequired')).email(t('authenticate.validate.emailInvalid')),
  password: Yup.string()
    .required(t('authenticate.validate.passwordRequired'))
    .min(8, t('authenticate.validate.passwordLength')),
});

const initFormValue = {
  email: '',
  password: '',
};

const ModalLoginCartP2P: FC<Props> = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggingIn = useSelector((store: StoreState) => store.authenticate.loggingIn);

  const handleFormSubmit = (values: LoginForm) => {
    const loginForm: LoginModel = {
      email: values.email,
      password: values.password,
      roles: [Roles.PERSONAL],
    };
    router.replace(`/cart?redirectUrl=/checkout/shipping`);
    dispatch(login(loginForm));
  };
  return (
    <Modal
      closeable={false}
      isOpen={open}
      style={{ width: 750 }}
      onClose={onClose}
      title="Login to complete checkout"
      className={cx(classes.modal)}
      contentClassName={cx(classes.content)}
      centered={true}>
      <Formik initialValues={initFormValue} onSubmit={handleFormSubmit} validationSchema={LoginSchema}>
        {(props: FormikProps<any>) => (
          <Form className={cx(classes.form)}>
            <FormikInput name="email" placeholder="Email Address" className={cx(classes.input)} />
            <FormikInput
              className={cx('mt-3', classes.passwordInput)}
              name="password"
              type="password"
              placeholder="Password"
              renderSuffix={
                <Link href="/forgot-password">
                  <a className={classes.customLink}>Forgot Password?</a>
                </Link>
              }
              classSuffix={cx(classes.forgotPasswordText)}
            />
            <CheckBox name="remember_me" className={classes.rememberCheckBox} label={'Keep me signed in'} />
            <div className={classes.wrapFormBottom}>
              <Button type="submit" disabled={loggingIn}>
                Sign in and Checkout
              </Button>
              <div className={classes.wrapRegister}>
                <div className={classes.text}>Don’t have an account?</div>
                <Link href="/register/">
                  <a className={classes.link}>Sign up</a>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ModalLoginCartP2P;
