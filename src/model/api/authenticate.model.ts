import { Roles } from 'constants/roles';

export interface Storefont {
  _id: string;
  name: string;
  status?: {
    is_active: boolean;
    is_deleted: boolean;
  };
}
export interface LoginResponse {
  account: string;
  blocked: boolean;
  restrict: {
    last_ip: string;
    is_block: boolean;
  };
  setting: {
    mail_config: {
      status: string;
      mail_key: string[];
    };
    push_config: {
      status: string;
      push_key: string[];
    };
    sms_config: {
      status: string;
      sms_key: string[];
    };
  };
  provider: string;
  salesforce_id: string;
  is_setting: boolean;
  is_validate_address: boolean;
  receive_message: string[];
  _id: string;
  email: string;
  role: Roles;
  display_name: string;
  last_login: string;
  date_created: string;
  date_updated: string;
  last_login_id: string;
  is_bbb_rack: boolean;
  gravatar: string;
  token: string;
  partner_token: string;
  storefront?: string;
  partner?: string;
  user_name?: string;
  stripe_account?: string;
  is_bbb_seller?: boolean;
  session_id?: string;
  storefront_name?: string;
}
export interface ListStorefronts {
  storefronts: Storefont[];
}
export interface ListStripeAccounts {
  stripe_accounts: string[];
}

export interface RegisterPersonalResponse {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  country: string;
  zip_code: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  is_setting: string;
  token_captcha: string;
  description: string;
  session_id?: string;
}

export interface RegisterOnlineStoreResponse {
  first_name: string;
  last_name: string;
  email: string;
  reason_decline: string;
  shop: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    smart_tailing: boolean;
    mailing_address: boolean;
    brands_carried: string[];
    website: string;
    tell_about: string;
    avatar: string;
    api_key: string;
    lat: string;
    lng: string;
  };
  status: string;
}

export interface LoginFacebookResponse {
  facebook_token: string;
}

export interface LoginGoogleResponse {
  google_token: string;
}

export interface TwitterInfoResponse {
  contributors_enabled: boolean;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  email: string;
  entities: any;
  favourites_count: number;
  follow_request_sent: boolean;
  followers_count: number;
  following: boolean;
  friends_count: number;
  geo_enabled: boolean;
  has_extended_profile: boolean;
  id: number;
  id_str: string;
  is_translation_enabled: boolean;
  is_translator: boolean;
  lang: string;
  listed_count: number;
  location: string;
  name: string;
  needs_phone_verification: boolean;
  notifications: boolean;
  profile_background_color: string;
  profile_background_image_url: string;
  profile_background_image_url_https: string;
  profile_background_tile: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  profile_text_color: string;
  profile_use_background_image: boolean;
  protected: boolean;
  screen_name: string;
  statuses_count: number;
  suspended: boolean;
  time_zone: string;
  translator_type: string;
  twitter_token: string;
  twitter_token_secret: string;
  url: string;
  utc_offset: string;
  verified: boolean;
}

export interface JwtDecodedToken {
  _id: string;
  role: string;
  roles: any[];
  email: string;
  display_name: string;
  name: string;
  partner: string;
  storefront: string;
  storefronts: any[];
  is_bbb_seller: boolean;
  account: string;
  user_name: string;

  partner_id: string;
  partner_v1_id: string;
  is_bbb_rack: boolean;
  status_register_storefront: string;
  iat: number;
  exp: number;
}
