import React, { ComponentType, FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Card from '@ui/Cards/index';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import BlockedUserComponent from 'components/BlockedUser';
import { ComponentStatic } from '../../../model/common';
import AccountPersonalLayout from '../../../layout/Account/Personal';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const BlockedUser: FC & ComponentStatic = () => {
  return (
    <AccountPersonalLayout titleMobile="Blocked User">
      <Card>
        <BlockedUserComponent />
      </Card>
    </AccountPersonalLayout>
  );
};

BlockedUser.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(BlockedUser as FC<ComponentType & ComponentStatic>),
);
