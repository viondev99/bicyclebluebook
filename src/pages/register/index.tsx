import React from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import RegisterFullScreen from 'components/Register/RegisterFullScreen/RegisterFullScreen';
import UnAuthLayout from '../../layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const RegisterScreen = () => {
  return (
    <>
      <Head>
        <script src="https://www.google.com/recaptcha/api.js" async defer />
        <title>Register - Bicyclebluebook.com</title>
        <meta name="description" content={`Bicycle Blue Book Register`} />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgRegister}>
        <RegisterFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(RegisterScreen));
