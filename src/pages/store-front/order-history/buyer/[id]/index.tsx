import React, { ComponentType, FC } from 'react';
import AccountLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import BuyerOrderListingContainer from 'components/StoreFront/Order/Buyer/Listing/BuyerOrderListingContainer';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const OrderHistoryPage = () => {
  return (
    <AccountLayout titleMobile="Orders">
      <BuyerOrderListingContainer />
    </AccountLayout>
  );
};

OrderHistoryPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OrderHistoryPage as FC<ComponentType & ComponentStatic>),
);
