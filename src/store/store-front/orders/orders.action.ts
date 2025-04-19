import { DetailOrderModel, OrderModel } from 'model/store/store-front/order.model';
import { createActions } from 'redux-actions';
import { DataList } from 'model/common';
import { GetBuyerOrdersQuery, GetOrdersQuery } from 'model/api/store-front/order.model';

export type GetOrdersPayload = GetOrdersQuery;
export type GetOrdersSuccessPayload = DataList<OrderModel>;
export type GetOrdersFailedPayload = string;

export type GetDetailOrderPayload = string;
export type GetDetailOrderSuccessPayload = DetailOrderModel;
export type GetDetailOrderFailedPayload = string;

export type GetBuyerOrdersPayload = GetBuyerOrdersQuery;
export type GetBuyerOrdersSuccessPayload = DataList<OrderModel>;
export type GetBuyerOrdersFailedPayload = string;

export type OrderPayload =
  | GetOrdersPayload
  | GetOrdersSuccessPayload
  | GetOrdersFailedPayload
  | GetDetailOrderPayload
  | GetDetailOrderSuccessPayload
  | GetDetailOrderFailedPayload
  | GetBuyerOrdersPayload
  | GetBuyerOrdersSuccessPayload
  | GetBuyerOrdersFailedPayload;

export const {
  getOrders,
  getOrdersSucceeded,
  getOrdersFailed,
  getDetailOrder,
  getDetailOrderSucceeded,
  getDetailOrderFailed,
  getBuyerOrders,
  getBuyerOrdersSucceeded,
  getBuyerOrdersFailed,
} = createActions<OrderPayload>(
  {
    GET_ORDERS: (payload: GetOrdersPayload) => payload,
    GET_ORDERS_SUCCEEDED: (payload: GetOrdersSuccessPayload) => payload,
    GET_ORDERS_FAILED: (payload: GetOrdersFailedPayload) => payload,

    GET_DETAIL_ORDER: (payload: GetDetailOrderPayload) => payload,
    GET_DETAIL_ORDER_SUCCEEDED: (payload: GetDetailOrderSuccessPayload) => payload,
    GET_DETAIL_ORDER_FAILED: (payload: GetDetailOrderFailedPayload) => payload,

    GET_BUYER_ORDERS: (payload: GetBuyerOrdersPayload) => payload,
    GET_BUYER_ORDERS_SUCCEEDED: (payload: GetBuyerOrdersSuccessPayload) => payload,
    GET_BUYER_ORDERS_FAILED: (payload: GetBuyerOrdersFailedPayload) => payload,
  },
  {
    prefix: 'STORE_FRONT/orders',
  },
);
