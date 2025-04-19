import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from '../../model/common';
import SetPasswordFullScreen from '../../components/ForgotPassword/SetPasswordFullScreen/SetPasswordFullScreen';
import UnAuthLayout from '../../layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ResetPassword: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Set New Password - Bicyclebluebook.com</title>
        <meta name="keywords" content="Set New Password" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgResetPassword}>
        <SetPasswordFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(ResetPassword));
