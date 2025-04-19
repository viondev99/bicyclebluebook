import React, { useMemo } from 'react';
import Card from '@ui/Cards';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@ui/Buttons/Primary/Button';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import ReturnForm from 'components/Account/Personal/Orders/ReturnOrder/ReturnForm/ReturnForm';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import classes from './order-return-container.module.scss';

const OrderReturnContainer = () => {
  const { query, pathname } = useRouter();
  const orderSelector = useSelector((store: StoreState) => store.account.personal.orders.detail);
  const loading = useMemo(() => {
    return orderSelector?.loading;
  }, [orderSelector]);

  const selectedItem = useMemo(() => {
    if (loading) {
      return null;
    }
    return orderSelector?.order?.line_item?.find((item) => item.master_listing_id === Number(query.itemId));
  }, [loading, orderSelector, query.itemId]);

  const linkBackToOrder = useMemo(() => {
    return pathname.includes('store-front') ? `/store-front/order-history/${query?.id}` : `/account/order/${query.id}`;
  }, [pathname, query]);

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={'d-flex align-items-md-center align-items-start flex-column-reverse flex-md-row'}>
          <h3 className={'mt-4 mt-md-0'}>Return Item</h3>
          <Link href={linkBackToOrder}>
            <Button buttonType="transparent" buttonSize={'s'} className={cx('ml-md-auto mt-auto', classes.backButton)}>
              <img src={icLeftArrowBlack} alt={'Left Arrow'} />
              <span className={'ml-2'}>Back to Order</span>
            </Button>
          </Link>
        </div>
        {loading ? (
          <div>
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <ReturnForm item={selectedItem} />
        )}
      </Card>
    </div>
  );
};

export default OrderReturnContainer;
