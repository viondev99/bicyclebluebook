import React from 'react';
import Head from 'next/head';
import RegisterPersonalForm from 'components/Register/RegisterPersonal';
import { renderRegisterLayout } from 'layout/RegisterLayout/RegisterLayout';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const RegisterPersonal = () => {
  return (
    <>
      <Head>
        <script src="https://www.google.com/recaptcha/api.js" async defer />
        <title>Register - Bicyclebluebook.com</title>
        <meta name="description" content={`Bicycle Blue Book Register`} />
      </Head>
      <RegisterPersonalForm />
    </>
  );
};

RegisterPersonal.renderLayout = renderRegisterLayout;

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(RegisterPersonal));
