export interface AddressMailing {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Status {
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

export interface AdminManager {
  phones: any[];
  _id: string;
  email: string;
  name: string;
  phone: string;
}

export interface GetPartnerLocationDetailResponse {
  address_mailing: AddressMailing;
  status: Status;
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
  score_card?: any;
  is_validate_address: boolean;
  _id: string;
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  lat: string;
  lng: string;
  phone: string;
  website: string;
  tell_about: string;
  lead_email: string;
  location: number[];
  admin_manager: AdminManager;
  number_identity: number;
  date_created: Date;
  date_updated: Date;
  salesforce_id: string;
  storefront: string;
  api_key: string;
  avatar: string;
  partner_parent?: {
    address: string;
    avatar: string;
    brands_carried: Array<string>;
    city: string;
    instant_payout_limit: InstantPayoutLimit;
    is_instant_payout: boolean;
    lat: string;
    lng: string;
    location: number[];
    mailing_address: boolean;
    name: string;
    phone: string;
    smart_tailing: boolean;
    state: string;
    tell_about: string;
    website: string;
    widget_enable: boolean;
    widget_url: string;
    zip_code: string;
    _id: string;
  };
  operation_redbarn?: boolean;
}
