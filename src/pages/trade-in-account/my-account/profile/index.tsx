import React, { FC, useCallback, useEffect, useMemo } from 'react';
import Card from '@ui/Cards';
import Divider from '@ui/Divider';
import ShopDetailsSection from 'components/PartnerPortal/Account/Profile/ShopDetailsSection/ShopDetailsSection';
import ShopAddressSection from 'components/PartnerPortal/Account/Profile/ShopAddressSection/ShopAddressSection';
import SettingsSection from 'components/PartnerPortal/Account/Profile/SettingsSection/SettingsSection';
import UserProfilesSection from 'components/PartnerPortal/Account/Profile/UserProfileSection/UserProfileSection';
import OnlineStoreSection from 'components/PartnerPortal/Account/Profile/OnlineStoreSection/OnlineStoreSection';
import CookieBrowser from 'js-cookie';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { ComponentStatic } from 'model/common';
import { parseJwt } from 'helpers/utilities.helper';
import { StatusRegisterStorefront } from 'constants/account';
import { V3_TOKEN_KEY } from 'constants/common';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getDetailUserOnlineStore } from 'store/store-front/account/account.action';
import { getPartnerDetail } from 'store/partner/account/account.action';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const Profile: FC & ComponentStatic = () => {
  const { accountId } = useSelector((store: StoreState) => ({
    accountId: store.authenticate?.user?.account,
  }));
  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const isStatusAcceptOrWaitingAccept = useMemo(() => {
    const info: { status_register_storefront: string } = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return (
      info?.status_register_storefront === StatusRegisterStorefront.ACCEPT ||
      info?.status_register_storefront === StatusRegisterStorefront.WAITING_ACCEPT ||
      info?.status_register_storefront === StatusRegisterStorefront.REJECT
    );
  }, []);
  const getPartnerDetailDefault = useCallback(() => {
    if (accountId) {
      dispatch(getPartnerDetail(accountId));
    }
  }, [dispatch, accountId]);
  const getDefaultData = useCallback(() => {
    dispatch(getDetailUserOnlineStore(userInfo?.account));
  }, [dispatch, userInfo]);
  useEffect(() => {
    getPartnerDetailDefault();
  }, [dispatch, getPartnerDetailDefault]);

  useEffect(() => {
    getDefaultData();
  }, [getDefaultData]);

  return (
    <PartnerPortalLayout titleMobile={'Profile'}>
      <Card>
        <ShopDetailsSection isStatusAcceptOrWaitingAccept={!isStatusAcceptOrWaitingAccept} />
        <ShopAddressSection />
        <SettingsSection />
        <Divider style={{ margin: '30px -10px 0px' }} />
        <UserProfilesSection />
        {isStatusAcceptOrWaitingAccept ? <OnlineStoreSection /> : null}
      </Card>
    </PartnerPortalLayout>
  );
};

Profile.renderLayout = renderMainLayout;

export default withInjectAllSaga(Profile);
