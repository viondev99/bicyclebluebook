import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import { DataList } from 'model/common';
import { CancelOrderQuery, GetBuyerOrdersQuery, GetOrdersQuery, OrderModel } from 'model/api/store-front/order.model';
import omit from 'lodash/omit';

export function getOrders(query: GetOrdersQuery): PromiseWithCancel<DataList<OrderModel>> {
  return authorizedRequest.get<DataList<OrderModel>>(`billing/api/v1/order/by-storefront`, { params: query });
}

export function getDetailOrder(id: string) {
  return authorizedRequest.get(`/billing/api/v1/order/by-storefront/${id}`);
}

export function getOrderByCustomer(query: GetBuyerOrdersQuery) {
  return authorizedRequest.get<DataList<OrderModel>>(`billing/api/v1/order/storefront/by-user?customer=${query.id}`, {
    params: omit(query, 'id'),
  });
}

export function cancelOrder(bodyParams: CancelOrderQuery) {
  return authorizedRequest.post(`/billing/api/v1/order/cancel`, bodyParams);
}
