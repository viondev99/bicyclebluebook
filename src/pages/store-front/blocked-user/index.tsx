import React, { ComponentType, FC } from 'react';

import BlockedUserComponent from 'components/BlockedUser';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import Card from '@ui/Cards/index';
import StorefrontLayout from '../../../layout/Account/StoreFront';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import { ComponentStatic } from '../../../model/common';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const StorefrontUsers: FC & ComponentStatic = () => {
  return (
    <StorefrontLayout titleMobile="Blocked User">
      <Card>
        <BlockedUserComponent />
      </Card>
    </StorefrontLayout>
  );
};

StorefrontUsers.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(StorefrontUsers as FC<ComponentType & ComponentStatic>),
);
