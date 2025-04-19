import React, { FC } from 'react';
import SalesCalculatorContainer from 'components/PartnerPortal/SalesCalculator';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const SalesCalculator: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Sales Calculator'}>
      <SalesCalculatorContainer />
    </PartnerPortalLayout>
  );
};

SalesCalculator.renderLayout = renderMainLayout;

export default withInjectAllSaga(SalesCalculator);
