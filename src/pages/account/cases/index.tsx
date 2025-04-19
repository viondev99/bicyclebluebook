import React from 'react';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import AccountPersonalLayout from '../../../layout/Account/Personal';
import CasesComponent from '../../../components/StoreFront/ListCases';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

function Cases() {
  return (
    <AccountPersonalLayout titleMobile="Cases">
      <CasesComponent />
    </AccountPersonalLayout>
  );
}

Cases.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.PERSONAL })(Cases));
