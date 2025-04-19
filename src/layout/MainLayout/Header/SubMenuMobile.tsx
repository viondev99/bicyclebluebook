import React, { FC, useState, useEffect, useCallback, Suspense, memo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse } from 'reactstrap';
import Button from '@ui/Buttons/Primary/Button';
import StoreState from 'model/store';
import { MenuModel, SubMenuModel } from 'model/common';
import { getTotalUnreadMessages } from 'store/message/message.action';
import { getOfferSummary } from 'api/store-front/offers-history.api';
import cx from 'classnames';
import { useRouter } from 'next/router';
import useScreenDetect from 'hooks/useScreenDetect';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import classes from './header.module.scss';

const ModalContactRep = React.lazy(() => import('@ui/Modal/ModalContactRep'));

interface Props {
  menu: MenuModel[];
  open?: boolean;
}

const SubMenuMobile: FC<Props> = ({ menu, open }) => {
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const [offer, setOffer] = useState<number>(0);
  const { unread, token, isStorefront, countNewReturn, countNewCancel, totalNewComplainOrder } = useSelector(
    (store: StoreState) => ({
      unread: store.message.unread,
      token: store.authenticate.token,
      isStorefront: !!store.authenticate.user?.storefront,
      countNewReturn: store?.storeFront.listingOnlineStore.countNewReturn,
      countNewCancel: store?.storeFront.listingOnlineStore.countNewCancel,
      totalNewComplainOrder: store.message.totalNewComplainOrder,
      isSelectedStore: store.common.isSelectedStore,
    }),
  );
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { currentWidthScreen } = useScreenDetect();

  const [subMenuVisible, setSubMenuVisible] = useState<string>(null);
  const [visibleModalContactRep, setVisibleModalContactRep] = useState(false);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  useEffect(() => {
    // get default mobile menu by router
    const listPartPathNames = pathname.split('/');
    setSubMenuVisible(listPartPathNames.length >= 3 ? listPartPathNames[2] : '');
  }, [pathname]);

  useEffect(() => {
    if (token) {
      if (menu.map((it) => it.id).includes('messages') && open) {
        dispatch(getTotalUnreadMessages({ storefrontIds }));
      }
    }
  }, [token, dispatch, menu, open, storefrontIds]);

  useEffect(() => {
    if (token) {
      if (isStorefront && storefrontIds) {
        const params = {
          storefrontIds: [storefrontIds],
        };
        getOfferSummary(params)
          .then((response) => {
            setOffer(response.openOffers);
          })
          .catch((e) => {
            //
          });
      }
    }
  }, [isStorefront, storefrontIds, token]);

  const openSubMenu = useCallback(
    (id: string) => {
      if (subMenuVisible === id) {
        setSubMenuVisible(null);
      } else {
        setSubMenuVisible(id);
      }
    },
    [subMenuVisible],
  );

  useEffect(() => {
    if (stepTour === 8 && currentWidthScreen < 768) {
      setVisibleModalContactRep(true);
    } else {
      setVisibleModalContactRep(false);
    }
  }, [currentWidthScreen, stepTour]);

  const isActiveOrChildActive = (menuItem: MenuModel) => {
    if (router.pathname?.includes(menuItem.url)) {
      return true;
    }
    return menuItem.subMenu ? menuItem.subMenu.find((i) => router.pathname?.includes(i.url)) : false;
  };

  return (
    <>
      <ul className={cx(classes.menuTop, classes.subMenuTopPadding)}>
        {menu.map((menuItem: MenuModel) =>
          menuItem.subMenu ? (
            <li className={cx(classes.customLineMenu, classes.pd0)} key={menuItem.id}>
              <Button buttonType="clear" className={classes.btnSubMenu} onClick={() => openSubMenu(menuItem.id)}>
                <img src={menuItem.icon} alt={`icon menu ${menuItem.id}`} className={classes.iconMenu} />
                {menuItem.name}
              </Button>
              <Collapse isOpen={subMenuVisible === menuItem.id}>
                <ul className={classes.wrapSubMenu}>
                  {menuItem.subMenu.map((subMenuItem: SubMenuModel) => (
                    <li
                      className={cx(classes.customLineMenu, isActiveOrChildActive(subMenuItem) && classes.activeMenu)}
                      key={subMenuItem.id}>
                      <Link href={subMenuItem.url}>
                        <a>
                          <img
                            src={subMenuItem.icon}
                            alt={`icon menu ${subMenuItem.id}`}
                            className={classes.iconMenu}
                          />
                          {subMenuItem.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ) : (
            <li
              className={cx(classes.customLineMenu, isActiveOrChildActive(menuItem) && classes.activeMenu)}
              key={menuItem.id}>
              {menuItem.id === 'messages' && !!unread && <div className={classes.badgeMessage}>{unread}</div>}
              {menuItem.id === 'offer-history' && isStorefront && !!offer && (
                <div className={classes.badgeMessage} style={{ top: '46%' }}>
                  {offer}
                </div>
              )}
              {menuItem.id === 'list-cases' && totalNewComplainOrder !== 0 && (
                <div className={classes.badgeMessage}>{totalNewComplainOrder}</div>
              )}
              {menuItem.id === 'manage-returns' && !(countNewReturn === 0) && (
                <div className={cx(classes.badgeMessage, 'ml-3')}>{countNewReturn}</div>
              )}
              {menuItem.id === 'cancellations' && !(countNewCancel === 0) && (
                <div className={classes.badgeMessage}>{countNewCancel}</div>
              )}
              {menuItem.id === 'contact-rep' ? (
                <a
                  href={`${menuItem.url}`}
                  className={classes.spanText}
                  onClick={(e) => {
                    e.preventDefault();
                    setVisibleModalContactRep(true);
                  }}>
                  <img src={menuItem.icon} alt={`icon menu ${menuItem.id}`} className={classes.iconMenu} />
                  {menuItem.name}
                </a>
              ) : (
                <Link href={menuItem.url}>
                  <a>
                    <img src={menuItem.icon} alt={`icon menu ${menuItem.id}`} className={classes.iconMenu} />
                    {menuItem.name}
                  </a>
                </Link>
              )}
            </li>
          ),
        )}
      </ul>

      {visibleModalContactRep && (
        <Suspense fallback={null}>
          <ModalContactRep
            isOpen={visibleModalContactRep}
            isTour={stepTour === 8 && currentWidthScreen < 768}
            onClose={
              stepTour === 8 && currentWidthScreen < 768
                ? () => {
                    dispatch(handleChangeStepTour({ steps: 0 }));
                    setVisibleModalContactRep(false);
                  }
                : () => setVisibleModalContactRep(false)
            }
          />
        </Suspense>
      )}
    </>
  );
};

export default memo(SubMenuMobile);
