import React, { FC } from 'react';
import UserContainer from 'components/PartnerPortal/Account/User';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const User: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'User'}>
      <UserContainer />
    </PartnerPortalLayout>
  );
};

User.renderLayout = renderMainLayout;

export default withInjectAllSaga(User);
