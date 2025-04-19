import React from 'react';
import { renderRegisterLayout } from 'layout/RegisterLayout/RegisterLayout';
import Head from 'next/head';
import RegisterTradeInPartnerSection from 'components/Register/RegisterTradeInPartner';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const RegisterTradeInPartner = () => {
  return (
    <>
      <Head>
        <script src="https://www.google.com/recaptcha/api.js" async defer />
        <title>Register - Bicyclebluebook.com</title>
        <meta name="description" content={`Bicycle Blue Book Register`} />
      </Head>

      <RegisterTradeInPartnerSection />
    </>
  );
};

RegisterTradeInPartner.renderLayout = renderRegisterLayout;

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(RegisterTradeInPartner));
