import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import AccountLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder } from 'store/store-front/orders/orders.action';
import CancelOrderContainer from 'components/StoreFront/Order/Cancel/CancelOrderContainer';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const CancelOrderPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
  }, [query, dispatch]);

  return (
    <AccountLayout titleMobile="Orders">
      <CancelOrderContainer />
    </AccountLayout>
  );
};

CancelOrderPage.getInitialProps = () => {
  return {};
};

CancelOrderPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(CancelOrderPage as FC<ComponentType & ComponentStatic>),
);
