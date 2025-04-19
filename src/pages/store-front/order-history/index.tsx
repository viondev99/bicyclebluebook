import React, { ComponentType, FC } from 'react';
import AccountLayout from 'layout/Account/StoreFront';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import OrderListingContainer from '../../../components/StoreFront/Order/Listing/OrderListingContainer';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const OrderHistoryPage = () => {
  return (
    <AccountLayout titleMobile="Orders">
      <OrderListingContainer />
    </AccountLayout>
  );
};

OrderHistoryPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OrderHistoryPage as FC<ComponentType & ComponentStatic>),
);
