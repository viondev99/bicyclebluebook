import React, { ComponentType, FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import OrderListingContainer from 'components/Account/Personal/Orders/Listing/OrderListingContainer';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import AccountPersonalLayout from '../../../layout/Account/Personal';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Orders = () => {
  return (
    <AccountPersonalLayout titleMobile="Orders">
      <OrderListingContainer />
    </AccountPersonalLayout>
  );
};

Orders.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(Orders as FC<ComponentType & ComponentStatic>),
);
