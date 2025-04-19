/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useMemo } from 'react';
import Card from '@ui/Cards';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import icPdf from 'assets/img/account/personal/orders/ic_pdf.svg';
import icPrint from 'assets/img/account/personal/orders/ic_print.svg';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import OrderSkeleton from 'components/Account/Personal/Orders/Detail/OrderInfo/OrderSkeleton';
import ContactModal from 'components/Account/Personal/Orders/Detail/ContactModal/ContactModal';
import dayjs from 'dayjs';
import { stringify } from 'querystring';
import CONFIG from 'config';
import _get from 'lodash/get';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import { handleCheckListUsersBlockedRequest } from 'store/partner/account/account.saga';
import PaymentInfo from './PaymentInfo/PaymentInfo';
import OrderInfo from './OrderInfo/OrderInfo';
import classes from './order-detail-container.module.scss';
import ComplaintInfo from './ComplaintInfo/ComplaintInfo';

const OrderDetailContainer = () => {
  const loading = useSelector((store: StoreState) => store.account.personal.orders.detail.loading);
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);
  const token = useSelector((store: StoreState) => store.authenticate.token);
  const userId = useSelector((store: StoreState) => store.authenticate.user?._id);
  const isBuyer = useMemo(() => {
    return order?.user === userId;
  }, [order, userId]);
  const [contactModal, setContactModal] = useState<boolean>(false);
  const targetContactId = !isBuyer
    ? order?.user
    : isBuyer && order?.storefronts?.length > 0
    ? order.storefronts[0]
    : '';

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

  const handleContactTarget = useCallback(async () => {
    const isBlocked = await handleCheckListUsersBlockedRequest({
      ids: [targetContactId],
    });
    if (isBlocked) {
      return toastError(t('myAccount.message.checkUsersBlockedAccess'));
    }
    setContactModal(true);
  }, [targetContactId]);

  return (
    <>
      <div className={classes.container}>
        <Card className={cx('flex-row', classes.header)}>
          {token && (
            <Link href={'/account/orders'}>
              <Button buttonType="transparent" buttonSize={'s'}>
                <img src={icLeftArrowBlack} alt={'Left Arrow'} />
                <span>Back to Orders</span>
              </Button>
            </Link>
          )}
          <div className={'d-flex'}>
            <Button disabled={loading} buttonType="transparent" buttonSize={'s'} onClick={handleDownload}>
              <img src={icPdf} alt={'Pdf Icon'} />
              <span className={'d-none d-lg-block ml-2'}>Print Invoice (PDF)</span>
            </Button>
            <Button
              disabled={loading}
              className={'ml-4'}
              buttonType="transparent"
              buttonSize={'s'}
              onClick={handlePrint}>
              <img src={icPrint} alt={'Print Icon'} />
              <span className={'d-none d-lg-block ml-2'}>Print Invoice</span>
            </Button>
            {token &&
              (isBuyer ? (
                <Button
                  disabled={loading}
                  buttonType="transparent"
                  buttonSize={'s'}
                  onClick={() => {
                    handleContactTarget();
                  }}
                  className={'ml-4'}>
                  <img src={icMessage} alt={'Print Icon'} />
                  <span className={'d-none d-lg-block ml-2'}>Contact Seller</span>
                </Button>
              ) : (
                <Button
                  disabled={loading}
                  buttonType="transparent"
                  buttonSize={'s'}
                  onClick={() => {
                    handleContactTarget();
                  }}
                  className={'ml-4'}>
                  <img src={icMessage} alt={'Print Icon'} />
                  <span className={'d-none d-lg-block ml-2'}>Contact Buyer</span>
                </Button>
              ))}
          </div>
        </Card>

        {loading ? (
          <>
            <OrderSkeleton />
          </>
        ) : (
          order && (
            <>
              <OrderInfo order={order} isSeller={!isBuyer} />
              <PaymentInfo order={order} />
              <ComplaintInfo orderId={order?._id} isSeller={!isBuyer} />
              {token && (
                <ContactModal
                  isSeller={!isBuyer}
                  order={order}
                  isOpen={contactModal}
                  onClose={() => setContactModal(false)}
                />
              )}
            </>
          )
        )}
      </div>
    </>
  );
};

export default OrderDetailContainer;
