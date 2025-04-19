import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import AccountLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import OrderDetailContainer from 'components/StoreFront/Order/Detail/OrderDetailContainer';
import { getDetailOrder } from 'store/store-front/orders/orders.action';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const OrderHistoryDetailPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
  }, [query, dispatch]);

  return (
    <AccountLayout titleMobile="Orders">
      <OrderDetailContainer />
    </AccountLayout>
  );
};

OrderHistoryDetailPage.getInitialProps = () => {
  return {};
};

OrderHistoryDetailPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OrderHistoryDetailPage as FC<ComponentType & ComponentStatic>),
);
