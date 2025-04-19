import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import get from 'lodash/get';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import Link from 'next/link';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import images from 'assets/images';

import Modal from '@ui/Modal/Modal';
import StoreState from 'model/store';
import {
  getListNotifications,
  GetNotificationsPayload,
  markAsReadNotification,
  removeCursorNotification,
} from 'store/notification/notification.action';
import Pagination from '@ui/Pagination/Pagination';
import { useRouter } from 'next/router';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import Filter from './Filter/Filter';
import contents from '../MenuNotification/MenuNotification.constants';
import classes from './list-notification.module.scss';
import ContentSkeleton from './ContentSkeleton';

const CloseIcon = images.common.icCloseCircleComponent;

const ListNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { asPath, query } = useRouter();
  const { data, totalPage, loading, isStorefront } = useSelector((store: StoreState) => ({
    data: store.notification.list || [],
    totalPage: store.notification.totalPage,
    loading: store.notification.loading,
    isStorefront: !!store.authenticate.user?.storefront,
  }));
  const [page, setPage] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ [key: string]: boolean }>(() => {
    const keys: { [key: string]: boolean } = {};
    Object.keys(contents).forEach((key) => {
      keys[contents[key].group] = true;
    });
    return keys;
  });

  const isPartner = useMemo(() => {
    if (asPath.includes(`/trade-in-account`) || query?.type === 'partner') {
      return true;
    }
    return false;
  }, [asPath, query]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 767) {
        setShow(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const keys: Array<string> = [];
    Object.keys(filters).forEach((key) => {
      Object.keys(contents).forEach((item) => {
        if (!!filters[key] && contents[item].group === key) {
          keys.push(item);
        }
      });
    });
    let payload: GetNotificationsPayload = {
      page,
      pageSize: 10,
      sort: 'date_created:-1',
      where: '',
      templateKeys: keys.length ? keys : ['null'],
    };
    if (`${query?.type}` === 'partner') {
      payload = {
        ...payload,
        isPartner: true,
      };
    }
    dispatch(getListNotifications(payload));
  }, [page, filters, dispatch, query]);

  const toggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);

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
        <a className={classes.notification} onClick={() => markAsRead(item.id)}>
          {checkExistLocalStorage() && localStorage.getItem('CHECK_ROLE_NOTIFICATION') === 'NOT_PARTNER' && (
            <div className={classes.iconContainer}>
              <img src={get(contents, `${item.templateKey}.icon`, '') as string} alt="icon" />
            </div>
          )}
          <div className={classes.info}>
            <div className={classes.title}>
              {item.title} {!item.read && <div className={classes.badgeUnread} />}
            </div>
            <div className={classes.content}>{item.content}</div>
            <div className={classes.dateTime}>{dayjs(item.dateCreated).format('DD MMMM YYYY')}</div>
          </div>
          <div className={classes.btnRemove}>
            <button type="button" className={classes.removeButton} onClick={(e) => onRemove(item.id, e)}>
              <CloseIcon className={classes.closeIcon} />
            </button>
          </div>
        </a>
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

  const handleChangePage = useCallback(
    (value) => {
      if (!loading) {
        setPage(value);
      }
    },
    [loading],
  );

  const handleFilter = useCallback(
    (key: string, value: boolean) => {
      const temp: { [key: string]: boolean } = { ...filters };
      temp[key] = value;
      setFilters(temp);
      setPage(1);
    },
    [filters],
  );

  const renderQuery = useCallback((item) => {
    const query: { [key: string]: string } = {};
    query.inventory = item.inventory;
    query.marketListing = item.marketListingId;
    query.conversation = item.conversation;
    return omitBy(query, isUndefined);
  }, []);

  const renderList = useCallback(() => {
    if (!data.length) {
      return <div className={classes.noNotification}>You have no notification</div>;
    }
    return data.map((item) => {
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
          <Link
            key={item.id}
            href={contents[item.templateKey].href?.replace('account', isStorefront ? 'store-front' : 'account')}>
            {renderContent(item)}
          </Link>
        );
      }
      return <Fragment key={item.id}>{renderContent(item)}</Fragment>;
    });
  }, [data, isStorefront, renderAs, renderQuery, renderContent]);

  return (
    <Row className={classes.container}>
      <Modal title={'Show'} isOpen={show} onClose={toggleShow}>
        <Filter filters={filters} handleChange={handleFilter} />
      </Modal>
      {checkExistLocalStorage() && localStorage.getItem('CHECK_ROLE_NOTIFICATION') === 'NOT_PARTNER' && (
        <Row className={cx(classes.topFilter, 'd-block', 'd-md-none')}>
          <button type="button" className={classes.filterButton} onClick={toggleShow}>
            <img src={images.marketplace.iconFilterMarketplace} alt={'filter'} />
            Filters
          </button>
        </Row>
      )}
      <Col md={8}>
        <div className={classes.listNotification}>
          {loading
            ? Array(10)
                .fill(0)
                .map((item, index) => <ContentSkeleton key={String(index)} />)
            : renderList()}
        </div>
        <div className={classes.pagination}>
          <Pagination onChangePage={handleChangePage} totalPage={totalPage} page={page} />
        </div>
      </Col>
      {checkExistLocalStorage() && localStorage.getItem('CHECK_ROLE_NOTIFICATION') === 'NOT_PARTNER' && (
        <Col md={4} className={'d-none d-md-block'}>
          <Filter filters={filters} handleChange={handleFilter} />
        </Col>
      )}
    </Row>
  );
};

export default ListNotification;
