export interface GetUserInfo {
  id: string;
}
export interface PersonalInfo {
  page_setup?: {
    about: string;
  };
  shipping_address?: { country: string };
  binding_address?: { country: string };
  avatar?: string;
  token_email?: string;
  role_base?: any;
  _id: string;
  user?: {
    restrict?: {
      last_ip: string;
      is_block: boolean;
    };
    _id: string;
    email: string;
    display_name: string;
    user_name: string;
    gravatar: string;
    description?: string;
    blocked: boolean;
  };
  first_name: string;
  last_name: string;
  description?: string;
  country: string;
  zip_code: string;
  address: string;
  city: string;
  date_created: string;
  date_updated: string;
  state: string;
  phone: string;
  email: string;
  apartment?: string;
}

export interface ProfilePersonalStoreModal {
  readonly personalAccountInfo: PersonalInfo;
  readonly loadingProfile: boolean;
  readonly error: string;
  readonly updateFrom: string;
  readonly isChangePassword: boolean;
}
