import React from 'react';
import { renderRegisterLayout } from 'layout/RegisterLayout/RegisterLayout';

import RegisterSuccessSection from 'components/Register/RegisterSuccess';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const RegisterSuccess = () => {
  return <RegisterSuccessSection />;
};

RegisterSuccess.renderLayout = renderRegisterLayout;

export default withInjectAllSaga(withAuthenticate({ requireAuth: false })(RegisterSuccess));
