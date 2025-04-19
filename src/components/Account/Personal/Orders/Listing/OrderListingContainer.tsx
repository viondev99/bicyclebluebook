import React, { useCallback, useEffect } from 'react';
import Card from '@ui/Cards';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from 'store/account/personal/orders/orders.action';
import StoreState from 'model/store';
import Button from '@ui/Buttons/Primary/Button';
import Link from 'next/link';
import Pagination from '@ui/Pagination/Pagination';
import { useRouter } from 'next/router';
import classes from './order-listing.module.scss';
import OrderSkeleton from './OrderItem/OrderSkeleton';
import OrderItem from './OrderItem/OrderItem';

const OrderListingContainer = () => {
  const dispatch = useDispatch();
  const { query, replace, pathname } = useRouter();
  useEffect(() => {
    dispatch(
      getOrders({
        page: query.page || 1,
      }),
    );
  }, [dispatch, query.page]);

  const order = useSelector((store: StoreState) => store.account.personal.orders.listing);

  const handleChangePage = useCallback(
    (page) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [pathname, query, replace],
  );

  const renderLoading = useCallback(() => {
    return (
      <div>
        {new Array(3).fill(0).map((_, index) => (
          <OrderSkeleton key={String(index)} className={classes.item} />
        ))}
      </div>
    );
  }, []);

  const renderContent = useCallback(() => {
    if (order.orders.data.length === 0) {
      return (
        <Card className={'p-5'}>
          <div>
            <h3>You haven’t purchased anything yet.</h3>
            <Link href={'/marketplace/buy-now'}>
              <Button className={'mt-5'}>Visit Marketplace</Button>
            </Link>
          </div>
        </Card>
      );
    }
    return (
      <>
        {order.orders.data.map((item) => (
          <OrderItem order={item} key={item._id} className={classes.item} />
        ))}
        <div className={'mt-5'}>
          <Pagination
            totalPage={order.orders.total_page}
            page={+String(query.page || '') || order.orders.page}
            onChangePage={handleChangePage}
          />
        </div>
      </>
    );
  }, [handleChangePage, order.orders.data, order.orders.page, order.orders.total_page, query.page]);

  return <div className={classes.container}>{order.loading ? <>{renderLoading()}</> : <>{renderContent()}</>}</div>;
};

export default OrderListingContainer;
