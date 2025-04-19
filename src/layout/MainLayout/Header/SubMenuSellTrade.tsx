/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import React, { FC, memo, useCallback, useMemo, useState, Suspense } from 'react';
import cx from 'classnames';
import { UrlObject } from 'url';
import Dropdown from '@ui/Dropdown/Dropdown';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { parseJwt } from 'helpers/utilities.helper';
import CookieBrowser from 'js-cookie';
import { V3_TOKEN_KEY } from 'constants/common';
import { useCheckPersonalRole } from 'hooks/useCheckPersonalRole';
import classes from './header.module.scss';
import ModalNotiCreateOnlineStore from './ModalNotiCreateOnlineStore';

export interface Menu {
  id?: string;
  name: string;
  scroll?: boolean;
  href: string | UrlObject;
  as?: string | UrlObject;
  shallow?: boolean;
}

interface Props {
  gotoNotStoreFrontPage?: any;
}

const SubMenuSellTrade: FC<Props> = ({ gotoNotStoreFrontPage }) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const isLoggedIn = useSelector((store: StoreState) => !!store.authenticate.token);
  const isPartner = useSelector((store: StoreState) => !!store.authenticate.user?.partner);
  const isStorefront = useSelector((state: StoreState) => !!state.authenticate?.user?.storefront);
  const isPersonal = useCheckPersonalRole();
  const statusAcceptOrWaitingAccept = useMemo(() => {
    const info: { status_register_storefront: string } = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return info;
  }, [CookieBrowser.get(V3_TOKEN_KEY)]);

  const sellerIsBBB = useMemo(() => {
    const token = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return token?.is_bbb_seller;
  }, [CookieBrowser.get(V3_TOKEN_KEY)]);

  const gotoPage = useCallback(
    (url: string) => {
      router.replace(url);
    },
    [router],
  );

  const handleCreateListing = useCallback(() => {
    if (isPartner && !isStorefront) {
      return setOpenModal(true);
    }
    if (isPersonal) {
      return gotoPage('/account/mylistings/create');
    }
    gotoPage('/store-front/mylistings/create');
  }, [gotoPage, isPartner, isPersonal, isStorefront]);

  const renderCreateListing = useMemo(() => {
    if (sellerIsBBB) {
      return null;
    }
    if (
      isPartner &&
      (statusAcceptOrWaitingAccept?.status_register_storefront === 'waiting_accept' ||
        statusAcceptOrWaitingAccept?.status_register_storefront === 'reject')
    ) {
      return null;
    }
    return (
      <span
        className={cx(classes.subMenuBuy, classes.spaceSubMenuBuyIntroduce, 'mb-3')}
        onClick={() => {
          isLoggedIn ? handleCreateListing() : gotoPage('/login');
        }}>
        Create a Listing
      </span>
    );
  }, [gotoPage, handleCreateListing, isLoggedIn, isPartner, sellerIsBBB, statusAcceptOrWaitingAccept]);

  const renderTradeInYourBike = useMemo(() => {
    return (
      <span
        className={cx(classes.subMenuBuy, classes.spaceSubMenuBuyIntroduce)}
        onClick={(e) => {
          e.preventDefault();
          gotoPage('/trade-in/request');
        }}>
        Trade in Your Bike
      </span>
    );
  }, [gotoPage]);

  return (
    <>
      <Dropdown
        className={'d-flex'}
        style={{ position: 'relative' }}
        renderToggle={({ show, hide }) => (
          <a
            href={`/sell-tradein`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              gotoNotStoreFrontPage('/sell-tradein');
              window.scrollTo(0, 0);
            }}
            onMouseLeave={hide}
            onMouseEnter={show}>
            Sell/Trade
          </a>
        )}
        renderMenu={({ show, hide }) => (
          <MenuDropdown
            className={cx(classes.dropdownList, classes.dropdownListSellTrade)}
            style={{ position: 'absolute', top: 15, right: -185 }}
            onClose={hide}
            onMouseLeave={hide}
            onMouseEnter={show}>
            {
              <div className={classes.subMenuSellTradeContainer}>
                {renderCreateListing}
                {renderTradeInYourBike}
              </div>
            }
          </MenuDropdown>
        )}
      />
      {openModal && (
        <Suspense fallback={null}>
          <ModalNotiCreateOnlineStore isOpen={openModal} onClose={() => setOpenModal(false)} />
        </Suspense>
      )}
    </>
  );
};

export default memo(SubMenuSellTrade);
