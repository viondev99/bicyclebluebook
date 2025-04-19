/* eslint-disable no-nested-ternary */
import React, { FC, useCallback } from 'react';
import cx from 'classnames';
import { UrlObject } from 'url';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Dropdown from '@ui/Dropdown/Dropdown';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import StoreState from 'model/store';
import iconDropdown from 'assets/img/header/ic_dropdown.svg';
import classes from './header.module.scss';
import { TypeAccounts } from './Header';

export interface Menu {
  id?: string;
  name: string;
  scroll?: boolean;
  href: string | UrlObject;
  as?: string | UrlObject;
  shallow?: boolean;
  openModal?: boolean;
  nameMenu?: string;
}

interface Props {
  menu: Menu[];
  handleGenerateTokenOnlineStore?: (item: Menu) => void;
  handleRedirectByModal?: () => void;
}

const MenuUser: FC<Props> = ({ menu, handleGenerateTokenOnlineStore, handleRedirectByModal }) => {
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const generateTokenOnlineStore = (item: Menu) => {
    if (handleGenerateTokenOnlineStore) {
      handleGenerateTokenOnlineStore(item);
    }
  };

  const redirectByModal = () => {
    if (handleRedirectByModal) {
      handleRedirectByModal();
    }
  };

  const handleUpdateStorageListNotification = useCallback((name) => {
    if (name === TypeAccounts.Partner) {
      localStorage.setItem('CHECK_ROLE_NOTIFICATION', 'PARTNER');
    }
    if (name === TypeAccounts.StoreFront) {
      localStorage.setItem('CHECK_ROLE_NOTIFICATION', 'NOT_PARTNER');
    }
  }, []);

  return (
    <Dropdown
      className={'d-flex'}
      style={{ position: 'relative' }}
      renderToggle={({ toggle }) => (
        <div className={cx('d-none d-sm-inline-block', classes.link)} style={{ cursor: 'pointer' }} onClick={toggle}>
          {isLoggedIn ? 'Account' : 'Sign In'}{' '}
          <img className={classes.dropdownIcon} src={iconDropdown} alt={'dropdown'} width={14} height={7} />
        </div>
      )}
      renderMenu={({ hide }) => (
        <MenuDropdown
          className={classes.dropdownList}
          style={{ position: 'absolute', top: 28, right: -35 }}
          onClose={hide}>
          {menu.map((item, index) => {
            const { name, ...linkProps } = item;
            return (
              <>
                {linkProps?.openModal ? (
                  <a
                    href="/sign-in"
                    onClick={(e) => {
                      e.preventDefault();
                      redirectByModal();
                    }}>
                    <MenuDropdown.Item>{name}</MenuDropdown.Item>
                  </a>
                ) : linkProps?.href !== '' ? (
                  <Link {...linkProps} key={String(index)}>
                    <a
                      href="/cart"
                      className={cx({
                        'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                      })}>
                      <MenuDropdown.Item
                        style={{ color: item.href === '/logout' ? '#ee5c5e' : 'unset' }}
                        onClick={() => handleUpdateStorageListNotification(name)}>
                        {name}
                        {/* <span>{name}</span> */}
                      </MenuDropdown.Item>
                    </a>
                  </Link>
                ) : (
                  <a
                    href={`${linkProps?.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      generateTokenOnlineStore(item);
                    }}>
                    <MenuDropdown.Item>{name}</MenuDropdown.Item>
                  </a>
                )}
              </>
            );
          })}
        </MenuDropdown>
      )}
    />
  );
};

export default React.memo(MenuUser);
