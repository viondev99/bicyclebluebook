import React from 'react';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import StorefrontLayout from '../../../layout/Account/StoreFront';
import FavoritesComponent from '../../../components/Account/Personal/Favorites';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

function Favorites() {
  return (
    <StorefrontLayout titleMobile="Favorites">
      <FavoritesComponent />
    </StorefrontLayout>
  );
}

Favorites.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate()(Favorites));
