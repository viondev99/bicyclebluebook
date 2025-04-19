import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import {
  addShipping,
  AddShippingBody,
  editShipping,
  getShipping,
  GetShippingResponse,
  removeShipping,
} from '../../../api/checkout/shipping.api';
import shippingAction, { AddShippingPayload } from './shipping.action';
import cartAction from '../cart/cart.action';
import { toastError } from '../../../helpers/utils.helper';
import StoreState from '../../../model/store';

function* handleGetShipping() {
  try {
    const response: GetShippingResponse = yield call(getShipping);
    yield put(shippingAction.getShippingSucceeded(response));
  } catch (e) {
    yield put(shippingAction.getShippingFailed());
    toastError(e);
  }
}

function* handleAddShipping(action: Action<AddShippingPayload>) {
  try {
    const { payload } = action;
    const body: AddShippingBody = {
      first_name: payload.firstName,
      last_name: payload.lastName,
      city: payload.city,
      line1: payload.address,
      state: payload.state,
      postal_code: payload.zip,
      phone: payload.phoneNumber,
    };
    if (payload?.apartment) {
      body.apartment = payload?.apartment;
    }
    yield call(addShipping, body);

    yield put(shippingAction.addShippingSucceeded());
    yield put(shippingAction.getShipping());
  } catch (e) {
    yield put(shippingAction.addShippingFailed());
    toastError(e);
  }
}

function* handleRemoveShipping(action: Action<string>) {
  try {
    yield call(removeShipping, action.payload);
    yield put(shippingAction.removeShippingSucceeded());
    yield put(shippingAction.getShipping());
    const currentShipping = yield select((state: StoreState) => state.checkout.cart.shipping._id);
    if (currentShipping === action.payload) {
      yield put(cartAction.saveCheckoutShipping({}));
    }
  } catch (e) {
    yield put(shippingAction.removeShippingFailed());
    toastError(e);
  }
}
function* handleEditShipping(action: Action<{ id: string } & AddShippingPayload>) {
  try {
    const { id, ...shippingInfo } = action.payload;
    const body: AddShippingBody = {
      first_name: shippingInfo.firstName,
      last_name: shippingInfo.lastName,
      city: shippingInfo.city,
      line1: shippingInfo.address,
      state: shippingInfo.state,
      postal_code: shippingInfo.zip,
      phone: shippingInfo.phoneNumber,
      apartment: shippingInfo.apartment,
    };
    yield call(editShipping, id, body);
    yield put(shippingAction.editShippingSucceeded());
    yield put(shippingAction.getShipping());
  } catch (e) {
    yield put(shippingAction.editShippingFailed());
    toastError(e);
  }
}

export default function* shippingSaga() {
  yield takeLatest(shippingAction.getShipping, handleGetShipping);
  yield takeLatest(shippingAction.addShipping, handleAddShipping);
  yield takeLatest(shippingAction.removeShipping, handleRemoveShipping);
  yield takeLatest(shippingAction.editShipping, handleEditShipping);
}
