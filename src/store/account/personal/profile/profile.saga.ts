import { call, put, takeLatest, select } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { ProfileResponse } from 'store/account/personal/profile/profile.action';
import router from 'next/router';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import * as profileAction from './profile.action';
import { getMessageFromError } from '../../../../helpers/common.helper';
import {
  getProfile,
  updatePersonalProfile,
  changePasswordPersonalProfile,
  deactivateAccount,
  deleteAccount,
} from '../../../../api/account/personal/profile.api';
import {
  ChangePassWordResponse,
  DeactivateAccountResponse,
  DeleteAccountResponse,
  PersonalAccountModel,
  ChangePasswordReq,
  DeleteAccountModal,
  DeactivateAccountModal,
} from '../../../../model/api/account/personal/profile.model';
import { GetUserInfo, PersonalInfo } from '../../../../model/store/account/personal/profile.model';
import StoreState from '../../../../model/store/index';

let idPersonal: string = '';

function* getProfileForPersonal(action: Action<GetUserInfo>) {
  try {
    idPersonal = action.payload.id;
    const response: ProfileResponse = yield call(getProfile, action.payload.id);
    yield put(profileAction.getProfileForPersonalSucceeded(response));
  } catch (e) {
    yield put(profileAction.getProfileForPersonalFailed(getMessageFromError(e)));
  }
}

function handleParamsUpdate(profileInfo: PersonalInfo, dataUpdate: PersonalAccountModel) {
  return {
    id: profileInfo?._id,
    first_name: profileInfo?.first_name,
    last_name: profileInfo?.last_name,
    email: profileInfo?.email,
    address: profileInfo?.address,
    city: profileInfo?.city,
    state: profileInfo?.state,
    zip_code: profileInfo?.zip_code,
    phone: profileInfo?.phone,
    ...dataUpdate,
  };
}

function* handleUpdatePersonalProfile(action: Action<PersonalAccountModel>) {
  try {
    const profileInfo = yield select((store: StoreState) => store.account.personal.profile.personalAccountInfo);
    const params = handleParamsUpdate(profileInfo, action.payload);
    const response: ProfileResponse = yield call(updatePersonalProfile, params);
    yield put(profileAction.updatePersonalProfileSucceeded(response));
    yield put(profileAction.getProfileForPersonal({ id: idPersonal }));
    toastSuccess('Update profile succeeded.');
  } catch (e) {
    toastError(e);
    yield put(
      profileAction.updatePersonalProfileFailed({ error: getMessageFromError(e), from: action.payload.update_from }),
    );
  }
}

function* handleChangePassword(action: Action<ChangePasswordReq>) {
  try {
    const response: ChangePassWordResponse = yield call(changePasswordPersonalProfile, action.payload.values);
    action.payload.onSuccess(true);
    yield put(profileAction.changePasswordPersonalProfileSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(profileAction.updatePersonalProfileFailed(getMessageFromError(e)));
  }
}

function* handleChangeDeleteAccountPersonal(action: Action<DeleteAccountModal>) {
  try {
    const response: DeleteAccountResponse = yield call(deleteAccount, action.payload);
    yield put(profileAction.deleteAccountPersonalSucceeded(response));
    router.replace('/logout');
  } catch (e) {
    toastError(e);
    yield put(profileAction.deleteAccountPersonalFailed(getMessageFromError(e)));
  }
}

function* handleChangeDeactivateAccountPersonal(action: Action<DeactivateAccountModal>) {
  try {
    const response: DeactivateAccountResponse = yield call(deactivateAccount, action.payload);
    yield put(profileAction.deactivateAccountPersonalSucceeded(response));
    router.replace('/logout');
  } catch (e) {
    toastError(e);
    yield put(profileAction.deleteAccountPersonalFailed(getMessageFromError(e)));
  }
}

export default function* profilePersonalSaga() {
  yield takeLatest(profileAction.getProfileForPersonal, getProfileForPersonal);
  yield takeLatest(profileAction.updatePersonalProfile, handleUpdatePersonalProfile);
  yield takeLatest(profileAction.changePasswordPersonalProfile, handleChangePassword);
  yield takeLatest(profileAction.deleteAccountPersonal, handleChangeDeleteAccountPersonal);
  yield takeLatest(profileAction.deactivateAccountPersonal, handleChangeDeactivateAccountPersonal);
}
