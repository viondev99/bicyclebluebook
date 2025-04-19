import { createActions } from 'redux-actions';
import { GetUserInfo, PersonalInfo } from '../../../../model/store/account/personal/profile.model';
import {
  PersonalAccountModel,
  DeleteAccountModal,
  DeleteAccountResponse,
  DeactivateAccountModal,
  DeactivateAccountResponse,
  ChangePasswordReq,
  ChangePassWordResponse,
} from '../../../../model/api/account/personal/profile.model';

export type ProfileResponse = PersonalInfo;
export type GetProfileFailed = string;
export type ChangePasswordSuccess = ChangePassWordResponse;
export type DeletePersonalAccountSuccess = DeleteAccountResponse;
export type DeactivatePersonalAccountSuccess = DeactivateAccountResponse;
export interface UpdateProfileFailed {
  error: string;
  from: string;
}

export type ProfilePayload =
  | GetUserInfo
  | ProfileResponse
  | GetProfileFailed
  | PersonalAccountModel
  | ChangePasswordSuccess
  | ChangePasswordReq
  | DeletePersonalAccountSuccess
  | DeleteAccountModal
  | DeactivatePersonalAccountSuccess
  | DeactivateAccountModal
  | UpdateProfileFailed;

export const {
  getProfileForPersonal,
  getProfileForPersonalSucceeded,
  getProfileForPersonalFailed,
  updatePersonalProfile,
  updatePersonalProfileSucceeded,
  updatePersonalProfileFailed,
  changePasswordPersonalProfile,
  changePasswordPersonalProfileSucceeded,
  changePasswordPersonalProfileFailed,
  deleteAccountPersonal,
  deleteAccountPersonalSucceeded,
  deleteAccountPersonalFailed,
  deactivateAccountPersonal,
  deactivateAccountPersonalSucceeded,
  deactivateAccountPersonalFailed,
} = createActions<ProfilePayload>(
  {
    GET_PROFILE_FOR_PERSONAL: (payload: GetUserInfo) => payload,
    GET_PROFILE_FOR_PERSONAL_SUCCEEDED: (payload: ProfileResponse) => payload,
    GET_PROFILE_FOR_PERSONAL_FAILED: (payload: GetProfileFailed) => payload,
    UPDATE_PERSONAL_PROFILE: (payload: PersonalAccountModel) => payload,
    UPDATE_PERSONAL_PROFILE_SUCCEEDED: (payload: ProfileResponse) => payload,
    UPDATE_PERSONAL_PROFILE_FAILED: (payload: UpdateProfileFailed) => payload,
    CHANGE_PASSWORD_PERSONAL_PROFILE: (payload: ChangePasswordReq) => payload,
    CHANGE_PASSWORD_PERSONAL_PROFILE_SUCCEEDED: (payload: ChangePasswordSuccess) => payload,
    CHANGE_PASSWORD_PERSONAL_PROFILE_FAILED: null,
    DELETE_ACCOUNT_PERSONAL: (payload: DeleteAccountModal) => payload,
    DELETE_ACCOUNT_PERSONAL_SUCCEEDED: (payload: DeleteAccountResponse) => payload,
    DELETE_ACCOUNT_PERSONAL_FAILED: null,
    DEACTIVATE_ACCOUNT_PERSONAL: (payload: DeactivateAccountModal) => payload,
    DEACTIVATE_ACCOUNT_PERSONAL_SUCCEEDED: (payload: DeactivatePersonalAccountSuccess) => payload,
    DEACTIVATE_ACCOUNT_PERSONAL_FAILED: null,
  },
  {
    prefix: 'profilePersonal',
  },
);
