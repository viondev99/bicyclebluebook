export interface PersonalAccountModel {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: File;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  paypal_email?: string;
  update_from?: string;
}
export interface ChangePasswordReq {
  values: ChangePassWordModal;
  onSuccess: (payload: boolean) => void;
}

export interface ChangePassWordModal {
  old_password: string;
  new_password: string;
  retry_password: string;
}

export interface ChangePassWordResponse {
  message: string;
}

export interface DeleteAccountModal {
  id: string;
  reason: string;
}
export interface DeleteAccountResponse {
  message: string;
}
export interface DeactivateAccountModal {
  state: string;
  user: string;
}
export interface DeactivateAccountResponse {
  message: string;
}
