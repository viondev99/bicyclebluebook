import { objectToFormData } from 'helpers/objectToFormdata.helper';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import unauthorizedRequest from 'helpers/request/unauthorizedRequest';
import {
  LoginResponse,
  RegisterPersonalResponse,
  RegisterOnlineStoreResponse,
  LoginFacebookResponse,
  LoginGoogleResponse,
} from 'model/api/authenticate.model';
import {
  GenerateTokenOnlineStoreParams,
  RegisterOnlineStoreModel,
  RegisterPersonalModel,
} from 'model/store/authenticate.model';

export function callLogin(email: string, password: string): PromiseWithCancel<LoginResponse> {
  const form = {
    email,
    password,
    token: '',
    os_type: 'web',
  };

  return unauthorizedRequest.post<LoginResponse>('/auth/api/v1/user/authenticate', form);
}

export function fetchTokenStoreFont(payload: GenerateTokenOnlineStoreParams): PromiseWithCancel<void> {
  return authorizedRequest.post<void>('/auth/api/v1/user/generate-token', payload);
}

export function impersonateUser(token: string): PromiseWithCancel<LoginResponse> {
  return unauthorizedRequest.post(`/auth/api/v1/user/login-as`, { token });
}

export function registerPersonal(data: RegisterPersonalModel): PromiseWithCancel<RegisterPersonalResponse> {
  const form = {
    ...data,
    os_type: 'web',
  };

  return unauthorizedRequest.post<RegisterPersonalResponse>('auth/api/v1/personal/register', form);
}

export function registerPersonalByGoogle(data: RegisterPersonalModel): PromiseWithCancel<RegisterPersonalResponse> {
  const form = {
    ...data,
    os_type: 'web',
  };

  return unauthorizedRequest.post<RegisterPersonalResponse>('auth/api/v1/personal/google-register', form);
}

export function registerPersonalByFacebook(data: RegisterPersonalModel): PromiseWithCancel<RegisterPersonalResponse> {
  const form = {
    ...data,
    os_type: 'web',
  };

  return unauthorizedRequest.post<RegisterPersonalResponse>('auth/api/v1/personal/facebook-register', form);
}

export function registerPersonalByTwitter(data: RegisterPersonalModel): PromiseWithCancel<RegisterPersonalResponse> {
  const form = {
    ...data,
    os_type: 'web',
  };

  return unauthorizedRequest.post<RegisterPersonalResponse>('auth/api/v1/personal/twitter-register', form);
}

export function loginByFacebook(token: string) {
  const form = {
    facebook_token: token,
    os_type: 'web',
  };
  return unauthorizedRequest.post<LoginFacebookResponse>('auth/api/v1/personal/facebook-auth', form);
}

export function loginByGoogle(token: string) {
  const form = {
    google_token: token,
    os_type: 'web',
  };
  return unauthorizedRequest.post<LoginGoogleResponse>('auth/api/v1/personal/google-auth', form);
}

export function registerOnlineStore(data: RegisterOnlineStoreModel) {
  const formData = objectToFormData(data, { indices: true });
  return unauthorizedRequest.post<RegisterOnlineStoreResponse>('/auth/api/v1/partner-register/register', formData);
}

export function registerOnlinePartnerStore(data: any) {
  // TODO FIX typing @quan
  return unauthorizedRequest.post<RegisterOnlineStoreResponse>('/auth/api/v1/partner-register/register', data);
}

export function sendLinkResetPassword(email: string) {
  return unauthorizedRequest.post<boolean>('/auth/api/v1/user/request-forgot', { email });
}

interface VerifyLinkResetPasswordResponse {
  data: {
    email: string;
    timeStamp: string;
  };
  message: string;
}

export function verifyLinkResetPassword(ids: string) {
  return unauthorizedRequest.post<VerifyLinkResetPasswordResponse>('/auth/api/v1/user/verify-link', { ids });
}

interface ResetPasswordBody {
  ids: string;
  email: string;
  new_password: string;
}

export function resetPassword(payload: ResetPasswordBody) {
  return unauthorizedRequest.post<boolean>(`/auth/api/v1/user/reset-password`, payload);
}

export function reactivateAccount(payload: string) {
  return unauthorizedRequest.post<boolean>(`/auth/api/v1/user/request-reactivate-account`, {
    email: payload,
  });
}

export function verifyLinkReactivateAccount(ids: string) {
  return unauthorizedRequest.post<VerifyLinkResetPasswordResponse>('/auth/api/v1/user/verify-link-reactivate', { ids });
}

export function resetPasswordToReactivateAccount(payload: ResetPasswordBody) {
  return unauthorizedRequest.post<boolean>(`/auth/api/v1/user/reactivate`, payload);
}

export function verifyLinkSetNewPassword(ids: string) {
  return unauthorizedRequest.post<VerifyLinkResetPasswordResponse>('/auth/api/v1/user/verify-link-new-password', {
    ids,
  });
}

export function setNewPassword(payload: ResetPasswordBody) {
  return unauthorizedRequest.post<boolean>(`/auth/api/v1/user/set-new-password`, payload);
}
