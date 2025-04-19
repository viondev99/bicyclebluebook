import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from '../../model/common';
import CheckEmailFullScreen from '../../components/ForgotPassword/CheckEmailFullScreen/CheckEmailFullScreen';
import UnAuthLayout from '../../layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const CheckEmail: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Check Email - Bicyclebluebook.com</title>
        <meta name="keywords" content="Check Email" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgLogin}>
        <CheckEmailFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(CheckEmail));
