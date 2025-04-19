import React, { ComponentType, FC } from 'react';

import Users from 'components/StoreFront/Account/Users/Users';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import StorefrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const StorefrontUsers: FC & ComponentStatic = () => {
  return (
    <StorefrontLayout titleMobile="Users">
      <Users />
    </StorefrontLayout>
  );
};

StorefrontUsers.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(StorefrontUsers as FC<ComponentType & ComponentStatic>),
);
