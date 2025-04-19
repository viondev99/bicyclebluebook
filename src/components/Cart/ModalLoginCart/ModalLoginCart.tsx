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
import FormikInput from '../../Formik/Input/FormikInput';
import classes from './modal-login-cart.module.scss';

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

const ModalLoginCart: FC<Props> = ({ onClose, open }) => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((store: StoreState) => !!store.authenticate.token);
  const loggingIn = useSelector((store: StoreState) => store.authenticate.loggingIn);
  const carts = useSelector((store: StoreState) => store.checkout.cart.carts);
  const isAllItemBBB = useMemo(() => {
    return carts.length > 0 && carts.every((i) => i.seller_is_bbb);
  }, [carts]);
  const canGuestCheckout = isAllItemBBB && !isLoggedIn;
  const handleFormSubmit = (values: LoginForm) => {
    const loginForm: LoginModel = {
      email: values.email,
      password: values.password,
      roles: [Roles.PERSONAL],
    };
    dispatch(login(loginForm));
  };
  return (
    <Modal
      closeable={false}
      isOpen={open}
      style={{ width: 700 }}
      onClose={onClose}
      title="Check out as member"
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
                  <a>Forgot Password?</a>
                </Link>
              }
              classSuffix={cx(classes.forgotPasswordText)}
            />
            <CheckBox name="remember_me" className={classes.rememberCheckBox} label={'Keep me signed in'} />
            <Button type="submit" disabled={loggingIn}>
              Sign in and Checkout
            </Button>
          </Form>
        )}
      </Formik>
      {canGuestCheckout && (
        <>
          <h4 className={classes.rememberCheckBox}>Or</h4>
          <div className="d-flex align-items-center">
            <Link href={'/checkout/shipping'}>
              <Button buttonType="outline">Checkout as Guest</Button>
            </Link>
            <span className={classes.checkoutGuestDescription}>
              You’ll be able to register
              <br /> during checkout
            </span>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalLoginCart;
