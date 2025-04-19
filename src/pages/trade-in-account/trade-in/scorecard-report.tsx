import React, { FC } from 'react';
import PartnerPortalLayout from 'layout/Account/Partner';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import FilterScorecardReport from 'components/PartnerPortal/TradeInScoreCard/ReconciliationReport/Filter/FilterScorecardReport';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const ReportScorecard: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Reconciliation Report'}>
      <FilterScorecardReport />
    </PartnerPortalLayout>
  );
};

ReportScorecard.renderLayout = renderMainLayout;

export default withInjectAllSaga(ReportScorecard);
