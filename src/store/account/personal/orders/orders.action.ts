import {
  OrderDetailModel,
  OrderModel,
  ReturnDetailModel,
  ComplaintOrder,
} from 'model/store/account/personal/orders.model';
import { createActions } from 'redux-actions';
import { DataList } from 'model/common';
import { RefundRequest } from 'model/api/account/personal/orders.model';

export type GetOrdersPayload = { page?: number; sort?: string; page_size?: number };
export type GetOrdersSuccessPayload = DataList<OrderModel>;
export type GetOrdersFailedPayload = string;

export type GetDetailOrderPayload = string;
export type GetDetailOrderSuccessPayload = OrderDetailModel;
export type GetDetailOrderFailedPayload = string;

export type RefundOrderPayload = RefundRequest;
export type RefundOrderSuccessPayload = RefundRequest;
export type RefundOrderFailedPayload = RefundRequest;

export type GetReturnDetailPayload = {
  inventory_id: number;
  market_listing_id: number;
  master_listing_id: number;
  order_id: string;
};
export type GetReturnDetailSuccessPayload = ReturnDetailModel;
export type GetReturnDetailFailedPayload = string;

export type CreateConversationPayload = RefundRequest;
export type CreateConversationSuccessPayload = RefundRequest;
export type CreateConversationFailedPayload = RefundRequest;

export type GetDetailMeta = {
  silentLoad: boolean;
};

export type GetComplaintsOrderPayload = {
  isSeller: boolean;
  status?: string;
  timeStart?: number;
  timeEnd?: number;
  page: number;
  pageSize: number;
  sort: string;
  where?: string;
  pattern?: string;
};

export type GetComplainsOrderSuccessPayload = ComplaintOrder[];

export type GetComplainsOrderFailedPayload = string;

export type OrderPayload =
  | GetOrdersPayload
  | GetOrdersSuccessPayload
  | GetOrdersFailedPayload
  | GetDetailOrderPayload
  | GetDetailOrderSuccessPayload
  | GetDetailOrderFailedPayload
  | RefundOrderPayload
  | RefundOrderSuccessPayload
  | RefundOrderFailedPayload
  | GetReturnDetailPayload
  | GetReturnDetailSuccessPayload
  | GetReturnDetailFailedPayload
  | CreateConversationPayload
  | CreateConversationSuccessPayload
  | CreateConversationFailedPayload
  | GetComplaintsOrderPayload
  | GetComplainsOrderSuccessPayload
  | GetComplainsOrderFailedPayload;

export const {
  getOrders,
  getOrdersSucceeded,
  getOrdersFailed,
  getDetailOrder,
  getDetailOrderSucceeded,
  getDetailOrderFailed,
  refundOrder,
  refundOrderSucceeded,
  refundOrderFailed,
  getReturnDetail,
  getReturnDetailSucceeded,
  getReturnDetailFailed,
  createConversation,
  createConversationSucceeded,
  createConversationFailed,
  getComplaintsOrder,
  getComplaintsOrderSucceeded,
  getComplaintsOrderFailed,
} = createActions<OrderPayload>(
  {
    GET_ORDERS: (payload: GetOrdersPayload) => payload,
    GET_ORDERS_SUCCEEDED: (payload: GetOrdersSuccessPayload) => payload,
    GET_ORDERS_FAILED: (payload: GetOrdersFailedPayload) => payload,

    GET_DETAIL_ORDER: [(payload: string) => payload, (payload: string, meta: GetDetailMeta) => meta],
    GET_DETAIL_ORDER_SUCCEEDED: (payload: GetDetailOrderSuccessPayload) => payload,
    GET_DETAIL_ORDER_FAILED: (payload: GetDetailOrderFailedPayload) => payload,

    REFUND_ORDER: (payload: RefundOrderPayload) => payload,
    REFUND_ORDER_SUCCEEDED: (payload: RefundOrderSuccessPayload) => payload,
    REFUND_ORDER_FAILED: (payload: RefundOrderFailedPayload) => payload,

    GET_RETURN_DETAIL: (payload: GetReturnDetailPayload) => payload,
    GET_RETURN_DETAIL_SUCCEEDED: (payload: GetReturnDetailSuccessPayload) => payload,
    GET_RETURN_DETAIL_FAILED: (payload: GetReturnDetailFailedPayload) => payload,

    CREATE_CONVERSATION: (payload: CreateConversationPayload) => payload,
    CREATE_CONVERSATION_SUCCEEDED: (payload: CreateConversationSuccessPayload) => payload,
    CREATE_CONVERSATION_FAILED: (payload: CreateConversationFailedPayload) => payload,

    GET_COMPLAINTS_ORDER: [
      (payload: GetComplaintsOrderPayload) => payload,
      (payload: GetComplaintsOrderPayload, meta: GetDetailMeta) => meta,
    ],
    GET_COMPLAINTS_ORDER_SUCCEEDED: (payload: GetComplainsOrderSuccessPayload) => payload,
    GET_COMPLAINTS_ORDER_FAILED: (payload: GetComplainsOrderFailedPayload) => payload,
  },
  {
    prefix: 'orders',
  },
);
