import React, { FC, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards/index';
import { MenuModel, SubMenuModel } from 'model/common';
import cx from 'classnames';
import StoreState from 'model/store';
import { getTotalNewComplainOrder, getTotalUnreadMessages } from 'store/message/message.action';
import { getSummaryOffersHistory } from 'store/store-front/offers-history/offers-history.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY } from 'helpers/utilities.helper';
import classes from '../account-layout.module.scss';

interface Props {
  listMenu: MenuModel[];
}

const MenuAccount: FC<Props> = ({ listMenu }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, isStorefront } = useSelector((store: StoreState) => ({
    unread: store.message.unread,
    totalNewComplainOrder: store.message.totalNewComplainOrder,
    token: store.authenticate.token,
    summaryOffers: store.storeFront.offersHistory.summaryOffers,
    isStorefront: !!store.authenticate.user?.storefront,
  }));

  useEffect(() => {
    if (token) {
      if (listMenu.map((it) => it.id).includes('messages')) {
        dispatch(getTotalUnreadMessages());
      }
      if (isStorefront) {
        dispatch(getSummaryOffersHistory());
        dispatch(getTotalNewComplainOrder());
      }
    }
  }, [token, isStorefront, dispatch, listMenu]);

  const gotoNewScorecard = useCallback(() => {
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    router.push(`/trade-in-account/trade-in/new`);
  }, [dispatch, router]);

  const isActiveOrChildActive = (menu: MenuModel) => {
    if (router.pathname?.includes(menu.url)) {
      return true;
    }
    return menu.subMenu ? menu.subMenu.find((i) => router.pathname?.includes(i.url)) : false;
  };

  return (
    <Card className={classes.menuCard}>
      <ul>
        {listMenu.map((menu: MenuModel) => {
          return (
            <li
              key={menu.id}
              className={cx({
                [classes.activeMenu]: isActiveOrChildActive(menu),
                [classes.messagesOption]: menu.id === 'messages' || menu.id === 'offers',
              })}>
              {menu.id === 'new-scorecard' ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    gotoNewScorecard();
                  }}
                  href={`/trade-in-account/trade-in/new`}>
                  <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                  {menu.name}
                </a>
              ) : (
                <Link href={menu.url}>
                  <a>
                    <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                    {menu.name}
                  </a>
                </Link>
              )}
              {menu.subMenu && (
                <div className={classes.subMenu}>
                  <Card className={classes.contentSubMenu}>
                    <ul>
                      {menu.subMenu.map((subMenu: SubMenuModel) => (
                        <li
                          key={subMenu.id}
                          className={cx({
                            [classes.activeMenu]: subMenu.url === router.pathname,
                          })}>
                          <Link href={subMenu.url}>
                            <a>
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
    </Card>
  );
};

export default MenuAccount;
