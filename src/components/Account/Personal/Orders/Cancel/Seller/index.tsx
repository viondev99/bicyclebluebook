import React, { useMemo, ReactElement, useState } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import FormCancel from 'components/StoreFront/Order/Cancel/FormCancel/FormCancel';
import classes from 'components/StoreFront/Order/Cancel/cancel-order.module.scss';
import RefundOrderSkeleton from 'components/StoreFront/Order/Refund/RefundOrderSkeleton';
import OrderInfo from 'components/StoreFront/Order/Cancel/OrderInfo/OrderInfo';
import ContactBuyerModal from 'components/Contact/Modal/ContactBuyer';

const CancelOrderContainer = () => {
  const loading = useSelector((store: StoreState) => store.account.personal.orders.detail.loading);
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);
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
          <img src={icLeftArrowBlack} alt={'Left Arrow'} />
          <span className={classes.back}>Back</span>
        </Button>
        <Button
          buttonType="transparent"
          buttonSize={'s'}
          className={'ml-4'}
          onClick={() => {
            setContactModalVisible(!contactModalVisible);
          }}>
          <img src={icMessage} alt={'Print Icon'} />
          <span className={'d-none d-md-block ml-2'}>Contact Buyer</span>
        </Button>
      </Card>
      {renderPage}
      <ContactBuyerModal
        isOpen={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        buyerId={order?.user}
        masterListing={order?.line_item[0]?.master_listing_id}
        listingTitle={order?.line_item[0]?.title}
        bikeName={order?.line_item[0]?.title}
        invNames={order?.line_item?.map((i) => i.name)}
        image={order?.line_item[0]?.image_default}
        isOrder={true}
        orderId={order?._id}
      />
    </div>
  );
};

export default CancelOrderContainer;
