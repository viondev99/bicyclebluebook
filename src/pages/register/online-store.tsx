import React from 'react';
import Head from 'next/head';
import RegisterOnlineStoreForm from 'components/Register/RegisterOnlineStore';
import { renderRegisterLayout } from 'layout/RegisterLayout/RegisterLayout';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const RegisterOnlineStore = () => {
  return (
    <>
      <Head>
        <script src="https://www.google.com/recaptcha/api.js" async defer />
        <title>Register - Bicyclebluebook.com</title>
        <meta name="description" content={`Bicycle Blue Book Register`} />
      </Head>
      <RegisterOnlineStoreForm />
    </>
  );
};

RegisterOnlineStore.renderLayout = renderRegisterLayout;

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(RegisterOnlineStore));
