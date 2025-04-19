import { combineReducers } from 'redux';
import cartReducer from './cart/cart.reducer';
import shippingReducer from './shipping/shipping.reducer';
import paymentReducer from './payment/payment.reducer';

export default combineReducers({
  cart: cartReducer,
  shipping: shippingReducer,
  payment: paymentReducer,
});
