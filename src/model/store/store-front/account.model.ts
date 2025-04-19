import { StorefrontRole } from 'constants/roles';
import { Storefront, StorefrontUserDetail } from 'api/store-front/account.api';

export interface AddressDetailModel {
  address: string;
  city: string;
  state: string;
  zipCode: string;
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

export interface StorefrontDetailModel {
  id: string;
  name: string;
  logo: string;
  gallery: string;
  email: string;
  paypalEmail: string;
  phone: string;
  dateCreated: string;
  dateUpdated: string;
  description?: string;
  website_url: string;
  contact_name: string;
  reseller_number: string;
  pdf_upload: string | Files;
  bindingAddress: AddressDetailModel;
  shippingAddress: AddressDetailModel;
}

export interface StorefrontUserProfileModel {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
}

export interface StorefrontUserModel {
  id: string;
  account: string;
  storefront: Storefront;
  name: string;
  email: string;
  role: StorefrontRole;
  dateCreated: string;
  dateUpdated: string;
}

export interface StorefrontAccountStoreModel {
  detail?: StorefrontDetailModel;
  userProfile?: StorefrontUserProfileModel;
  users: StorefrontUserModel[];
  loading: boolean;
  loadingAction: boolean;
  successAction: boolean;
  dataCases: StorefrontListCasesAccountModel;
  dataAssign: StorefrontListAssignCasesModel;
  dataDetailCases: StorefrontDetailCasesModel;
  filterListCases: GetStorefrontListCasesModel;
  listInfoStorefrontAndPersonal: StorefrontInfoStorefrontOrPersonalByListIdsModel[];
  storefrontUserDetail?: StorefrontUserDetail;
  isSuccessAfterCreateOnlineStore: boolean;
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
export interface StorefrontListCasesAccountModel {
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
  mail_key: object[];
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
export interface StorefrontListAssignCasesModel {
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
export interface StorefrontDetailCasesModel {
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

export interface StorefrontAddComplainOrderSendResponseModel {
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

export interface GetStorefrontListCasesModel {
  page: number;
  page_size: number;
  is_seller: boolean;
  sort: number;
  status: string;
}

export interface StorefrontInfoStorefrontOrPersonalByListIdsModel {
  _id: string;
  name: string;
  logo?: string;
}

export interface FormCreateOnlineStoreModel {
  name: string;
  email: string;
  phone: string;
  address_ship: string;
  partner: string;
  zip_code_ship: string;
  city_ship: string;
  state_ship: string;
  address_shop: string;
  zip_code_shop: string;
  city_shop: string;
  state_shop: string;
  is_shipping_same_shop: string;
  contact_name: string;
  website_url: string;
  country_shop: string;
  country_ship: string;
  reseller_number: string;
  description: string;
  pdf_upload: File;
  gallery: File;
  logo: File;
}
