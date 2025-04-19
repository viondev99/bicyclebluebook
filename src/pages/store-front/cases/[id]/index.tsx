import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import StorefrontLayout from 'layout/Account/StoreFront';
import DetailCasesComponent from 'components/StoreFront/DetailCases';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

function DetailCases() {
  return (
    <StorefrontLayout titleMobile="Cases">
      <DetailCasesComponent />
    </StorefrontLayout>
  );
}

DetailCases.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.ONLINE_STORE })(DetailCases));
