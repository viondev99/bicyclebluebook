import React, { useMemo, ReactElement } from 'react';
import Card from '@ui/Cards';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './cancel-order.module.scss';
import CancelOrderSkeleton from './CancelOrderSkeleton';
import CancelForm from './CancelForm/index';

const CancelOrderContainer = () => {
  const loading = useSelector((store: StoreState) => store.account.personal.orders.detail.loading);
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);
  const renderPage = useMemo((): ReactElement => {
    if (loading) {
      return <CancelOrderSkeleton />;
    }
    if (!loading && !order) {
      return <h1>This order was not found !.</h1>;
    }
    return <CancelForm order={order} />;
  }, [loading, order]);
  return (
    <Card className={classes.container}>
      <div className={classes.header}>
        <Link href={'/account/orders'}>
          <Button buttonType="transparent" buttonSize={'s'} className={classes.showMobile}>
            <img src={icLeftArrowBlack} alt={'Left Arrow'} />
            <span className={classes.btnBack}>Back to Order</span>
          </Button>
        </Link>
        <div className={classes.title}>Cancel Order</div>
        <Link href={'/account/orders'}>
          <Button buttonType="transparent" buttonSize={'s'} className={classes.hiddenMobile}>
            <img src={icLeftArrowBlack} alt={'Left Arrow'} />
            <span className={classes.btnBack}>Back to Order</span>
          </Button>
        </Link>
      </div>
      {renderPage}
    </Card>
  );
};

export default CancelOrderContainer;
