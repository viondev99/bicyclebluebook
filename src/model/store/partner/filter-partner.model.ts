export interface PageSetup {
  about: string;
}

export interface ShippingAddress {
  country: string;
}

export interface BindingAddress {
  country: string;
}

export interface Active {
  is_active: boolean;
}

export interface Status {
  active: Active;
  is_lock: boolean;
}

export interface Restrict {
  last_ip: string;
  is_block: boolean;
}

export interface BindingAddress2 {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface ShippingAddress2 {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface RefPartner {
  has_partner: boolean;
  is_accepted: boolean;
}

export interface Status2 {
  is_active: boolean;
  is_lock: boolean;
  is_deleted: boolean;
}

export interface Storefront {
  binding_address: BindingAddress2;
  shipping_address: ShippingAddress2;
  ref_partner: RefPartner;
  status: Status2;
  status_register: string;
  is_validate_address: boolean;
  is_bbb_store: boolean;
  is_bbb_store_created: boolean;
  _id: string;
  email: string;
  name: string;
  date_created: Date;
  date_updated: Date;
  paypal_email: string;
  phone: string;
  logo: string;
  stripe_account: string;
  gallery: string;
  contact_name: string;
  pdf_upload: string;
  reseller_number: string;
  description: string;
}

export interface AddressMailing {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Status3 {
  is_active: boolean;
  is_lock: boolean;
  is_deleted: boolean;
}

export interface InstantPayoutLimit {
  daily_limit: number;
  weekly_limit: number;
  monthly_limit: number;
  time_limit: number;
  time_stamp_limit: number;
}

export interface BrandsCarried {
  id: string;
  name: string;
}

export interface Partner {
  address_mailing: AddressMailing;
  status: Status3;
  instant_payout_limit: InstantPayoutLimit;
  is_smart_tailing_primary: boolean;
  smart_tailing: boolean;
  mailing_address: boolean;
  brands_carried: BrandsCarried[];
  api_key_v1: any[];
  widget_enable: boolean;
  widget_url_dev: any[];
  is_trek_widget: boolean;
  is_send_mail_widget: boolean;
  count_widget_opens: number;
  is_enable_adjustment: boolean;
  is_active_by_created: boolean;
  drop_off_enabled: boolean;
  hide_components: boolean;
  is_trek: boolean;
  is_donation: boolean;
  is_show_donate: boolean;
  is_override_bbb: boolean;
  is_primary: boolean;
  is_bbb_rack: boolean;
  show_in_map: boolean;
  is_setting: boolean;
  is_instant_payout: boolean;
  partner_type: string;
  is_validate_address: boolean;
  _id: string;
  staffs: string[];
  partner_childs: any[];
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  lat: string;
  lng: string;
  website: string;
  tell_about: string;
  number_identity: number;
  date_created: Date;
  date_updated: Date;
  avatar: string;
  widget_url: string;
  location: number[];
  phone: string;
  salesforce_id: string;
  admin_manager: string;
  lead_email: string;
  account_number: string;
  email?: any;
  partner_parent: string;
  api_key: string;
}

export interface User {
  status: Status;
  restrict: Restrict;
  _id: string;
  email: string;
  role: string;
  display_name: string;
  storefront: Storefront;
  partner: Partner;
  user_name: string;
}

export interface FilterPartnerDetailResponse {
  page_setup: PageSetup;
  shipping_address: ShippingAddress;
  binding_address: BindingAddress;
  avatar: string;
  token_email: string;
  role_base: any[];
  _id: string;
  user: User;
  partner: string;
  first_name: string;
  last_name: string;
  date_created: Date;
  date_updated: Date;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
  name_search: string;
}
