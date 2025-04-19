/* eslint-disable no-param-reassign */
import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import { DataList } from 'model/common';
import { PartnerRole } from 'constants/roles';
import { AddPartnerUserPayload, GetListBlockedUsersPayload, UnblockUser } from 'store/partner/account/account.action';
import {
  AddPartnerLocationParams,
  GetListLeadGenParams,
  GetListPartnerLocationParams,
  GetListPartnerUsersParams,
  GetTradeInScorecardReportsParams,
} from 'model/store/partner/account.model';
import { objectToFormData } from 'helpers/objectToFormdata.helper';
import { UpdateNotificationSettingParams } from 'model/store/partner/trade-in-scorecard-reports';
import { AddTradeInDropOffParams, GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import { CheckBlockUserPayload } from 'api/message.api';

export interface AddressResponse {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface BrandResponse {
  id: string;
  name: string;
}

export interface PartnerDetailResponse {
  _id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  partner: string;
  date_created: string;
  date_updated: string;
  user: {
    role: PartnerRole;
    partner: {
      _id: string;
      partner_parent?: string;
      avatar: string;
      name: string;
      phone: string;
      is_send_mail_widget: boolean;
      is_override_bbb: boolean;
      lead_email: string;
      mailing_address: boolean;
      address_mailing: AddressResponse;
      brands_carried: BrandResponse[];
      website: string;
      tell_about: string;
      widget_enable: boolean;
      widget_url: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
      smart_tailing: boolean;
      date_created: string;
      date_updated: string;
      is_donation?: boolean;
    };
  };
}

export interface LeadItem {
  name: string;
  zip_code: string;
  trade_in_value: number;
  email: string;
  status_view: string;
  stage_view: string;
  phone: string;
  id?: string;
}

export interface QuoteItem {
  trade_in_value: number;
  status: string;
  stage: string;
  id?: string | number;
  ownerNotes: string;
}

export function getPartnerDetail(id: string): PromiseWithCancel<PartnerDetailResponse> {
  return authorizedRequest.get<PartnerDetailResponse>(`auth/api/v1/partner-staff/${id}`);
}

export function getListBlockedUsersRequested(
  params: GetListBlockedUsersPayload,
): PromiseWithCancel<GetListBlockedUsersPayload> {
  return authorizedRequest.get<GetListBlockedUsersPayload>(`auth/api/v1/report-user`, {
    params,
  });
}

export function getListPartnerUsersRequest(params: GetListPartnerUsersParams): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`auth/api/v1/partner-staff/list-by-partner`, {
    params,
  });
}
export function getListPartnerLocationRequest(params: GetListPartnerLocationParams): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`auth/api/v1/partner/list-all`, {
    params,
  });
}
export function getPartnerLocationDetailRequest(id: string): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`auth/api/v1/partner/${id}`);
}

export function getTradeInScorecardReportsRequest(payload: GetTradeInScorecardReportsParams): PromiseWithCancel<void> {
  const body = { partnerIds: payload.partnerIds };
  const params = {
    fromDate: payload.fromDate,
    toDate: payload.toDate,
  };
  return authorizedRequest.post<void>(`warehouse/api/trade-in/scorecard-reports`, body, {
    params,
  });
}

export function addPartnerLocationRequest(body: AddPartnerLocationParams): PromiseWithCancel<void> {
  const formData = objectToFormData(body, { indices: true });
  return authorizedRequest.post<void>(`auth/api/v1/partner/create`, formData);
}

export function getNotificationSettingRequest(): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`notify/api/v1/setting/detail-partner-setting`);
}

export function getListLeadGenRequest(params: GetListLeadGenParams): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`support/api/v1/widget/partner/list`, {
    params,
  });
}

export function getDetailLeadGenRequest(id: string): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`support/api/v1/lead-gen/${id}`);
}

export function getDetailHistoryQuoteRequest(id: string): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`core/api/tradeIn/quote/${id}`);
}

export function updateHistoryQuoteRequest(body: QuoteItem): PromiseWithCancel<void> {
  return authorizedRequest.patch<void>(`core/api/tradeIn/quote/${body?.id}`);
}

export function updateDetailLeadGenRequest(body: LeadItem): PromiseWithCancel<void> {
  return authorizedRequest.put<void>(`support/api/v1/lead-gen/${body?.id}`, body);
}

export function getListTradeInBicycleRequest(params: GetListTradeInBicycleParams): PromiseWithCancel<void> {
  delete params?.eBikeHours;
  const paramsV3 = {
    ...params,
    isV3: true,
  };
  return authorizedRequest.get<void>(`core/api/tradeIn/bicycle`, {
    params: paramsV3,
  });
}

export function addTradeInDropOffRequest(body: AddTradeInDropOffParams): PromiseWithCancel<void> {
  return authorizedRequest.post<void>(`core/api/tradeIn/dropOff`, body);
}

export function updateNotificationSettingRequest(body: UpdateNotificationSettingParams[]): PromiseWithCancel<void> {
  return authorizedRequest.put<void>(`notify/api/v1/setting/update/partner-setting`, {
    mails_config: body,
  });
}

export function updatePartnerLocationRequest(id: string, body: AddPartnerLocationParams): PromiseWithCancel<void> {
  const formData = objectToFormData(body, { indices: true });
  return authorizedRequest.put<void>(`auth/api/v1/partner/${id}`, formData);
}

export function filterPartnerDetailRequest(id: string): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`auth/api/v1/partner-staff/${id}`);
}

export function unblockUserRequest(id: string): PromiseWithCancel<UnblockUser> {
  return authorizedRequest.patch<UnblockUser>(`auth/api/v1/report-user/un-block/${id}`);
}

