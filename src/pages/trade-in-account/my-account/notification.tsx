import React, { FC } from 'react';
import NotificationContainer from 'components/PartnerPortal/Account/Notification';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Notification: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Notification'}>
      <NotificationContainer />
    </PartnerPortalLayout>
  );
};

Notification.renderLayout = renderMainLayout;

export default withInjectAllSaga(Notification);
