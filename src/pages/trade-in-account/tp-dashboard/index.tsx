import React, { FC } from 'react';
import TPDashboardContainer from 'components/PartnerPortal/TPDashboard';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const TPDashboard: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'TPDashboard'}>
      <TPDashboardContainer />
    </PartnerPortalLayout>
  );
};

TPDashboard.renderLayout = renderMainLayout;

export default withInjectAllSaga(TPDashboard);
