import React from 'react';
import { withAuthenticate } from 'hocs/withAuthenticate';
import PartnerPortalLayout from 'layout/Account/Partner';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import FavoritesComponent from '../../../components/Account/Personal/Favorites';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

function Favorites() {
  return (
    <PartnerPortalLayout titleMobile="Favorites">
      <FavoritesComponent />
    </PartnerPortalLayout>
  );
}

Favorites.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate()(Favorites));
