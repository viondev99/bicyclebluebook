import React, { useCallback, useMemo, useState } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import images from 'assets/images';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import PaymentInfo from 'components/StoreFront/Order/Detail/PaymentInfo/PaymentInfo';
import OrderInfo from 'components/StoreFront/Order/Detail/OrderInfo/OrderInfo';
import dayjs from 'dayjs';
import _get from 'lodash/get';
import CONFIG from 'config';
import { stringify } from 'querystring';
import ComplaintInfo from 'components/Account/Personal/Orders/Detail/ComplaintInfo/ComplaintInfo';
import ContactModal from 'components/StoreFront/Order/Detail/ContactModal/ContactModal';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import { handleCheckListUsersBlockedRequest } from 'store/partner/account/account.saga';
import classes from './order-detail-container.module.scss';
import OrderSkeleton from './OrderSkeleton';

const OrderDetailContainer = () => {
  const loading = useSelector((store: StoreState) => store.storeFront.order.detail.loading);
  const order = useSelector((store: StoreState) => store.storeFront.order.detail.order);
  const token = useSelector((store: StoreState) => store.authenticate.token);
  const [contactModalVisible, setContactModalVisible] = useState<boolean>(false);
  const userId = useSelector((store: StoreState) => store.authenticate.user?._id);
  const isBuyer = useMemo(() => {
    return order?.user === userId;
  }, [order, userId]);
  // eslint-disable-next-line no-nested-ternary
  const targetContactId = !isBuyer
    ? order?.user
    : isBuyer && order?.storefronts?.length > 0
    ? order.storefronts[0]
    : '';

  const handleContactTarget = useCallback(async () => {
    const isBlocked = await handleCheckListUsersBlockedRequest({ ids: [targetContactId] });
    if (isBlocked) {
      return toastError(t('myAccount.message.checkUsersBlockedAccess'));
    }
    setContactModalVisible(!contactModalVisible);
  }, [targetContactId]);

  const handlePrint = useCallback(() => {
    const date: string = dayjs(order?.date_finish).format('MM/DD/YYYY, HH:mm');
    const stores = _get(order, 'storesInfo', []).map((item: any) => ({
      id: item._id,
      name: item.name,
    }));

    const query = {
      id: order._id,
      token,
      date,
      seller: JSON.stringify(stores),
    };

    const url = `${CONFIG.BASE_URL}report/print-pdf?${stringify(query)}`;
    window.open(url, '_blank', 'height=700,width=1200');
  }, [order, token]);

  const handleDownload = useCallback(() => {
    const date: string = dayjs(order?.date_finish).format('MM/DD/YYYY, HH:mm');
    const stores = _get(order, 'storesInfo', []).map((item: any) => ({
      id: item._id,
      name: item.name,
    }));

    const query = {
      id: order._id,
      token,
      date,
      seller: JSON.stringify(stores),
    };

    const url = `${CONFIG.BASE_URL}report/pdf?${stringify(query)}`;
    window.open(url, '_blank', 'height=700,width=1200');
  }, [order, token]);

  return (
    <div className={classes.container}>
      <Card className={cx('flex-row', classes.header)}>
        <Link href={'/store-front/order-history'}>
          <Button buttonType="transparent" buttonSize={'s'}>
            <img src={images.icLeftArrowBlack} alt={'Left Arrow'} />
            <span>Back to Orders</span>
          </Button>
        </Link>
        <div className={'d-flex'}>
          <Button disabled={loading} buttonType="transparent" buttonSize={'s'} onClick={handleDownload}>
            <img src={images.account.order.icPdf} alt={'Pdf Icon'} />
            <span className={'d-none d-lg-block ml-2'}>Print Invoice (PDF)</span>
          </Button>
          <Button disabled={loading} className={'ml-4'} buttonType="transparent" buttonSize={'s'} onClick={handlePrint}>
            <img src={images.account.order.icPrint} alt={'Print Icon'} />
            <span className={'d-none d-lg-block ml-2'}>Print Invoice</span>
          </Button>
          <Button
            disabled={loading}
            buttonType="transparent"
            buttonSize={'s'}
            className={'ml-4'}
            onClick={() => {
              handleContactTarget();
            }}>
            <img src={images.account.personal.icMessage} alt={'Print Icon'} />
            <span className={'d-none d-lg-block ml-2'}>Contact Buyer</span>
          </Button>
        </div>
      </Card>
      {loading ? (
        <OrderSkeleton />
      ) : (
        <>
          <OrderInfo order={order} />
          <PaymentInfo order={order} />
          <ComplaintInfo orderId={order._id} isSeller={true} />
          <ContactModal
            order={order}
            isOpen={contactModalVisible}
            onClose={() => {
              setContactModalVisible(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default OrderDetailContainer;
