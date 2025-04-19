import React, { useMemo, ReactElement, useState } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import images from 'assets/images';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import ContactModal from 'components/StoreFront/Order/Detail/ContactModal/ContactModal';
import classes from './cancel-order.module.scss';
import RefundOrderSkeleton from '../Refund/RefundOrderSkeleton';
import OrderInfo from './OrderInfo/OrderInfo';
import FormCancel from './FormCancel/FormCancel';

const CancelOrderContainer = () => {
  const loading = useSelector((store: StoreState) => store.storeFront.order.detail.loading);
  const order = useSelector((store: StoreState) => store.storeFront.order.detail.order);
  const [contactModalVisible, setContactModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const renderPage = useMemo((): ReactElement => {
    if (loading) {
      return <RefundOrderSkeleton />;
    }
    if (!loading && !order) {
      return <h1>This order was not found !.</h1>;
    }
    return (
      <>
        <OrderInfo order={order} />
        <FormCancel order={order} />
      </>
    );
  }, [loading, order]);
  return (
    <div className={classes.container}>
      <Card className={cx('flex-row justify-content-between', classes.header)}>
        <Button buttonType="transparent" buttonSize={'s'} onClick={() => router.back()}>
          <img src={images.icLeftArrowBlack} alt={'Left Arrow'} />
          <span className={classes.back}>Back</span>
        </Button>
        <Button
          buttonType="transparent"
          buttonSize={'s'}
          className={'ml-4'}
          onClick={() => {
            setContactModalVisible(!contactModalVisible);
          }}>
          <img src={images.account.personal.icMessage} alt={'Print Icon'} />
          <span className={'d-none d-md-block ml-2'}>Contact Buyer</span>
        </Button>
      </Card>
      {renderPage}
      <ContactModal
        order={order}
        isOpen={contactModalVisible}
        onClose={() => {
          setContactModalVisible(false);
        }}
      />
    </div>
  );
};

export default CancelOrderContainer;
