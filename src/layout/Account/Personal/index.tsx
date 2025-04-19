import React, { FC, ReactElement, useEffect } from 'react';
import cx from 'classnames';
import { MenuModel } from 'model/common';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import icProfile from 'assets/img/account/partner/ic_profile.svg';
import icListings from 'assets/img/account/personal/ic_listings.svg';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icTagListing from 'assets/img/listing/ic_tag.svg';
import icDollarListing from 'assets/img/listing/ic_dollar.svg';
import icReturnListing from 'assets/img/listing/ic_return.svg';
import icCloseListing from 'assets/img/listing/ic_close.svg';
import icWarningListing from 'assets/img/listing/ic_warning.svg';
import icEditListing from 'assets/img/listing/ic_edit.svg';
import iconCart from 'assets/img/header/ic_cart.svg';
import icOffer from 'assets/img/account/personal/ic_offer.svg';
import icRightArrowBlack from 'assets/img/common/ic_right_arrow_black.svg';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import icWaring from 'assets/img/common/ic_warning.svg';
import icHeart from 'assets/img/common/ic_heart.svg';
import icWishListBlack from 'assets/img/account/personal/ic_wishlist.svg';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import icNotification from 'assets/img/common/ic_notification.svg';
import icPayment from 'assets/img/account/partner/ic_payment.svg';
import icTradeInPartner from 'assets/img/account/partner/ic_trade_in.svg';

import MenuAccount from '../Menu';
import classes from '../account-layout.module.scss';
export const MenuPersonal: MenuModel[] = [
  {
    id: 'profile',
    icon: icProfile,
    name: 'Profile',
    url: '/account/profile',
  },
  {
    id: 'mylistings',
    icon: icListings,
    name: 'Listings',
    url: '/account/mylistings/listings',
    subMenu: [
      {
        id: 'Create',
        name: 'Create',
        url: '/account/mylistings/create',
        icon: icAdd,
      },
      {
        id: 'forSale',
        name: 'For Sale',
        url: '/account/mylistings/listings',
        icon: icTagListing,
      },
      {
        id: 'sold',
        name: 'Sold',
        url: '/account/mylistings/sold',
        icon: icDollarListing,
      },
      {
        id: 'manager-return',
        name: 'Returns',
        url: '/account/mylistings/manage-return',
        icon: icReturnListing,
      },
      {
        id: 'cancelled',
        name: 'Cancelled',
        url: '/account/mylistings/cancel',
        icon: icCloseListing,
      },
      {
        id: 'expired',
        name: 'Expired',
        url: '/account/mylistings/expired',
        icon: icWarningListing,
      },
      {
        id: 'draft',
        name: 'Draft',
        url: '/account/mylistings/draft',
        icon: icEditListing,
      },
      {
        id: 'sale-pending',
        name: 'Sale Pending',
        url: '/account/mylistings/sale-pending',
        icon: icTagListing,
      },
    ],
  },
  {
    id: 'orders',
    icon: iconCart,
    name: 'Orders',
    url: '/account/orders',
  },
  {
    id: 'offers',
    icon: icOffer,
    name: 'Offers',
    url: '/account/offers/made',
    subMenu: [
      {
        id: 'offersMade',
        name: 'Offers Made',
        url: '/account/offers/made',
        icon: icRightArrowBlack,
      },
      {
        id: 'offerReceived',
        name: 'Offers Received',
        url: '/account/offers/received',
        icon: icLeftArrowBlack,
      },
    ],
  },
  {
    id: 'cases',
    icon: icWaring,
    name: 'Cases',
    url: '/account/cases',
  },
  {
    id: 'myfavorites',
    icon: icHeart,
    name: 'Favorites',
    url: '/account/myfavorites',
  },
  {
    id: 'wishlist',
    icon: icWishListBlack,
    name: 'Wishlist',
    url: '/account/wishlist',
  },
  {
    id: 'messages',
    icon: icMessage,
    name: 'Messages',
    url: '/account/messages',
  },
  {
    id: 'notification',
    icon: icNotification,
    name: 'Notifications',
    url: '/account/notification',
  },
  {
    id: 'payment',
    icon: icPayment,
    name: 'Payment',
    url: '/account/payment',
  },
  {
    id: 'blocked-user',
    name: 'Blocked User',
    url: '/account/blocked-user',
    icon: icWaring,
  },
  {
    id: 'trade-credit',
    icon: icTradeInPartner,
    name: 'Trade-in Credit',
    url: '/account/trade-credit',
  },
];

interface Props {
  children: ReactElement;
  titleMobile?: string;
}

const AccountPersonalLayout: FC<Props> = ({ children, titleMobile = '' }) => {
  useEffect(() => {
    checkExistLocalStorage() && localStorage.setItem('CHECK_ROLE_NOTIFICATION', 'NOT_PARTNER');
  }, []);

  return (
    <div className={cx('container', classes.accountLayout)}>
      <h3 className={classes.titleLayout}>My Account</h3>
      {titleMobile && <h3 className={classes.titleLayoutMobile}>{titleMobile}</h3>}
      <div className={classes.containerLayout}>
        <div className={classes.menuAccountLayout}>
          <MenuAccount listMenu={MenuPersonal} />
        </div>
        <div className={classes.contentAccountLayout}>{children}</div>
      </div>
    </div>
  );
};

export default AccountPersonalLayout;
