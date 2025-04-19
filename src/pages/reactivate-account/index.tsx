import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from '../../model/common';
import ReactivateAccountFullScreen from '../../components/ForgotPassword/ReactivateAccountFullScreen/ReactivateAccountFullScreen';
import UnAuthLayout from '../../layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ReactivateAccount: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Reactivate Account - Bicyclebluebook.com</title>
        <meta name="keywords" content="Reactivate Account" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgResetPassword}>
        <ReactivateAccountFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(ReactivateAccount));
