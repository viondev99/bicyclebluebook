import { PromiseWithCancel } from '../helpers/request/request';
import authorizedRequest from '../helpers/request/authorizedRequest';

export interface PartnerInfoModel {
  address: string;
  city: string;
  email: string;
  location: number[];
  name: string;
  state: string;
  website: string;
  widget_enable: boolean;
  widget_url: string;
  zip_code: number;
  phone: string;
  distance?: number;
  _id: string;
}

export interface GetPartnerParams {
  noLoading?: boolean;
  lat?: number;
  lng?: number;
  distance: number;
  state?: string;
  city?: string;
  zip_code?: string;
  is_instant_payout?: boolean;
}

export type ListPartnerResponse = PartnerInfoModel[];

export function getListPartner(params: GetPartnerParams): PromiseWithCancel<ListPartnerResponse> {
  return authorizedRequest.get<ListPartnerResponse>(`auth/api/v1/partner/search`, { params });
}
