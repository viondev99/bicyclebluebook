import { fork } from '@redux-saga/core/effects';
import cartSaga from './cart/cart.saga';
import shippingSaga from './shipping/shipping.saga';
import paymentSaga from './payment/payment.saga';

export default function* checkoutSaga() {
  yield fork(cartSaga);
  yield fork(shippingSaga);
  yield fork(paymentSaga);
}
