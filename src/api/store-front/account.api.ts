/* eslint-disable import/no-cycle */
import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import { DataList } from 'model/common';
import { StorefrontRole } from 'constants/roles';
import {
  AddComplainOrderSendResponsePayload,
  GetDetailCasesPayload,
  GetListAssignPayload,
  GetStorefrontListCasesPayload,
  UpdateDetailCasesPayload,
} from 'store/store-front/account/account.action';
import trim from 'lodash/trim';
import { FormCreateOnlineStoreModel } from 'model/store/store-front/account.model';

export interface AddressResponse {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface Files {
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: number | string;
  webkitRelativePath?: string;
  // src?: string;
}

export interface StorefrontDetailResponse {
  _id: string;
  name: string;
  logo: string;
  gallery: string;
  email: string;
  website_url: string;
  contact_name: string;
  reseller_number: string;
  pdf_upload: string | Files;
  paypal_email: string;
  phone: string;
  description?: string;
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

export function getStorefrontDetail(id: string): PromiseWithCancel<StorefrontDetailResponse> {
  return authorizedRequest.get<StorefrontDetailResponse>(`auth/api/v1/storefront/${id}`);
}

export function getStorefrontListCasesAccount(
  params: GetStorefrontListCasesPayload,
): PromiseWithCancel<StorefrontListCasesAccountResponse> {
  return authorizedRequest.get<StorefrontListCasesAccountResponse>(`billing/api/v1/complain-order-list`, {
    params,
  });
}

export function getStorefrontListAssignCases(
  params: GetListAssignPayload,
): PromiseWithCancel<StorefrontListCasesAccountResponse> {
  return authorizedRequest.get<StorefrontListCasesAccountResponse>(
    `auth/api/v1/online-store/user-list/${params?.storeFrontId}`,
    {
      params: {
        page_size: params?.page_size,
      },
    },
  );
}

export function getStorefrontDetailCases(
  params: GetDetailCasesPayload,
): PromiseWithCancel<StorefrontDetailCasesResponse> {
  return authorizedRequest.get<StorefrontDetailCasesResponse>(`billing/api/v1/complain-order/${params?.id}`);
}

export function updateStatusStorefrontDetailCases(params: UpdateDetailCasesPayload) {
  return authorizedRequest.put<null>(`billing/api/v1/complain-order/${params?.id}/update-status`, {
    status: params?.status,
  });
}

export function updateAssigneeStorefrontDetailCases(params: UpdateDetailCasesPayload) {
  return authorizedRequest.put<null>(`billing/api/v1/complain-order/${params?.id}/update-assignee`, {
    assignee: params?.assign,
  });
}

export function addStorefrontComplainOrderSendResponse(params: AddComplainOrderSendResponsePayload) {
  const { case_id, content, note, status, upload, carrier, tracking_number, amount_refund } = params;
  const formData = new FormData();
  formData.append('case_id', case_id);
  formData.append('content', content);
  formData.append('note', note);
  formData.append('status', status);
  formData.append('upload', upload);
  if (carrier) {
    formData.append('carrier', carrier);
  }
  if (tracking_number) {
    formData.append('tracking_number', tracking_number);
  }
  if (amount_refund) {
    formData.append('amount_refund', amount_refund);
  }
  return authorizedRequest.post<null>(`billing/api/v1/complain-order-send-response`, formData);
}

export interface StorefrontUserProfileResponse {
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

export function getStorefrontUserProfile(id: string): PromiseWithCancel<StorefrontUserProfileResponse> {
  return authorizedRequest.get<StorefrontUserProfileResponse>(`auth/api/v1/account/${id}`);
}

export function updateStorefrontDetail(id: string, body: FormData): PromiseWithCancel<StorefrontDetailResponse> {
  return authorizedRequest.put<StorefrontDetailResponse>(`auth/api/v1/storefront/${id}`, body);
}

export function updateStorefrontUserProfile(
  id: string,
  body: FormData,
): PromiseWithCancel<StorefrontUserProfileResponse> {
  return authorizedRequest.put<StorefrontUserProfileResponse>(`auth/api/v1/account/${id}`, body);
}

export interface GetStorefrontUserListParams {
  id: string;
  page: number;
  pageSize: number;
  searchKey: string;
  sort: string;
}

export interface Storefront {
  binding_address: BindingAddress;
  status_register: string;
  is_validate_address: boolean;
  is_bbb_store: boolean;
  is_bbb_store_created: boolean;
  _id: string;
  email: string;
  name: string;
  phone: string;
  date_created: Date;
  date_updated: Date;
  stripe_account: string;
  paypal_email: string;
  contact_name: string;
  reseller_number: string;
  website_url: string;
  logo?: string;
}

export interface BindingAddress {
  country: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface StorefrontUserItem {
  _id: string;
  account: string;
  storefront: Storefront;
  partner?: string;
  display_name: string;
  email: string;
  role: StorefrontRole;
  date_created: string;
  date_updated: string;
}

export type GetStorefrontUserListResponse = DataList<StorefrontUserItem>;

export function getStorefrontUserList(
  params: GetStorefrontUserListParams,
): PromiseWithCancel<GetStorefrontUserListResponse> {
  return authorizedRequest.get<GetStorefrontUserListResponse>(`auth/api/v1/online-store/user-list/${params.id}`, {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search_key: params.searchKey,
      sort: params.sort,
    },
  });
}

export interface StorefrontUserDetail {
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
  user: StorefrontUserItem;
  date_created: string;
  date_updated: string;
  partner: Partner;
}

export interface Partner {
  _id: string;
  name: string;
  address: string;
  phone: string;
  smart_tailing: boolean;
  mailing_address: boolean;
  website: string;
  tell_about: string;
  lat: string;
  lng: string;
}

export function getStorefrontUserDetail(id: string): PromiseWithCancel<StorefrontUserDetail> {
  return authorizedRequest.get<StorefrontUserDetail>(`auth/api/v1/partner-staff/${id}`);
}

export interface AddStorefrontUserBody {
  email: string;
  firstName: string;
  lastName: string;
  role: StorefrontRole;
  storefront: string;
}

export function addStorefrontUser(body: AddStorefrontUserBody): PromiseWithCancel<StorefrontUserItem> {
  return authorizedRequest.post<StorefrontUserItem>(`auth/api/v1/online-store/user-create`, {
    email: body.email,
    first_name: body.firstName,
    last_name: body.lastName,
    role: body.role,
    storefront: body.storefront,
  });
}

export interface UpdateStorefrontUserResponse {
  _id: string;
  user: string;
  storefront: Storefront;
  first_name: string;
  last_name: string;
  name_search: string;
  avatar: string;
  email: string;
  shipping_address: AddressResponse;
  date_created: string;
  date_updated: string;
}

export interface UpdateStorefrontUserBody {
  firstName: string;
  lastName: string;
  email?: string;
  role?: StorefrontRole;
}

export function updateStorefrontUser(
  id: string,
  body: UpdateStorefrontUserBody,
): PromiseWithCancel<StorefrontUserItem> {
  let payload: { first_name: string; last_name: string; email?: string; role: StorefrontRole } = {
    first_name: body.firstName,
    last_name: body.lastName,
    role: body.role,
  };
  if (body.email) {
    payload = { ...payload, email: body.email };
  }
  return authorizedRequest.put<StorefrontUserItem>(`auth/api/v1/online-store/user/${id}`, payload);
}

export function deleteStorefrontUser(id: string): PromiseWithCancel<StorefrontUserItem> {
  return authorizedRequest.delete<StorefrontUserItem>(`auth/api/v1/online-store/user/${id}`);
}

export interface SendRepons {
  _id: string;
  case: string;
  content: string;
  sender_id: string;
  sender_email: string;
  carrier: string;
  tracking_number: string;
  note: string;
  upload: string;
  storefront_id: string;
  date_created: Date;
  date_updated: Date;
}

export interface StorefrontItemCases {
  reason_case: {
    reason: string;
    description: string;
  };
  assignee_storefront: {
    id: string;
    email: string;
    name: string;
  };
  status: string;
  is_read: boolean;
  is_archive: boolean;
  _id: string;
  name: string;
  buyer_id: string;
  seller_id: string;
  storefront: string;
  buyer_email: string;
  buyer_name: string;
  order: string;
  order_code: string;
  date_created: Date;
  date_updated: Date;
  send_reponses: SendRepons[];
}

export interface StorefrontListCasesAccountResponse {
  data: StorefrontItemCases[];
  page: number;
  page_size: number;
  total_item: number;
  total_page: number;
}

export interface Restrict {
  last_ip: string;
  is_block: boolean;
}

export interface MailConfig {
  status: string;
  mail_key?: object[];
}

export interface PushConfig {
  status: string;
  push_key: any[];
}

export interface SmsConfig {
  status: string;
  sms_key: any[];
}

export interface Setting {
  mail_config: MailConfig;
  push_config: PushConfig;
  sms_config: SmsConfig;
}

export interface StorefrontListAssignCasesItem {
  restrict: Restrict;
  setting: Setting;
  provider: string;
  is_setting: boolean;
  receive_message: any[];
  blocked: boolean;
  stripe_accounts: any[];
  is_validate_address: boolean;
  storefronts: any[];
  _id: string;
  email: string;
  role: string;
  partner: string;
  display_name: string;
  last_login: Date;
  date_created: Date;
  date_updated: Date;
  account: string;
  salesforce_id: string;
  salt: string;
  storefront: string;
}

export interface StorefrontListAssignCasesResponse {
  data: StorefrontListAssignCasesItem[];
  total_item: number;
  page: number;
  page_size: number;
  total_page: number;
}

export interface ReasonDetailCase {
  description: string;
  reason: string;
}
export interface StorefrontDetailCasesResponse {
  reason_case: ReasonDetailCase;
  status: string;
  is_read: boolean;
  is_archive: boolean;
  _id: string;
  name: string;
  buyer_id: string;
  seller_id: string;
  storefront: string;
  buyer_email: string;
  buyer_name: string;
  order: string;
  order_code: string;
  date_created: Date;
  date_updated: Date;
  send_reponses: any[];
  assignee_storefront?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface StorefrontAddComplainOrderSendResponse {
  _id: string;
  case: string;
  content: string;
  sender_id: string;
  sender_email: string;
  note: string;
  upload: string;
  storefront_id: string;
  date_created: Date;
  date_updated: Date;
}

export interface StorefrontOrPersonalByListIdsResponse {
  _id: string;
  name: string;
  logo?: string;
}

export function storefrontAddOnlineStore(payload: FormCreateOnlineStoreModel): PromiseWithCancel<void> {
  const fromData = new FormData();
  fromData.append('name', trim(payload.name));
  fromData.append('email', trim(payload.email));
  fromData.append('phone', trim(payload.phone));
  fromData.append('paypal_email', '');
  fromData.append('partner', payload.partner);
  fromData.append('website_url', trim(payload.website_url));
  fromData.append('reseller_number', trim(payload.reseller_number));
  fromData.append('contact_name', trim(payload.contact_name));
  // File
  fromData.append('logo', payload.logo);
  fromData.append('gallery', payload.gallery);
  fromData.append('pdf_upload', payload.pdf_upload);
  // Shop Address
  fromData.append('binding_address.address', trim(payload.address_shop));
  fromData.append('binding_address.city', trim(payload.city_shop));
  fromData.append('binding_address.state', trim(payload.state_shop));
  fromData.append('binding_address.zip_code', trim(payload.zip_code_shop));
  // Ship Address
  fromData.append('shipping_address.address', trim(payload.address_ship));
  fromData.append('shipping_address.city', trim(payload.city_ship));
  fromData.append('shipping_address.state', trim(payload.state_ship));
  fromData.append('shipping_address.zip_code', trim(payload.zip_code_ship));
  return authorizedRequest.post<void>(`auth/api/v1/storefront/create`, fromData);
}
