import React, { ComponentType, FC } from 'react';

import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import CasesComponent from 'components/StoreFront/ListCases';
import StorefrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const StorefrontUsers: FC & ComponentStatic = () => {
  return (
    <StorefrontLayout titleMobile="Cases">
      <CasesComponent />
    </StorefrontLayout>
  );
};

StorefrontUsers.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(StorefrontUsers as FC<ComponentType & ComponentStatic>),
);
