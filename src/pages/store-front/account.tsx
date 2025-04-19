import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@ui/Cards';
import Divider from '@ui/Divider';
import InformationSection from 'components/StoreFront/Account/Profile/InformationSection/InformationSection';
import AddressSection from 'components/StoreFront/Account/Profile/AddressSection/AddressSection';
import ShopBrandingSection from 'components/StoreFront/Account/Profile/ShopBrandingSection/ShopBrandingSection';
import UserProfileSection from 'components/StoreFront/Account/Profile/UserProfileSection/UserProfileSection';
import { getStorefrontDetail, getStorefrontUserProfile } from 'store/store-front/account/account.action';
import StoreState from 'model/store';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import StorefrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const StoreFrontAccount: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  const { storefrontId, accountId } = useSelector((store: StoreState) => ({
    storefrontId: store.authenticate?.user?.storefront,
    accountId: store.authenticate?.user?.account,
  }));

  const loggedStorefrontId =
    process.browser && checkExistLocalStorage() && localStorage?.getItem('loggedStorefront')
      ? localStorage.getItem('loggedStorefront')
      : storefrontId;

  useEffect(() => {
    if (loggedStorefrontId) {
      dispatch(getStorefrontDetail(loggedStorefrontId));
    }
  }, [loggedStorefrontId, dispatch]);

  useEffect(() => {
    if (accountId) {
      dispatch(getStorefrontUserProfile(accountId));
    }
  }, [accountId, dispatch]);

  return (
    <StorefrontLayout titleMobile="Account" onAccountPage={true}>
      <Card>
        <InformationSection />
        <AddressSection />
        <ShopBrandingSection />
        <Divider style={{ margin: '0 -10px' }} />
        <UserProfileSection />
      </Card>
    </StorefrontLayout>
  );
};

StoreFrontAccount.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(StoreFrontAccount as FC<ComponentType & ComponentStatic>),
);
