import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import {
  GetOrdersQuery,
  OrderDetailResponse,
  OrderListingResponse,
  RefundOrderResponse,
  RefundRequest,
  ReturnDetailRequest,
  ReturnDetailResponse,
  SellerInfoResponse,
  RefundRequestFromBuyer,
  OpenCaseForBuyerBody,
  OrderModel,
} from 'model/api/account/personal/orders.model';
import { DataList } from 'model/common';

export function getOrders(query: GetOrdersQuery): PromiseWithCancel<OrderListingResponse> {
  return authorizedRequest.get<OrderListingResponse>(`billing/api/v1/order`, { params: query });
}

export function getSellerInfo(ids: string[]): PromiseWithCancel<SellerInfoResponse[]> {
  return authorizedRequest.post<SellerInfoResponse[]>(`auth/api/v1/user/list-info-basic`, {
    ids,
  });
}

export function getDetailOrder(id: string): PromiseWithCancel<OrderDetailResponse> {
  return authorizedRequest.get<OrderDetailResponse>(`billing/api/v1/order/${id}`);
}

export function refundOrder(payload: RefundRequest): PromiseWithCancel<RefundOrderResponse> {
  return authorizedRequest.post<RefundOrderResponse>(`/billing/api/v1/order/return-item`, payload);
}

export function getReturnDetail(query: ReturnDetailRequest): PromiseWithCancel<ReturnDetailResponse> {
  return authorizedRequest.get<ReturnDetailResponse>('billing/api/v1/item-refund/detail-by-condition', {
    params: query,
  });
}

export function sendRequestRefundForSeller(payload: RefundRequestFromBuyer): PromiseWithCancel<RefundOrderResponse> {
  return authorizedRequest.post<RefundOrderResponse>(`billing/api/v1/order/refund`, payload);
}

export interface MasterListingItem {
  master_listing: number;
  market_listing: number;
  status: 'RECEIVED' | 'NOT_RECEIVED';
}

export interface MarkAsReceivedItemForBuyerBody {
  order_id: string;
  master_listings: MasterListingItem[];
}

export interface MarkAsReceivedItemForBuyerResponse {}

export function markAsReceivedItemForBuyer(
  payload: MarkAsReceivedItemForBuyerBody,
): PromiseWithCancel<MarkAsReceivedItemForBuyerResponse> {
  return authorizedRequest.post<MarkAsReceivedItemForBuyerResponse>(`billing/api/v1/order/set-status-item`, payload);
}

export interface MarkAsReceivedForBuyerBody {
  order_id: string;
  status: 'RECEIVED' | 'NOT_RECEIVED';
}

export interface MarkAsReceivedForBuyerResponse {}

export function markAsReceivedForBuyer(
  payload: MarkAsReceivedForBuyerBody,
): PromiseWithCancel<MarkAsReceivedForBuyerResponse> {
  return authorizedRequest.post<MarkAsReceivedForBuyerResponse>(`billing/api/v1/order/set-status-all-item`, payload);
}

export interface SendComplaintForBuyerBody {
  order_id: string;
  name: string;
  content: string;
}

export interface SendComplaintForBuyerResponse {}

export function sendComplaintForBuyer(
  payload: SendComplaintForBuyerBody,
): PromiseWithCancel<SendComplaintForBuyerResponse> {
  return authorizedRequest.post<SendComplaintForBuyerResponse>(`billing/api/v1/complain-order`, payload);
}

export function openCaseForBuyer(payload: OpenCaseForBuyerBody): PromiseWithCancel<OrderModel> {
  return authorizedRequest.post<OrderModel>(`billing/api/v1/complain-order`, payload);
}

export interface GetComplaintOrderResponse {
  _id: string;
  name: string;
  buyer_id: string;
  buyer_email: string;
  buyer_name: string;
  content: string;
  date_created: string;
  date_updated: string;
  is_archive: boolean;
  is_read: boolean;
  order: string;
  order_code: string;
  status: string;
  assignee: {
    id: string;
    email: string;
    name: string;
  };
  reason_case?: {
    description: string;
    reason: string;
  };
  send_reponses?: object[];
}

interface GetComplaintsOrderParams {
  is_seller: boolean;
  status?: string;
  time_start?: number;
  time_end?: number;
  page: number;
  page_size: number;
  sort: string;
  where?: string;
  pattern?: string;
}

export function getComplaintsOrder(
  payload: GetComplaintsOrderParams,
): PromiseWithCancel<DataList<GetComplaintOrderResponse>> {
  return authorizedRequest.get<DataList<GetComplaintOrderResponse>>(`billing/api/v1/complain-order`, {
    params: payload,
  });
}
