import React, { useCallback, useEffect } from 'react';
import paymentAction from 'store/checkout/payment/payment.action';
import { useDispatch, useSelector } from 'react-redux';
import router, { useRouter } from 'next/router';
import StoreState from 'model/store';
import { toastError } from 'helpers/utils.helper';
import ModalWaitingPaymentSuccess from '@ui/Modal/ModalWaitingPaymentSuccess';
import { connectSocketPayment } from 'helpers/utilities.helper';
import { getDetailOrder } from 'api/account/personal/order.api';
import { OrderDetailResponse } from 'model/api/account/personal/orders.model';
import cartAction from 'store/checkout/cart/cart.action';
import { getDetailOrderFailed } from 'store/account/personal/orders/orders.action';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const socketConnection = useSelector((state: StoreState) => state.checkout.cart.socketConnection);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);

  const handleResetInfoPayment = useCallback(() => {
    dispatch(cartAction.saveCheckoutShipping(null));
    dispatch(cartAction.saveCheckoutBilling(null));
    dispatch(cartAction.applyCouponCode(''));
    dispatch(paymentAction.setDetailGiftCard(null));
    dispatch(cartAction.saveCheckoutCustomer({}));
    dispatch(getDetailOrderFailed());
  }, [dispatch]);

  useEffect(() => {
    if (!socketConnection) {
      connectSocketPayment(userInfo?._id, `${query?.id}`);
    }
    const timer = setTimeout(async () => {
      try {
        const response: OrderDetailResponse = await getDetailOrder(`${query?.id}`);
        if (response?.status === 'completed') {
          dispatch(paymentAction.setCheckoutSuccessId(`${query?.id}`));
          return router.replace(`/checkout/success`);
        }
        router.replace(`/account/order/${`${query?.id}`}`);
      } catch (error) {
        router.replace(`/account/order/${`${query?.id}`}`);
      }
    }, 6000);

    return () => {
      clearTimeout(timer);
      handleResetInfoPayment();
    };
  }, [dispatch, handleResetInfoPayment, query, socketConnection, userInfo]);

  useEffect(() => {
    dispatch(cartAction.getCarts());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (socketConnection) {
        socketConnection.removeAllListeners();
        socketConnection.disconnect();
      }
    };
  }, [socketConnection]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.on('payment_succeeded', (msg: string) => {
        console.log('$ PAYMENT COMPLETED:', msg);
        dispatch(paymentAction.setCheckoutSuccessId(`${query?.id}`));

        socketConnection.removeAllListeners();
        socketConnection.disconnect();
        router.replace(`/checkout/success/`);
      });

      socketConnection.on('payment_failed', (msg: string) => {
        console.log('$ PAYMENT FAILED:', msg);
        toastError(msg);
        socketConnection.removeAllListeners();
        socketConnection.disconnect();
        router.replace(`/cart`);
      });
    }
  }, [dispatch, query, socketConnection]);
  return <ModalWaitingPaymentSuccess onClose={() => null} isOpen={true} />;
};

export default withInjectAllSaga(CheckoutSuccess);
