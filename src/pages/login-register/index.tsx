import React, { FC } from 'react';
import { NextPageContext } from 'next';
import { ComponentStatic } from 'model/common';
import LoginScreen from 'components/Login/LoginScreen/LoginScreen';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Login: FC & ComponentStatic = () => {
  return (
    <div className="wrapper-with-header">
      <LoginScreen />
    </div>
  );
};

Login.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/login');
};

export default withInjectAllSaga(Login);
