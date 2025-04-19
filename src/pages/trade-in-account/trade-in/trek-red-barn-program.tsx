import React, { FC } from 'react';
import PartnerPortalLayout from 'layout/Account/Partner';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import FilterTrekRedBarnProgram from 'components/PartnerPortal/TradeInScoreCard/TrekRedBarnProgram/Filter/Filter';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const TrekRedBarnProgram: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Trek Red Barn Program'}>
      <FilterTrekRedBarnProgram />
    </PartnerPortalLayout>
  );
};

TrekRedBarnProgram.renderLayout = renderMainLayout;

export default withInjectAllSaga(TrekRedBarnProgram);
