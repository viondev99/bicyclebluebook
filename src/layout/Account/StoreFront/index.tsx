import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { MenuModel } from 'model/common';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { Option } from 'react-select/src/filters';
import Select from '@ui/Select/Select';
import { ListStorefronts, Storefont } from 'model/api/authenticate.model';
import { STOREFRONTS, STOREFRONTS_SELECTED } from 'constants/common';
import { checkExistLocalStorage, isProduction, parseJwt } from 'helpers/utilities.helper';
import { useDispatch, useSelector } from 'react-redux';
import { handleSelectedStore } from 'store/common/common.action';
import { getStorefrontDetail } from 'store/store-front/account/account.action';
import StoreState from 'model/store';
import tpDashboard from 'assets/img/account/partner/ic_tpdashboard.svg';
import icListings from 'assets/img/account/personal/ic_listings.svg';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icGrid from 'assets/img/account/personal/ic_grid.svg';
import iconCart from 'assets/img/header/ic_cart.svg';
import icOffer from 'assets/img/account/personal/ic_offer.svg';
import icManageReturns from 'assets/img/account/personal/ic_manage_returns.svg';
import icCancellations from 'assets/img/account/personal/ic_cancellations.svg';
import icHeart from 'assets/img/common/ic_heart.svg';
import icWaring from 'assets/img/common/ic_warning.svg';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import icPayment from 'assets/img/account/partner/ic_payment.svg';
import icGear from 'assets/img/account/storefront/ic_gear.svg';
import icStore from 'assets/img/account/storefront/ic_store.svg';
import iconProfile from 'assets/img/header/ic_profile.svg';
import icProfile from 'assets/img/account/partner/ic_profile.svg';

import classes from '../account-layout.module.scss';
import MenuAccount from '../Menu';

export const MenuStoreFront: MenuModel[] = [
  {
    id: 'dashboard',
    icon: tpDashboard,
    name: 'Dashboard',
    url: '/store-front/dashboards',
  },
  {
    id: 'mylistings',
    icon: icListings,
    name: 'Listings',
    url: '/store-front/mylistings',
    subMenu: [
      {
        id: 'Create',
        name: 'Create',
        url: '/store-front/mylistings/create',
        icon: icAdd,
      },
      {
        id: 'forSale',
        name: 'View All Listings',
        url: '/store-front/mylistings',
        icon: icGrid,
      },
    ],
  },
  {
    id: 'order-history',
    icon: iconCart,
    name: 'Orders',
    url: '/store-front/order-history',
  },
  {
    id: 'offer-history',
    icon: icOffer,
    name: 'Offers',
    url: '/store-front/offer-history',
  },
  {
    id: 'manage-returns',
    icon: icManageReturns,
    name: 'Manage Returns',
    url: '/store-front/manage-returns',
  },
  {
    id: 'cancellations',
    icon: icCancellations,
    name: 'Cancellations',
    url: '/store-front/cancellations',
  },
  {
    id: 'myfavorites',
    icon: icHeart,
    name: 'Favorites',
    url: '/store-front/myfavorites',
  },
  {
    id: 'list-cases',
    icon: icWaring,
    name: 'Cases',
    url: '/store-front/list-cases',
  },
  {
    id: 'messages',
    icon: icMessage,
    name: 'Messages',
    url: '/store-front/messages',
  },
  {
    id: 'payment',
    icon: icPayment,
    name: 'Payment',
    url: '/store-front/payment',
  },
  {
    id: 'blocked-user',
    name: 'Blocked User',
    url: '/store-front/blocked-user',
    icon: icWaring,
  },
  {
    id: 'account',
    icon: icGear,
    name: 'Account',
    url: '/store-front/account',
    subMenu: [
      {
        id: 'profile',
        name: 'Profile',
        url: '/store-front/account',
        icon: icStore,
      },
      {
        id: 'users',
        name: 'Users',
        url: '/store-front/users',
        icon: icProfile,
      },
    ],
  },
];

