import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from '../../model/common';
import ResetPasswordSuccessFullScreen from '../../components/ForgotPassword/ResetPasswordSuccessFullScreen/ResetPasswordSuccessFullScreen';
import UnAuthLayout from '../../layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ResetPasswordSuccess: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Set New Password Success - Bicyclebluebook.com</title>
        <meta name="keywords" content="Set New Password Success" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgResetPassword}>
        <ResetPasswordSuccessFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(ResetPasswordSuccess));
