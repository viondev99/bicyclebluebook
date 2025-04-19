import React, { FC, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';

import icAuthEmail from 'assets/img/authenticate/ic_email.svg';
import icLeftArrowPrimary from 'assets/img/listing/ic_left_arrow.svg';
import t from 'helpers/language';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { sendLinkResetPassword } from 'api/authenticate.api';
import FormikInput from 'components/Formik/Input/FormikInput';
import Button from '@ui/Buttons/Primary/Button';
import classes from './forgot-password-full-screen.module.scss';

interface ForgotPasswordForm {
  email: string;
}

interface Props {}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().required(t('authenticate.validate.emailInvalid')).email(t('authenticate.validate.emailRequired')),
});

const initFormValue = {
  email: '',
};

const ForgotPasswordFullScreen: FC = () => {
  const { replace } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = useCallback(
    (values: ForgotPasswordForm) => {
      setLoading(true);
      sendLinkResetPassword(values.email)
        .then(() => {
          toastSuccess(t('common.sendResetLink'));
          replace({
            pathname: '/check-email',
            query: {
              email: values.email,
            },
          });
          setLoading(false);
        })
        .catch((error) => {
          toastError(error);
          setLoading(false);
        });
    },
    [replace],
  );

  return (
    <div style={{ background: '#fff', margin: '20px 0px' }}>
      <div className={classes.content}>
        <h2 style={{ marginBottom: 30 }}>Forgot Your Password</h2>
        <p className={classes.description}>
          Please enter the email address you used to sign up and we will send you a reset link.
        </p>
        <Formik initialValues={initFormValue} onSubmit={handleFormSubmit} validationSchema={ForgotPasswordSchema}>
          {(props: FormikProps<any>) => (
            <Form onSubmit={props.handleSubmit}>
              <h3 className={classes.label}>Email Address</h3>
              <FormikInput
                name="email"
                placeholder="Email Address"
                renderPrefix={<img src={icAuthEmail} style={{ width: 25, height: 25 }} alt={'error-icon'} />}
              />
              <Button disabled={loading} type="submit" style={{ width: '100%', marginTop: 30 }}>
                Send Reset Link
              </Button>
            </Form>
          )}
        </Formik>
        <div style={{ marginTop: 50 }}>
          <Link href={'/login'}>
            <a className={classes.link}>
              <img src={icLeftArrowPrimary} alt={'error-icon'} />
              Never mind, I remember now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordFullScreen;
