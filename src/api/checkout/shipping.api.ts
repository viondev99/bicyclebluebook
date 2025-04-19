import authorizedRequest from '../../helpers/request/authorizedRequest';
import { DataList } from '../../model/common';

export interface Shipping {
  city: string;
  date_created: Date;
  date_updated: Date;
  first_name: string;
  last_name: string;
  line1: string;
  phone: string;
  postal_code: string;
  stage: string;
  state: string;
  user: string;
  _id: string;
}

export type GetShippingResponse = DataList<Shipping>;

export function getShipping() {
  return authorizedRequest.get<GetShippingResponse>('/billing/api/v1/shipping/list-by-user', {
    params: {
      page_size: -1,
    },
  });
}

export interface AddShippingBody {
  first_name: string;
  last_name: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  apartment?: string;
}

export function addShipping(body: AddShippingBody) {
  return authorizedRequest.post('/billing/api/v1/shipping', body);
}

export function removeShipping(id: string) {
  return authorizedRequest.delete(`/billing/api/v1/shipping/${id}`);
}

export function editShipping(id: string, shippingInfo: AddShippingBody) {
  return authorizedRequest.put(`/billing/api/v1/shipping/${id}`, shippingInfo);
}