export function checkListUsersBlockedRequest(body: CheckBlockUserPayload) {
  return authorizedRequest.post(`auth/api/v1/report-user/check-user-block`, body);
}

interface UpdatePartnerDetailResponse {
  _id: string;
  avatar: string;
  name: string;
  phone: string;
  is_override_bbb: boolean;
  lead_email: string;
  mailing_address: boolean;
  address_mailing: AddressResponse;
  brands_carried: BrandResponse[];
  website: string;
  tell_about: string;
  widget_enable: boolean;
  widget_url: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  smart_tailing: boolean;
  date_created: string;
  date_updated: string;
}

export function updatePartnerDetail(id: string, body: FormData): PromiseWithCancel<UpdatePartnerDetailResponse> {
  return authorizedRequest.put<UpdatePartnerDetailResponse>(`auth/api/v1/partner/${id}`, body);
}

interface UpdatePartnerUserProfileResponse {
  _id: string;
  partner_parent?: string;
  avatar: string;
  name: string;
  phone: string;
  is_send_mail_widget: boolean;
  is_override_bbb: boolean;
  lead_email: string;
  mailing_address: boolean;
  address_mailing: AddressResponse;
  brands_carried: BrandResponse[];
  website: string;
  tell_about: string;
  widget_enable: boolean;
  widget_url: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  smart_tailing: boolean;
  date_created: string;
  date_updated: string;
}

export function updatePartnerUserProfile(
  id: string,
  body: FormData,
): PromiseWithCancel<UpdatePartnerUserProfileResponse> {
  return authorizedRequest.put<UpdatePartnerUserProfileResponse>(`auth/api/v1/partner-staff/${id}`, body);
}

export interface PartnerUserProfileResponse {
  _id: string;
  name: string;
  first_name: string;
  last_name: string;
  name_search: string;
  avatar: string;
  email: string;
  paypal_email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  binding_address: AddressResponse;
  shipping_address: AddressResponse;
  status: {
    is_active: boolean;
    is_deleted: boolean;
    is_lock: boolean;
  };
  date_created: string;
  date_updated: string;
}

export function getPartnerUserProfile(id: string): PromiseWithCancel<PartnerUserProfileResponse> {
  return authorizedRequest.get<PartnerUserProfileResponse>(`auth/api/v1/account/${id}`);
}

export interface GetPartnerUserListParams {
  id: string;
  page: number;
  pageSize: number;
  searchKey: string;
  sort: string;
}

export interface PartnerUserItem {
  _id: string;
  account: string;
  storefront?: string;
  partner?: string;
  display_name: string;
  email: string;
  role: PartnerRole;
  date_created: string;
  date_updated: string;
}

export type GetPartnerUserListResponse = DataList<PartnerUserItem>;

export function getPartnerUserList(params: GetPartnerUserListParams): PromiseWithCancel<GetPartnerUserListResponse> {
  return authorizedRequest.get<GetPartnerUserListResponse>(`auth/api/v1/online-store/user-list/${params.id}`, {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search_key: params.searchKey,
      sort: params.sort,
    },
  });
}

export interface PartnerUserDetail {
  _id: string;
  name: string;
  first_name: string;
  last_name: string;
  name_search: string;
  avatar: string;
  email: string;
  paypal_email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  binding_address: AddressResponse;
  shipping_address: AddressResponse;
  status: {
    is_active: boolean;
    is_deleted: boolean;
    is_lock: boolean;
  };
  user: PartnerUserItem;
  date_created: string;
  date_updated: string;
}

export function getPartnerUserDetail(id: string): PromiseWithCancel<PartnerUserDetail> {
  return authorizedRequest.get<PartnerUserDetail>(`auth/api/v1/partner-staff/${id}`);
}

export interface AddPartnerUserBody {
  email: string;
  firstName: string;
  lastName: string;
  role: PartnerRole;
  storefront: string;
}

export function addPartnerUser(body: AddPartnerUserPayload): PromiseWithCancel<void> {
  return authorizedRequest.post<void>(`auth/api/v1/partner-staff/create`, body);
}

export interface UpdatePartnerUserResponse {
  _id: string;
  user: string;
  storefront: string;
  first_name: string;
  last_name: string;
  name_search: string;
  avatar: string;
  email: string;
  shipping_address: AddressResponse;
  date_created: string;
  date_updated: string;
}

export interface UpdatePartnerUserBody {
  first_name: string;
  last_name: string;
  role: string;
  partner: string;
}

export function updatePartnerUser(id: string, body: AddPartnerUserPayload): PromiseWithCancel<void> {
  return authorizedRequest.put<void>(`auth/api/v1/partner-staff/${id}`, body);
}

export function deletePartnerUser(id: string): PromiseWithCancel<PartnerUserItem> {
  return authorizedRequest.delete<PartnerUserItem>(`auth/api/v1/partner-staff/${id}`);
}

export interface NewesteNotificationPayload {
  is_partner_list: boolean;
  partner_id: string;
  sort: string;
}

export function getNewesteNotificationRequest(params: NewesteNotificationPayload): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`notify/api/v1/channel/list-common`, { params });
}

export interface ActionNewesteNotificationPayload {
  body: { partner: string; is_read: boolean; is_dismiss: boolean };
  id: string;
  partner_id?: string;
}

export function getActionNewesteNotificationRequest(params: ActionNewesteNotificationPayload): PromiseWithCancel<void> {
  return authorizedRequest.patch<void>(`notify/api/v1/channel/${params.id}/action`, params.body);
}
