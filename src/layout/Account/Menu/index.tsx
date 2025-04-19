/* eslint-disable no-nested-ternary */
import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards/index';
import { MenuModel, SubMenuModel } from 'model/common';
import cx from 'classnames';
import StoreState from 'model/store';
import { getTotalNewComplainOrder, getTotalUnreadMessages } from 'store/message/message.action';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import { getStorefrontSummary } from 'store/store-front/dashboard/dashboard.action';
import { getNotifications } from 'store/notification/notification.action';
import { BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import { checkExistLocalStorage, DATA_RESET_CREATE_SCORECARD_QUANTITY } from 'helpers/utilities.helper';
import { getCountNewCancel, getCountNewReturn } from 'store/store-front/listings/listings.action';
import { STOREFRONTS_SELECTED } from 'constants/common';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import classes from '../account-layout.module.scss';

const ModalContactRep = React.lazy(() => import('@ui/Modal/ModalContactRep'));

interface Props {
  listMenu: MenuModel[];
}

const MenuAccount: FC<Props> = ({ listMenu }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    openOffers,
    unread,
    token,
    isStorefront,
    totalNewComplainOrder,
    bikeDonation,
    partnerId,
    countNewReturn,
    countNewCancel,
    isSelectedStore,
  } = useSelector((store: StoreState) => ({
    unread: store.message.unread,
    totalNewComplainOrder: store.message.totalNewComplainOrder,
    token: store.authenticate.token,
    isStorefront: !!store.authenticate.user?.storefront && router?.pathname?.includes('store-front'),
    bikeDonation: store.partner.account?.detailPartnerLocation?.is_donation,
    partnerId: store?.authenticate?.user?.partner,
    openOffers: store?.storeFront?.dashboard?.summary?.openOffers,
    countNewReturn: store?.storeFront.listingOnlineStore.countNewReturn,
    countNewCancel: store?.storeFront.listingOnlineStore.countNewCancel,
    isSelectedStore: store?.common?.isSelectedStore,
  }));
  const [visibleModalContactRep, setVisibleModalContactRep] = useState(false);
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const storeFront = checkExistLocalStorage() && localStorage.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  useEffect(() => {
    if (token) {
      const payload = {
        pageSize: 5,
        sort: 'date_created:-1',
        where: '',
      };
      if (listMenu.map((it) => it.id).includes('messages')) {
        dispatch(getTotalUnreadMessages({ storefrontIds }));
      }
      dispatch(getNotifications(payload));
      if (isStorefront) {
        dispatch(getTotalNewComplainOrder({ storefrontIds }));
        dispatch(getStorefrontSummary({ storefrontIds }));
        dispatch(getCountNewReturn({ storefrontIds }));
        dispatch(getCountNewCancel({ storefrontIds }));
      }
      if (partnerId) {
        dispatch(getPartnerLocationDetail(partnerId));
      }
    }
  }, [listMenu, token, isStorefront, dispatch, partnerId, storeFront, storefrontIds, isSelectedStore, stepTour]);

  const isActiveOrChildActive = (menu: MenuModel) => {
    // if (router.pathname?.includes('/tp-dashboard') && stepTour === 3) {
    //   return false;
    // }
    if (stepTour === 4 || stepTour === 8) {
      return false;
    }
    if (router.pathname?.includes(menu.url)) {
      return true;
    }
    return menu.subMenu ? menu.subMenu.find((i) => router.pathname?.includes(i.url)) : false;
  };

  const isTourMenuActive = (menu: MenuModel) => {
    if (stepTour === 4) {
      return menu?.id === 'trade-in';
    }
    if (stepTour === 8) {
      return menu?.id === 'contact-rep';
    }
    switch (stepTour) {
      case 1:
        return menu?.id === 'tp-dashboard';

      case 3:
        if (router.pathname?.includes('my-account')) {
          return menu?.id === 'my-account';
        }
        return false;

      case 5:
        if (router.pathname?.includes('marketing')) {
          return menu?.id === 'marketing';
        }
        return false;

      case 6:
        if (router.pathname?.includes('training')) {
          return menu?.id === 'training';
        }
        return false;

      case 7:
        if (router.pathname?.includes('feedback')) {
          return menu?.id === 'feedback';
        }
        return false;

      case 9:
        if (router.pathname?.includes('cost-calculator')) {
          return menu?.id === 'cost-calculator';
        }
        return false;

      case 10:
        if (router.pathname?.includes('lead-gen')) {
          return menu?.id === 'lead-gen';
        }
        return false;

      case 11:
        if (router.pathname?.includes('sales-calculator')) {
          return menu?.id === 'sales-calculator';
        }
        return false;

      default:
        break;
    }
    return false;
  };

  const handleCreateScorecard = useCallback(
    (url?: string) => {
      if (url === '/trade-in-account/trade-in/new') {
        dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
      }
      if (url === '/trade-in-account/trade-in/trek-red-barn-program' && router.pathname.includes(url)) {
        setTimeout(() => {
          router.replace({ pathname: router.pathname, query: { ...router.query } });
        }, 0);
      }
    },
    [dispatch, router],
  );
  return (
    <Card className={classes.menuCard}>
      <ul>
        {listMenu.map((menu: MenuModel) => {
          return (
            <li
              key={menu.id}
              className={cx({
                [classes.activeMenu]: isActiveOrChildActive(menu),
                [classes.activeMenuTour]: isTourMenuActive(menu),
                [classes.messagesOption]: menu.id === 'messages' || menu.id === 'offer-history',
                'd-none': menu.id === 'bike-donation' && !bikeDonation,
              })}>
              {menu.id === 'messages' && !!unread && <div className={classes.badgeMessage}>{unread}</div>}
              {menu.id === 'list-cases' && totalNewComplainOrder !== 0 && (
                <div className={classes.badgeMessage}>{totalNewComplainOrder}</div>
              )}
              {menu.id === 'offer-history' && isStorefront && !!openOffers && (
                <div className={classes.badgeMessage}>{openOffers}</div>
              )}
              {menu.id === 'manage-returns' && !(countNewReturn === 0) && (
                <div className={cx(classes.badgeMessage, 'ml-3')}>{countNewReturn}</div>
              )}
              {menu.id === 'cancellations' && !(countNewCancel === 0) && (
                <div className={classes.badgeMessage}>{countNewCancel}</div>
              )}
              {menu.id === 'contact-rep' ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setVisibleModalContactRep(true);
                  }}
                  href={`${menu.url}`}>
                  <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                  {menu.name}
                </a>
              ) : menu.url ? (
                <Link href={menu.url}>
                  <a>
                    <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                    {menu.name}
                  </a>
                </Link>
              ) : (
                <a>
                  <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                  {menu.name}
                </a>
              )}
              {menu.subMenu && (
                <div className={classes.subMenu}>
                  <Card className={classes.contentSubMenu}>
                    <ul>
                      {menu.subMenu.map((subMenu: SubMenuModel) => (
                        <li
                          key={subMenu.id}
                          className={cx({
                            [classes.activeMenu]:
                              subMenu.url === router.pathname ||
                              (subMenu.url === '/trade-in-account/trade-in/new' && stepTour === 4),
                          })}>
                          <Link href={subMenu.url}>
                            <a onClick={() => handleCreateScorecard(subMenu?.url)}>
                              <img
                                src={subMenu.icon}
                                alt={`icon sub menu ${subMenu.id}`}
                                className={classes.iconMenu}
                              />
                              {subMenu.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {visibleModalContactRep && (
        <Suspense fallback={null}>
          <ModalContactRep isOpen={visibleModalContactRep} onClose={() => setVisibleModalContactRep(false)} />
        </Suspense>
      )}
    </Card>
  );
};

export default MenuAccount;
