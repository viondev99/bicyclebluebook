import React, { FC, useEffect } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Container from 'reactstrap/lib/Container';
import { useDispatch } from 'react-redux';

import * as authenticateActions from 'store/authenticate/authenticate.action';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';
import { ComponentStatic } from '../../model/common';

const LoginRegister: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authenticateActions.logout());
    // dispacth logout here
  }, [dispatch]);
  return (
    <Container>
      <div style={{ height: 400 }} className="d-flex justify-content-center align-items-center">
        We are logging you out
      </div>
    </Container>
  );
};

LoginRegister.getInitialProps = () => {
  return {};
};

LoginRegister.renderLayout = renderMainLayout;

export default withInjectAllSaga(LoginRegister);
