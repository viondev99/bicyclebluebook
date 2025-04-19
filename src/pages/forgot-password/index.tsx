import React, { FC } from 'react';
import Head from 'next/head';

import images from 'assets/images';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import ForgotPasswordFullScreen from 'components/ForgotPassword/ForgotPasswordFullScreen/ForgotPasswordFullScreen';
import UnAuthLayout from 'layout/UnAuthLayout/UnAuthLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ForgotPassword: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Forgot Password - Used Bikes for Sale - BicycleBlueBook</title>
        <meta name="description" content="Forgot Password" />
      </Head>
      <UnAuthLayout backgroundImage={images.authenticate.bgLogin}>
        <ForgotPasswordFullScreen />
      </UnAuthLayout>
    </>
  );
};

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(ForgotPassword));
