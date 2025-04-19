/* eslint-disable no-shadow */
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import StoreState from 'model/store';
import {
  getNotifications,
  markAsReadNotification,
  removeCursorNotification,
} from 'store/notification/notification.action';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import contents from './MenuNotification.constants';
import classes from './menu-notification.module.scss';

import icCloseCircle from '../../../assets/img/common/ic_close_circle.svg';
import iconBell from '../../../assets/img/header/ic_bell.svg';

const MenuNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { asPath, query } = useRouter();
  const { data, unread, isStorefront } = useSelector((store: StoreState) => ({
    data: store.notification.data || [],
    unread: store.notification.unread,
    isStorefront: !!store.authenticate.user?.storefront,
  }));
  const [show, setShow] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>();

  const paramsCheckTypePartnerPortal = useMemo(() => {
    return asPath.includes(`/trade-in-account`) || query?.type === 'partner' ? '?type=partner' : '';
  }, [asPath, query]);

  useEffect(() => {
    const payload = {
      pageSize: 5,
      sort: 'date_created:-1',
      where: '',
    };
    dispatch(getNotifications(payload));
  }, [dispatch]);

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    window.addEventListener('mousedown', clickOutside);
    return () => {
      window.removeEventListener('mousedown', clickOutside);
    };
  });

  const toggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  useEffect(() => {
    const hide = () => {
      setShow(false);
    };
    Router.events.on('routeChangeComplete', hide);
    return () => {
      Router.events.off('routeChangeComplete', hide);
    };
  }, []);

  const markAsRead = useCallback(
    (id: string) => {
      dispatch(markAsReadNotification(id));
    },
    [dispatch],
  );

  const onRemove = useCallback(
    (id: string, e) => {
      e.preventDefault();
      dispatch(removeCursorNotification(id));
    },
    [dispatch],
  );

  const renderContent = useCallback(
    (item) => {
      return (
        <button type={'button'} className={cx(classes.notification, { [classes.unread]: !item.read })} key={item.id}>
          {checkExistLocalStorage() && localStorage.getItem('CHECK_ROLE_NOTIFICATION') === 'NOT_PARTNER' && (
            <div className={classes.iconContainer} onClick={() => markAsRead(item.id)}>
              <img src={get(contents, `${item.templateKey}.icon`, '') as string} alt="icon" />
            </div>
          )}
          <div className={classes.info} onClick={() => markAsRead(item.id)}>
            <div
              className={cx(classes.title, {
                [classes.unread]: !item.read,
              })}>
              {item.title}
            </div>
            <div className={classes.content}>{item.content}</div>
            <div className={classes.dateTime}>{dayjs(item.dateCreated).format('DD MMMM YYYY')}</div>
          </div>
          <div className={classes.btnRemove}>
            <button type="button" className={classes.removeButton} onClick={(e) => onRemove(item.id, e)}>
              <img src={icCloseCircle} width={18} height={18} alt="icCloseCircle" />
            </button>
          </div>
        </button>
      );
    },
    [markAsRead, onRemove],
  );

  const renderAs = useCallback((item) => {
    return contents[item.templateKey].as
      .replace('[masterListingId]', item.masterListingId)
      .replace('[orderId]', item.orderId)
      .replace('[offerId]', item.offerId);
  }, []);

  const renderQuery = useCallback((item) => {
    const query: { [key: string]: string } = {};
    query.inventory = item.inventory;
    query.marketListing = item.marketListingId;
    query.conversation = item.conversation;
    return omitBy(query, isUndefined);
  }, []);

  return (
    <>
      <div className={cx(classes.menuNotification)}>
        {!!unread && <div className={classes.badgeNotification} />}
        <ImageButton onClick={toggleShow} className={cx('d-none', 'd-md-block')}>
          <img src={iconBell} width={21} height={21} alt="bell" />
        </ImageButton>
        <Link href={`/notification/${paramsCheckTypePartnerPortal}`}>
          <ImageButton className={cx('d-block', 'd-md-none')}>
            <img src={iconBell} width={21} height={21} alt="bell" />
          </ImageButton>
        </Link>
        <div
          className={cx(classes.dropdownNotification, {
            [classes.hidden]: !show,
          })}
          ref={dropdownRef}>
          {!data.length ? (
            <div className={classes.noNotification}>You have no notification</div>
          ) : (
            data.map((item) => {
              if (contents[item.templateKey]?.href) {
                if (contents[item.templateKey]?.as) {
                  return (
                    <Link
                      key={item.id}
                      href={{
                        pathname: contents[item.templateKey].href
                          ?.replace('account', isStorefront ? 'store-front' : 'account')
                          ?.replace('/offers/', isStorefront ? '/offer-history/' : '/offers/')
                          ?.replace('/order/', isStorefront ? '/order-history/' : '/order/'),
                        query: renderQuery(item),
                      }}
                      as={{
                        pathname: renderAs(item)
                          ?.replace('account', isStorefront ? 'store-front' : 'account')
                          ?.replace('/offers/', isStorefront ? '/offer-history/' : '/offers/')
                          ?.replace('/order/', isStorefront ? '/order-history/' : '/order/'),
                        query: renderQuery(item),
                      }}>
                      {renderContent(item)}
                    </Link>
                  );
                }
                return (
                  <Link key={item.id} href={contents[item.templateKey].href}>
                    {renderContent(item)}
                  </Link>
                );
              }
              return <Fragment key={item.id}>{renderContent(item)}</Fragment>;
            })
          )}
          {!!data.length && (
            <Link href={`/notification${paramsCheckTypePartnerPortal}`}>
              <a className={classes.viewAll}>View All Notifications</a>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuNotification;
