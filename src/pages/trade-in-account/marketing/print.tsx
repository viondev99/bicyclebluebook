import React, { FC } from 'react';
import MarketingContainer from 'components/PartnerPortal/Marketing';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Print: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Marketing'}>
      <MarketingContainer />
    </PartnerPortalLayout>
  );
};

Print.renderLayout = renderMainLayout;

export default withInjectAllSaga(Print);
