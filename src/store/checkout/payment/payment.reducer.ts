import { Action, handleActions } from 'redux-actions';
import { GetDetailGiftCardResponse } from 'api/checkout/payment.api';
import { PaymentModel } from 'model/store/checkout/shipping.model';
import { CreatePaymentIntentNewLogicResponse } from 'model/store/cart.model';
import { PaymentPayload } from './payment.action';

const INIT_STATE: PaymentModel = {
  loading: false,
  checkoutSuccessId: '',
  detailGiftCard: null,
  dataPaymentIntent: null,
};

const paymentReducer = handleActions<PaymentModel, PaymentPayload>(
  {
    SET_DATA_PAYMENT_INTENT: (state, action: Action<CreatePaymentIntentNewLogicResponse>) => {
      return {
        ...state,
        dataPaymentIntent: action.payload,
      };
    },
    SET_DETAIL_GIFT_CARD: (state, action: Action<GetDetailGiftCardResponse>) => {
      return {
        ...state,
        detailGiftCard: action.payload,
      };
    },
    GET_DETAIL_GIFT_CARD: (state) => {
      return {
        ...state,
      };
    },
    GET_DETAIL_GIFT_CARD_SUCCEEDED: (state, action: Action<GetDetailGiftCardResponse>) => {
      return {
        ...state,
        detailGiftCard: action.payload,
      };
    },
    GET_DETAIL_GIFT_CARD_FAILED: (state) => {
      return {
        ...state,
      };
    },
    SET_CHECKOUT_SUCCESS_ID: (state, action: Action<string>) => {
      return { ...state, loading: true, checkoutSuccessId: action.payload };
    },
    CREATE_PAYPAL_PAYMENT: (state) => {
      return { ...state, loading: true };
    },
    CREATE_PAYPAL_PAYMENT_SUCCEEDED: (state) => {
      return { ...state, loading: false };
    },
    CREATE_PAYPAL_PAYMENT_FAILED: (state) => {
      return { ...state, loading: false };
    },
    CREATE_STRIPE_PAYMENT: (state) => {
      return { ...state, loading: true };
    },
    CREATE_STRIPE_PAYMENT_SUCCEEDED: (state) => {
      return { ...state, loading: false };
    },
    CREATE_STRIPE_PAYMENT_FAILED: (state) => {
      return { ...state, loading: false };
    },
    CREATE_STRIPE_PAYMENT_P2P: (state) => {
      return { ...state, loading: true };
    },
    CREATE_STRIPE_PAYMENT_P2P_SUCCEEDED: (state) => {
      return { ...state, loading: false };
    },
    CREATE_STRIPE_PAYMENT_P2P_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    CONFIRM_STRIPE_PAYMENT_P2P: (state) => {
      return { ...state, loading: true };
    },
    CONFIRM_STRIPE_PAYMENT_P2P_SUCCEEDED: (state) => {
      return { ...state, loading: false };
    },
    CONFIRM_STRIPE_PAYMENT_P2P_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
);
export default paymentReducer;
