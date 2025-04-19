import React, { FC, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';

import t from 'helpers/language';
import { toastError } from 'helpers/utils.helper';
import { verifyLinkSetNewPassword, setNewPassword } from 'api/authenticate.api';
import Button from '@ui/Buttons/Primary/Button';
import classes from './set-password-full-screen.module.scss';
import InputPassword from './InputPassword/InputPassword';

interface SetPasswordForm {
  password: string;
  confirmPassword: string;
}

const SetPasswordSchema = Yup.object().shape({
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

const SetPasswordFullScreen: FC = () => {
  const { replace, query } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (typeof query.ids === 'string') {
      verifyLinkSetNewPassword(query.ids)
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
    (values: SetPasswordForm) => {
      if (typeof query.ids === 'string') {
        setLoading(true);
        setNewPassword({
          email,
          ids: query.ids,
          new_password: values.password,
        })
          .then(() => {
            replace({
              pathname: '/set-password-success',
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
        <h2 style={{ marginBottom: 30 }}>Set Your Password</h2>
        <Formik initialValues={initFormValue} onSubmit={handleFormSubmit} validationSchema={SetPasswordSchema}>
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
export default SetPasswordFullScreen;
