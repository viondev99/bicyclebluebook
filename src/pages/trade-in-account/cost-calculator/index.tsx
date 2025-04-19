import React, { FC } from 'react';
import CostCalculatorContainer from 'components/PartnerPortal/CostCalculator';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const CostCalculator: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Cost Calculator'}>
      <CostCalculatorContainer />
    </PartnerPortalLayout>
  );
};

CostCalculator.renderLayout = renderMainLayout;

export default withInjectAllSaga(CostCalculator);
