import React, { FC } from 'react';
import ProgramTermsContainer from 'components/PartnerPortal/Account/ProgramTerms';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const ProgramTerms: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Program Terms'}>
      <ProgramTermsContainer />
    </PartnerPortalLayout>
  );
};

ProgramTerms.renderLayout = renderMainLayout;

export default withInjectAllSaga(ProgramTerms);
