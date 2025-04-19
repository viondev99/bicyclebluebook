import { Action, handleActions } from 'redux-actions';
import { ShippingModel } from '../../../model/store/checkout/shipping.model';
import { DataList } from '../../../model/common';
import { GetShippingSucceededPayload, ShippingPayload } from './shipping.action';

const INIT_STATE: ShippingModel = {
  shippingList: new DataList(),
  loading: false,
  adding: false,
  removing: false,
  editing: false,
  editSuccess: false,
};

export default handleActions<ShippingModel, ShippingPayload>(
  {
    GET_SHIPPING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_SHIPPING_SUCCEEDED: (state, action: Action<GetShippingSucceededPayload>) => {
      return {
        ...state,
        shippingList: action.payload,
        loading: false,
      };
    },
    GET_SHIPPING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    ADD_SHIPPING: (state) => {
      return {
        ...state,
        adding: true,
      };
    },
    ADD_SHIPPING_SUCCEEDED: (state) => {
      return {
        ...state,
        adding: false,
      };
    },
    ADD_SHIPPING_FAILED: (state) => {
      return {
        ...state,
        adding: false,
      };
    },
    REMOVE_SHIPPING: (state) => {
      return {
        ...state,
        removing: true,
      };
    },
    REMOVE_SHIPPING_SUCCEEDED: (state) => {
      return {
        ...state,
        removing: false,
      };
    },
    REMOVE_SHIPPING_FAILED: (state) => {
      return {
        ...state,
        removing: false,
      };
    },
    EDIT_SHIPPING: (state) => {
      return {
        ...state,
        editing: true,
        editSuccess: false,
      };
    },
    EDIT_SHIPPING_SUCCEEDED: (state) => {
      return {
        ...state,
        editing: false,
        editSuccess: true,
      };
    },
    EDIT_SHIPPING_FAILED: (state) => {
      return {
        ...state,
        editing: false,
        editSuccess: false,
      };
    },
  },
  INIT_STATE,
);