export const MenuStoreFrontBBBStaff: MenuModel[] = [
  {
    id: 'dashboard',
    icon: tpDashboard,
    name: 'Dashboard',
    url: '/store-front/dashboards',
  },
  {
    id: 'mylistings',
    icon: icListings,
    name: 'Listings',
    url: '/store-front/mylistings',
    subMenu: [
      {
        id: 'forSale',
        name: 'View All Listings',
        url: '/store-front/mylistings',
        icon: icGrid,
      },
    ],
  },
  {
    id: 'order-history',
    icon: iconCart,
    name: 'Orders',
    url: '/store-front/order-history',
  },
  {
    id: 'myfavorites',
    icon: icHeart,
    name: 'Favorites',
    url: '/store-front/myfavorites',
  },
  {
    id: 'list-cases',
    icon: icWaring,
    name: 'Cases',
    url: '/store-front/list-cases',
  },
  {
    id: 'offer-history',
    icon: icOffer,
    name: 'Offers',
    url: '/store-front/offer-history',
  },
  {
    id: 'manage-returns',
    icon: icManageReturns,
    name: 'Manage Returns',
    url: '/store-front/manage-returns',
  },
  {
    id: 'cancellations',
    icon: icCancellations,
    name: 'Cancellations',
    url: '/store-front/cancellations',
  },
  {
    id: 'messages',
    icon: icMessage,
    name: 'Messages',
    url: '/store-front/messages',
  },
  {
    id: 'blocked-user',
    name: 'Blocked User',
    url: '/store-front/blocked-user',
    icon: icWaring,
  },
  {
    id: 'account',
    icon: icGear,
    name: 'Account',
    url: '/store-front/account',
    subMenu: [
      {
        id: 'profile',
        name: 'Profile',
        url: '/store-front/account',
        icon: icStore,
      },
      {
        id: 'users',
        name: 'Users',
        url: '/store-front/users',
        icon: iconProfile,
      },
    ],
  },
];

interface Props {
  children: ReactElement;
  titleMobile?: string;
  onAccountPage?: boolean;
}

const StorefrontLayout: FC<Props> = ({ children, titleMobile = '', onAccountPage }) => {
  const isBBBStaff = useUserIsBBB();
  const [storeFront, setStoreFront] = useState<string>('');
  const dispatch = useDispatch();
  const { token, storefront_name } = useSelector((store: StoreState) => ({
    token: store.authenticate.token,
    storefront_name: store.authenticate.user?.storefront_name,
  }));
  const listStorefonts: ListStorefronts =
    typeof window !== 'undefined' && localStorage?.getItem(STOREFRONTS)
      ? JSON.parse(localStorage.getItem(STOREFRONTS))
      : [];

  useEffect(() => {
    checkExistLocalStorage() && localStorage.setItem('CHECK_ROLE_NOTIFICATION', 'NOT_PARTNER');
  }, []);

  useEffect(() => {
    if (checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED)) {
      setStoreFront(localStorage.getItem(STOREFRONTS_SELECTED));
    }
  }, []);

  const ListStorefont =
    !isProduction() && listStorefonts?.storefronts?.length > 0
      ? [
          { label: 'All', value: '' },
          { label: storefront_name, value: parseJwt(token)?.storefront },
          ...listStorefonts.storefronts
            ?.filter((e) => e?.status?.is_active)
            .map((item: Storefont) => ({
              label: item.name,
              value: item._id,
            })),
        ]
      : [];

  const handleSelecteStoreFront = useCallback(
    (value) => {
      setStoreFront(value);
      localStorage.setItem(STOREFRONTS_SELECTED, value);
      dispatch(handleSelectedStore(true));
      if (onAccountPage) {
        if (value === '') {
          dispatch(getStorefrontDetail(parseJwt(token)?.storefront));
        } else {
          dispatch(getStorefrontDetail(value));
        }
      }
    },
    [dispatch],
  );

  return (
    <div className={cx('container', classes.accountLayout)}>
      <div className={classes.titleStoreFront}>
        <h3 className={classes.titleLayout}>Account</h3>
        {!isProduction() && ListStorefont?.length > 0 && (
          <div className={classes.selectStore}>
            <Select
              inputId={'report-reason-select'}
              options={ListStorefont}
              value={storeFront}
              onChange={(v: Option) => handleSelecteStoreFront(v.value)}
              selectSize={'m'}
              isBackground
            />
          </div>
        )}
      </div>
      {titleMobile && <h3 className={classes.titleLayoutMobile}>{titleMobile}</h3>}
      <div className={classes.containerLayout}>
        <div className={classes.menuAccountLayout}>
          <MenuAccount listMenu={isBBBStaff ? MenuStoreFrontBBBStaff : MenuStoreFront} />
        </div>
        <div className={classes.contentAccountLayout}>{children}</div>
      </div>
    </div>
  );
};

export default StorefrontLayout;
