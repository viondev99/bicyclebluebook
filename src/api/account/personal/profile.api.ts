import {
  PersonalAccountModel,
  ChangePassWordModal,
  DeleteAccountModal,
  DeleteAccountResponse,
  DeactivateAccountModal,
  DeactivateAccountResponse,
} from 'model/api/account/personal/profile.model';
import { ProfileResponse, ChangePasswordSuccess } from 'store/account/personal/profile/profile.action';

import { PromiseWithCancel } from '../../../helpers/request/request';
import authorizedRequest from '../../../helpers/request/authorizedRequest';
import { objectToFormData } from '../../../helpers/common.helper';

export function getProfile(id: string): PromiseWithCancel<ProfileResponse> {
  return authorizedRequest.get<ProfileResponse>(`auth/api/v1/personal/${id}`);
}

export function getProfileWholeSaler(id: string): PromiseWithCancel<ProfileResponse> {
  return authorizedRequest.get<ProfileResponse>(`auth/api/v1/wholesaler/${id}`);
}

export function changePasswordPersonalProfile(data: ChangePassWordModal): PromiseWithCancel<ChangePasswordSuccess> {
  return authorizedRequest.patch<ChangePasswordSuccess>(`auth/api/v1/user/change-password`, data);
}

export function updatePersonalProfile(data: PersonalAccountModel): PromiseWithCancel<ProfileResponse> {
  const { id, ...other } = data;
  const form = objectToFormData(other);
  return authorizedRequest.put<ProfileResponse>(`auth/api/v1/personal/${id}`, form);
}

export function deleteAccount(data: DeleteAccountModal): PromiseWithCancel<DeleteAccountResponse> {
  const form: { reason: string } = {
    reason: data.reason,
  };
  return authorizedRequest.delete<DeleteAccountResponse>(`auth/api/v1/user/${data.id}`, { data: form });
}

export function deactivateAccount(data: DeactivateAccountModal): PromiseWithCancel<DeactivateAccountResponse> {
  const form: DeactivateAccountModal = {
    state: 'inactive',
    user: data.user,
  };
  return authorizedRequest.patch<DeactivateAccountResponse>(`auth/api/v1/user/change-status-active`, form);
}
