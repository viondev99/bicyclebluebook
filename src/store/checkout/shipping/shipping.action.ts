import { createActions } from 'redux-actions';
import { DataList } from '../../../model/common';
import { ShippingSingle } from '../../../model/store/checkout/shipping.model';

export interface AddShippingPayload {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  apartment?: string;
}

export type GetShippingSucceededPayload = DataList<ShippingSingle>;

export type ShippingPayload = GetShippingSucceededPayload | AddShippingPayload | string;

const {
  getShipping,
  getShippingSucceeded,
  getShippingFailed,
  addShipping,
  addShippingSucceeded,
  addShippingFailed,
  removeShipping,
  removeShippingSucceeded,
  removeShippingFailed,
  editShipping,
  editShippingSucceeded,
  editShippingFailed,
} = createActions<ShippingPayload>({
  GET_SHIPPING: null,
  GET_SHIPPING_SUCCEEDED: (payload: GetShippingSucceededPayload) => payload,
  GET_SHIPPING_FAILED: null,
  ADD_SHIPPING: (payload: AddShippingPayload) => payload,
  ADD_SHIPPING_SUCCEEDED: null,
  ADD_SHIPPING_FAILED: null,
  REMOVE_SHIPPING: (payload: string) => payload,
  REMOVE_SHIPPING_SUCCEEDED: null,
  REMOVE_SHIPPING_FAILED: null,
  EDIT_SHIPPING: (id: string, body: AddShippingPayload) => ({ id, ...body }),
  EDIT_SHIPPING_SUCCEEDED: null,
  EDIT_SHIPPING_FAILED: null,
});

export default {
  getShipping,
  getShippingSucceeded,
  getShippingFailed,
  addShipping,
  addShippingSucceeded,
  addShippingFailed,
  removeShipping,
  removeShippingSucceeded,
  removeShippingFailed,
  editShipping,
  editShippingSucceeded,
  editShippingFailed,
};
