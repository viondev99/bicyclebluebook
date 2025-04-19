import React, { ComponentType, FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import WishListComponent from 'components/Account/Personal/Wishlist';
import AccountPersonalLayout from 'layout/Account/Personal';
import { ComponentStatic } from 'model/common';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Wishlist = () => {
  return (
    <AccountPersonalLayout titleMobile="Wishlist">
      <WishListComponent />
    </AccountPersonalLayout>
  );
};

Wishlist.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(Wishlist as FC<ComponentType & ComponentStatic>),
);
