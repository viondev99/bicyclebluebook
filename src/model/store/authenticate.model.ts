import { TwitterInfoResponse } from 'model/api/authenticate.model';
import { Roles, StorefrontRole } from '../../constants/roles';

export interface UserModel {
  email: string;
  _id: string;
  is_setting: boolean;
  receive_message: any[];
  role: Roles | StorefrontRole;
  display_name: string;
  is_bbb_rack: string;
  gravatar: string;
  setting: {
    [key: string]: {
      status: string;
      mail_key?: object[];
    };
  };
  storefront?: string;
  partner?: string;
  account?: string;
  partner_token?: string;
  token: string;
  status_register_storefront?: boolean;
  user_name?: string;
  num_logins?: number;
  is_bbb_seller?: boolean;
  storefront_name?: string;
}

export interface AuthenticateModel {
  readonly user: UserModel;
  readonly loggingIn: boolean;
  readonly redirect: boolean;
  readonly token: string;
  readonly twitterInfo: TwitterInfoResponse;
  stepTour?: string | number;
  loading?: boolean;
}

export interface LoginModel {
  email: string;
  password: string;
  roles?: Roles[];
}

export interface RegisterPersonalModel {
  email: string;
  user_name: string;
  password?: string;
  confirm_password?: string;
  first_name: string;
  last_name: string;
  country: string;
  zip_code: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  is_setting: boolean;
  token_captcha: string;
  os_type: 'web';
  description?: string;
  session_id?: string;
}

export interface RegisterPersonalByGoogleModel extends RegisterPersonalModel {
  google_token: string;
}

export interface RegisterPersonalByFacebookModel extends RegisterPersonalModel {
  facebook_token: string;
}

export interface RegisterPersonalByTwitterModel extends RegisterPersonalModel {
  twitter_token: string;
  twitter_token_secret: string;
}

export interface RegisterOnlineStoreModel {
  email: string;
  name: string;
  country: string;
  zip_code: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  is_setting: string;
  token_captcha: string;
  website_url: string;
  contact_name: string;
  reseller_number: string;
  description: string;
  pdf_upload?: any;
  verifyCaptcha: string;
  os_type: 'web';
}

export interface RegisterTradeInModel {
  online_store?: {
    name: string;
    email: string;
    zip_code: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    website_url: string;
    contact_name: string;
    reseller_number: string;
    description?: string;
    verifyCaptcha?: string;
  };
  shop: {
    website: string;
    tell_about: string;
    name: string;
    email: string;
    city: string;
    state: string;
    address: string;
    zip_code: string;
    phone: string;
    smart_tailing: string;
    mailing_address: string;
    brands_carried: { id: string; name: string }[];
    address_mailing: {
      city: string;
      state: string;
      address: string;
      zip_code: string;
    };
  };
  email: string;
  first_name: string;
  last_name: string;
  same_as_online: boolean;
  pdf_upload?: any;
  avatar?: any;
  token_captcha: string;
  isOnlinePartner?: boolean;
}

export interface GenerateTokenOnlineStoreParams {
  _id: string;
  role: string;
  email: string;
  display_name: string;
  storefront: string;
  account: string;
  name: string;
  status_register_storefront: boolean;
  currentWidthScreen?: number;
  nameMenu?: string;
}

export interface cleclearStoreFrontTokenPayload {
  currentWidthScreen?: number;
  nameMenu?: string;
}
