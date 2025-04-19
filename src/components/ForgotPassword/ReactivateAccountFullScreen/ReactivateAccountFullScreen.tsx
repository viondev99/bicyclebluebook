import React, { FC, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';

import t from 'helpers/language';
import { toastError } from 'helpers/utils.helper';
import { verifyLinkReactivateAccount, resetPasswordToReactivateAccount } from 'api/authenticate.api';
import Button from '@ui/Buttons/Primary/Button';
import classes from './reactivate-account-full-screen.module.scss';
import InputPassword from './InputPassword/InputPassword';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, t('common.validate.newPasswordLength'))
    .required(t('common.validate.newPasswordRequired')),
  confirmPassword: Yup.string()
    .required(t('common.validate.confirmPasswordRequired'))
    .oneOf([Yup.ref('password')], t('common.validate.confirmPasswordMatch')),
});

const initFormValue = {
  password: '',
  confirmPassword: '',
};

const ReactivateAccountFullScreen: FC = () => {
  const { replace, query } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (typeof query.ids === 'string') {
      verifyLinkReactivateAccount(query.ids)
        .then((response) => {
          setEmail(response.data.email);
          setLoading(false);
        })
        .catch((error) => {
          toastError(error);
          setLoading(false);
        });
    }
  }, [query]);

  const handleFormSubmit = useCallback(
    (values: ResetPasswordForm) => {
      if (typeof query.ids === 'string') {
        setLoading(true);
        resetPasswordToReactivateAccount({
          email,
          ids: query.ids,
          new_password: values.password,
        })
          .then(() => {
            replace({
              pathname: '/reset-password-success',
            });
            setLoading(false);
          })
          .catch((error) => {
            toastError(error);
            setLoading(false);
          });
      }
    },
    [email, query, replace],
  );

  return (
    <div style={{ background: '#fff', margin: '20px 0px' }}>
      <div className={classes.content}>
        <h2 style={{ marginBottom: 30 }}>Reset Your Password</h2>
        <Formik initialValues={initFormValue} onSubmit={handleFormSubmit} validationSchema={ResetPasswordSchema}>
          {(props: FormikProps<any>) => (
            <Form onSubmit={props.handleSubmit}>
              <h3 className={classes.label}>New Password</h3>
              <InputPassword name={'password'} placeholder={'New password'} />
              <h3 className={classes.label} style={{ marginTop: 30 }}>
                Confirm Password
              </h3>
              <InputPassword name={'confirmPassword'} placeholder={'Confirm password'} />
              <Button disabled={loading} type="submit" style={{ width: '100%', marginTop: 30 }}>
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default ReactivateAccountFullScreen;
