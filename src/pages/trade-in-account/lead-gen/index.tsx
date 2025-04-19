import React, { FC } from 'react';
import LeadGenContainer from 'components/PartnerPortal/LeadGen';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const LeadGen: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Lead Gen'}>
      <LeadGenContainer />
    </PartnerPortalLayout>
  );
};

LeadGen.renderLayout = renderMainLayout;

export default withInjectAllSaga(LeadGen);
