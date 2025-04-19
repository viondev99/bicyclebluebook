import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import LoginFullScreen from 'components/Login/LoginFullScreen/LoginFullScreen';
import UnAuthLayout from 'layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Login: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Login - Used Bicycles For Sale - BicycleBlueBook.com</title>
        <meta name="keywords" content="used bicycles for sale" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgLogin}>
        <LoginFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(Login));
