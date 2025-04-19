import React from 'react';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import AccountPersonalLayout from '../../../layout/Account/Personal';
import FavoritesComponent from '../../../components/Account/Personal/Favorites';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

function Favorites() {
  return (
    <AccountPersonalLayout titleMobile="Favorites">
      <FavoritesComponent />
    </AccountPersonalLayout>
  );
}

Favorites.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.PERSONAL })(Favorites));
