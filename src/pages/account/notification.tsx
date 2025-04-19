import React, { ComponentType, FC } from 'react';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import AccountPersonalLayout from '../../layout/Account/Personal';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';
import { ComponentStatic } from '../../model/common';
import SettingNotification from '../../components/Notification/SettingNotification/SettingNotification';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Notification: FC & ComponentStatic = () => {
  return (
    <AccountPersonalLayout titleMobile="Notifications">
      <SettingNotification />
    </AccountPersonalLayout>
  );
};

Notification.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(Notification as FC<ComponentType & ComponentStatic>),
);
