import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getBuyerOrders } from 'store/store-front/orders/orders.action';
import { useUserInfo } from 'hooks/useUserInfo';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import images from 'assets/images';
import StoreState from 'model/store';
import OrderItem from 'components/StoreFront/Order/Buyer/Listing/OrderItem/OrderItem';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import Skeleton from 'react-loading-skeleton/lib';
import omit from 'lodash/omit';

import { useStoreInfo } from 'hooks/useStoreInfo';
import classes from './buyer-order-listing-container.module.scss';

interface Query {
  id: string;
}

const BuyerOrderListingContainer = () => {
  const { query, replace, pathname, asPath } = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getBuyerOrders({
        id: query.id,
        page: query.page || 1,
        pageSize: query.pageSize || 1,
        sort: query.sort || 'date_finish:-1',
      }),
    );
  }, [dispatch, query.id, query.page, query.pageSize, query.sort]);

  const handleChangePage = useCallback(
    (page) => {
      replace(
        {
          pathname,
          query: {
            ...omit(query, 'id'),
            page,
          },
        },
        {
          pathname: asPath.split('?')[0],
          query: {
            ...omit(query, 'id', 'page'),
            page,
          },
        },
      );
    },
    [asPath, pathname, query, replace],
  );

  const renderLoading = useCallback(() => {
    return (
      <div>
        {new Array(6).fill(0).map((_, index) => (
          <div key={String(index)} className={'mb-4'}>
            <Card>
              <Skeleton />
              <Skeleton />
            </Card>
          </div>
        ))}
      </div>
    );
  }, []);

  const orders = useSelector((store: StoreState) => store.storeFront.order.buyer.listing.orders);
  const loading = useSelector((store: StoreState) => store.storeFront.order.buyer.listing.loading);
  const userInfo = useUserInfo(String(query.id));
  const sellerInfo = useStoreInfo(String(query.id));

  const hrefSellerPath = sellerInfo ? '/marketplace/online-store/[storeId]' : '/marketplace/seller/[sellerId]';
  const sellerPath = sellerInfo ? `/marketplace/online-store/${sellerInfo.id}` : `/marketplace/seller/${userInfo?.id}`;

  return (
    <div>
      <div className={'d-flex align-items-md-center align-items-start flex-column-reverse flex-md-row'}>
        <h3 className={'mt-4 mt-md-0 mb-0'}>Buyer History</h3>
        <Link href={hrefSellerPath} as={sellerPath}>
          <a>
            <h4 className={cx(classes.customerName, 'ml-2 mb-0')}>{userInfo?.displayName}</h4>
          </a>
        </Link>
        <Link href={{ pathname: `/store-front/order-history/` }} as={{ pathname: `/store-front/order-history/` }}>
          <Button buttonType="transparent" buttonSize={'s'} className={cx('ml-md-auto mt-auto', classes.backButton)}>
            <img src={images.icLeftArrowBlack} alt={'Left Arrow'} />
            <span className={'ml-3'}>Back to Orders</span>
          </Button>
        </Link>
      </div>
      <div className={'mt-5'}>
        {loading ? (
          <>{renderLoading()}</>
        ) : (
          <div>
            {orders.data.map((order) => (
              <OrderItem order={order} key={order._id} />
            ))}
            <div className={'mt-5'}>
              <Pagination
                totalPage={orders.total_page}
                page={+String(query.page || '') || orders.page}
                onChangePage={handleChangePage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrderListingContainer;
