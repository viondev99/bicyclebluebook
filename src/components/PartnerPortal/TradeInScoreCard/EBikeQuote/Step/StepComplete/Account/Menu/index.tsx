/* eslint-disable no-return-assign */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-nested-ternary */
import React, { FC, Suspense, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Card from '@ui/Cards/index';
import { MenuModel, SubMenuModel } from 'model/common';
import cx from 'classnames';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, printContent, printImage } from 'helpers/utilities.helper';
import PrintScoreCard from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/PrintScoreCard';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { updateInvStage } from 'api/trade-in.api';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import classes from '../account-layout.module.scss';

const ModalTradeInFeedback = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalTradeInFeedback'),
);

interface Props {
  listMenu: MenuModel[];
  getDefaultFeedback: () => void;
}

const MenuAccount: FC<Props> = ({ listMenu, getDefaultFeedback }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [visibleFeedback, setVisibleFeedback] = useState(false);
  const shipment = useSelector((state: StoreState) => state.partner.scorecard.shipment);

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

  const printScoreCard = useCallback(() => {
    const target = document.getElementById('PrintScoreCard');
    if (target) {
      printContent(target.innerHTML);
    }
  }, []);

  const printLabelScoreCard = useCallback(async () => {
    if (shipment && shipment?.fullLinkLabel) {
      printImage(shipment.fullLinkLabel);
      try {
        await updateInvStage({ scoreCardId: Number(router?.query?.id) });
      } catch (error) {
        console.log(error);
      }
    }
    return true;
  }, [router, shipment]);

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
              ) : menu.id === 'leave-feedback' ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setVisibleFeedback(true);
                  }}
                  href={`${menu.url}`}>
                  <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                  {menu.name}
                </a>
              ) : menu.id === 'print-scorecard' ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    printScoreCard();
                  }}
                  href={`${menu.url}`}>
                  <img src={menu.icon} alt={`icon menu ${menu.id}`} className={classes.iconMenu} />
                  {menu.name}
                </a>
              ) : menu.id === 'print-label' ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    printLabelScoreCard();
                  }}
                  href={`${menu.url}`}>
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

      {visibleFeedback && (
        <Suspense fallback={null}>
          <ModalTradeInFeedback
            isOpen={visibleFeedback}
            onClose={() => setVisibleFeedback(false)}
            getDefaultFeedback={getDefaultFeedback}
          />
        </Suspense>
      )}

      <PrintScoreCard />
    </Card>
  );
};

export default MenuAccount;
