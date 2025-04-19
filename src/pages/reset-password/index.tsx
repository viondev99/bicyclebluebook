import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from '../../model/common';
import ResetPasswordFullScreen from '../../components/ForgotPassword/ResetPasswordFullScreen/ResetPasswordFullScreen';
import UnAuthLayout from '../../layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ResetPassword: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Reset Password - Bicyclebluebook.com</title>
        <meta name="keywords" content="Reset Password" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgResetPassword}>
        <ResetPasswordFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(ResetPassword));
