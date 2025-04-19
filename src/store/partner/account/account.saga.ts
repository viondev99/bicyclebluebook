/* eslint-disable no-param-reassign */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import {
  getPartnerDetail,
  getPartnerUserList,
  PartnerDetailResponse,
  GetPartnerUserListResponse,
  PartnerUserItem,
  UpdatePartnerUserResponse,
  addPartnerUser,
  updatePartnerUser,
  deletePartnerUser,
  getListBlockedUsersRequested,
  unblockUserRequest,
  checkListUsersBlockedRequest,
  getListPartnerUsersRequest,
  getListPartnerLocationRequest,
  filterPartnerDetailRequest,
  addPartnerLocationRequest,
  getPartnerLocationDetailRequest,
  updatePartnerLocationRequest,
  getTradeInScorecardReportsRequest,
  getNotificationSettingRequest,
  getListLeadGenRequest,
  getListTradeInBicycleRequest,
  getNewesteNotificationRequest,
  getActionNewesteNotificationRequest,
  NewesteNotificationPayload,
  ActionNewesteNotificationPayload,
} from 'api/partner/account.api';
import {
  AddPartnerLocationParams,
  DataActionNewesteNotificationResponse,
  GetListBlockedUsersModel,
  GetListLeadGenParams,
  GetListPartnerLocationParams,
  GetListPartnerLocationResponse,
  GetListPartnerUsersParams,
  GetListPartnerUsersResponse,
  GetTradeInScorecardReportsParams,
  NewesteNotificationResponse,
  PartnerDetailModel,
  PartnerUserModel,
  PartnerUserProfileModel,
} from 'model/store/partner/account.model';
import t from 'helpers/language';
import Router from 'next/router';
import { FilterPartnerDetailResponse } from 'model/store/partner/filter-partner.model';
import { GetPartnerLocationDetailResponse } from 'model/store/partner/get-partner-detail.model';
import {
  GetNotificationSettingResponse,
  GetTradeInScorecardReportsResponse,
} from 'model/store/partner/trade-in-scorecard-reports';
import { GetListLeadGenResponse } from 'model/store/partner/lead-gen.model';
import { GetListTradeInBicycleParams, GetListTradeInBicycleResponse } from 'model/store/partner/scorecard.model';
import { CheckBlockUserPayload } from 'api/message.api';
import * as accountActions from './account.action';

export const handleCheckListUsersBlockedRequest = async (body: CheckBlockUserPayload) => {
  try {
    const response: any = await checkListUsersBlockedRequest(body);
    if (response && response[0].blocked) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

function* getListBlockedUsersSaga(action: Action<accountActions.GetListBlockedUsersPayload>) {
  try {
    const response: GetListBlockedUsersModel = yield call(getListBlockedUsersRequested, action.payload);
    yield put(accountActions.getListBlockedUsersSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getListBlockedUsersFailed());
  }
}

function* getListPartnerUsersSaga(action: Action<GetListPartnerUsersParams>) {
  try {
    const response: GetListPartnerUsersResponse = yield call(getListPartnerUsersRequest, action.payload);
    yield put(accountActions.getListPartnerUsersSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getListPartnerUsersFailed());
  }
}

function* getListPartnerLocationSaga(action: Action<GetListPartnerLocationParams>) {
  try {
    const response: GetListPartnerLocationResponse = yield call(getListPartnerLocationRequest, action.payload);
    yield put(accountActions.getListPartnerLocationSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getListPartnerLocationFailed());
  }
}

function* addPartnerLocationSaga(action: Action<AddPartnerLocationParams>) {
  try {
    yield call(addPartnerLocationRequest, action.payload);
    toastSuccess('Create location successfully.');
    yield Router.push(`/trade-in-account/my-account/profile`);
  } catch (e) {
    toastError(e);
  }
}

function* editPartnerLocationSaga(action: Action<AddPartnerLocationParams>) {
  try {
    const id = action.payload.partner_parent;
    delete action.payload.partner_parent;

    yield call(updatePartnerLocationRequest, id, action.payload);
    toastSuccess('Update location successfully.');
    yield Router.push(`/trade-in-account/my-account/profile`);
  } catch (e) {
    toastError(e);
  }
}

function* getPartnerLocationDetailSaga(action: Action<string>) {
  try {
    const response: GetPartnerLocationDetailResponse = yield call(getPartnerLocationDetailRequest, action.payload);
    yield put(accountActions.getPartnerLocationDetailSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getPartnerLocationDetailFailed());
  }
}

function* getTradeInScorecardReportsSaga(action: Action<GetTradeInScorecardReportsParams>) {
  try {
    const response: GetTradeInScorecardReportsResponse = yield call(getTradeInScorecardReportsRequest, action.payload);
    if (!response.storeRank) {
      response.storeRank = [];
    }
    yield put(accountActions.getTradeInScorecardReportsSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getTradeInScorecardReportsFailed());
  }
}

function* getNotificationSettingSaga() {
  try {
    const response: GetNotificationSettingResponse = yield call(getNotificationSettingRequest);
    yield put(accountActions.getNotificationSettingSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getNotificationSettingFailed());
  }
}

function* getListLeadGenSaga(action: Action<GetListLeadGenParams>) {
  try {
    const response: GetListLeadGenResponse = yield call(getListLeadGenRequest, action.payload);
    yield put(accountActions.getListLeadGenSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getListLeadGenFailed());
  }
}

function* getListTradeInBicycleSaga(action: Action<GetListTradeInBicycleParams>) {
  try {
    const response: GetListTradeInBicycleResponse = yield call(getListTradeInBicycleRequest, action.payload);
    yield put(accountActions.getListTradeInBicycleSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getListTradeInBicycleFailed());
  }
}

function* filterPartnerDetailSaga(action: Action<string>) {
  try {
    const response: FilterPartnerDetailResponse = yield call(filterPartnerDetailRequest, action.payload);
    yield put(accountActions.filterPartnerDetailSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.filterPartnerDetailFailed());
  }
}

function* unblockUserSaga(action: Action<accountActions.UnblockUser>) {
  const { id, getData } = action.payload;
  try {
    const response: GetListBlockedUsersModel = yield call(unblockUserRequest, id);
    yield put(accountActions.getListBlockedUsersSucceeded(response));
    toastSuccess(`Unblock Successfully.`);

    if (getData) {
      yield call(getData);
    }
  } catch (e) {
    toastError(e);
  }
}

function* getPartnerDetailSaga(action: Action<string>) {
  try {
    const response: PartnerDetailResponse = yield call(getPartnerDetail, action.payload);
    const payload: PartnerDetailModel = {
      id: response?.user?.partner?._id || '',
      partnerParent: response?.user?.partner?.partner_parent,
      name: response?.user?.partner?.name || '',
      logo: response?.user?.partner?.avatar || '',
      phone: response?.user?.partner?.phone || '',
      mailingAddress: {
        address: response?.user?.partner?.address_mailing?.address || '',
        city: response?.user?.partner?.address_mailing?.city || '',
        state: response?.user?.partner?.address_mailing?.state || '',
        zipCode: response?.user?.partner?.address_mailing?.zip_code || '',
      },
      shopAddress: {
        address: response?.user?.partner?.address || '',
        city: response?.user?.partner?.city || '',
        state: response?.user?.partner?.state || '',
        zipCode: response?.user?.partner?.zip_code || '',
      },
      brands: response?.user?.partner?.brands_carried || [],
      description: response?.user?.partner?.tell_about,
      enableLeadGen: !!response?.user?.partner?.is_send_mail_widget,
      overrideBBB: !!response?.user?.partner?.is_override_bbb,
      leadGenEmail: response?.user?.partner?.lead_email,
      enableWidget: !!response?.user?.partner?.widget_enable,
      widgetUrl: response?.user?.partner?.widget_url || '',
      website: response?.user?.partner?.website || '',
      smartEtailing: !!response?.user?.partner?.smart_tailing,
      dateCreated: response?.user?.partner?.date_created || '',
      dateUpdated: response?.user?.partner?.date_updated || '',
      bikeDonation: response?.user?.partner?.is_donation,
    };
    yield put(accountActions.getPartnerDetailSucceeded(payload));
    const data: PartnerUserProfileModel = {
      id: response?._id || '',
      avatar: response.avatar || '',
      firstName: response?.first_name || '',
      lastName: response?.last_name || '',
      email: response?.email || '',
      role: response?.user?.role || '',
      location: response?.partner || '',
      dateCreated: response?.date_created || '',
      dateUpdated: response?.date_updated || '',
    };
    yield put(accountActions.getPartnerUserProfileSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getPartnerDetailFailed());
    yield put(accountActions.getPartnerUserProfileFailed());
  }
}

// function* getPartnerUserProfileSaga(action: Action<string>) {
//   try {
//     const response: PartnerUserProfileResponse = yield call(getPartnerUserProfile, action.payload);
//     const payload: PartnerUserProfileModel = {
//       id: response?._id || '',
//       firstName: response?.first_name || '',
//       lastName: response?.last_name || '',
//       avatar: response?.avatar || '',
//       email: response?.email || '',
//     };
//     yield put(accountActions.getPartnerUserProfileSucceeded(payload));
//   } catch (e) {
//     toastError(e);
//     yield put(accountActions.getPartnerUserProfileFailed());
//   }
// }

// function* getPartnerUserListSaga(action: Action<accountActions.GetPartnerUserListPayload>) {
//   try {
//     const response: GetPartnerUserListResponse = yield call(getPartnerUserList, action.payload);
//     const data: PartnerUserModel[] = response.data.map((item) => ({
//       id: item._id,
//       account: item.account,
//       storefront: item.storefront,
//       name: item.display_name,
//       email: item.email,
//       role: item.role,
//       dateCreated: item.date_created,
//       dateUpdated: item.date_updated,
//     }));
//     yield put(accountActions.getPartnerUserListSucceeded(data));
//   } catch (e) {
//     toastError(e);
//     yield put(accountActions.getPartnerUserListFailed());
//   }
// }

function* addPartnerUserSaga(action: Action<accountActions.AddPartnerUserPayload>) {
  try {
    yield call(addPartnerUser, action.payload);
    toastSuccess(t('partnerPortal.account.createUser'));

    yield Router.push(`/trade-in-account/my-account/profile`);
  } catch (e) {
    toastError(e);
  }
}

function* updatePartnerUserSaga(action: Action<accountActions.UpdatePartnerUserPayload>) {
  try {
    const { id } = action.payload;
    delete action.payload.id;

    yield call(updatePartnerUser, id, action.payload);
    toastSuccess(t('partnerPortal.account.updateUser'));

    yield Router.push(`/trade-in-account/my-account/profile`);
  } catch (e) {
    toastError(e);
  }
}

function* deletePartnerUserSaga(action: Action<accountActions.UnblockUser>) {
  try {
    const { id, getData } = action.payload;
    yield call(deletePartnerUser, id);
    toastSuccess('Remove account successfully.');

    if (getData) {
      yield call(getData);
    }
    yield put(accountActions.deletePartnerUserSucceeded(action.payload));
  } catch (e) {
    toastError(e);
    yield put(accountActions.deletePartnerUserFailed());
  }
}

function* getNewesteNotificationSaga(action: Action<NewesteNotificationPayload>) {
  try {
    const response: NewesteNotificationResponse = yield call(getNewesteNotificationRequest, action.payload);
    yield put(accountActions.getNewesteNotificationSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getNewesteNotificationFailed());
  }
}

function* getActionNewesteNotificationSaga(action: Action<ActionNewesteNotificationPayload>) {
  try {
    const response: DataActionNewesteNotificationResponse = yield call(
      getActionNewesteNotificationRequest,
      action.payload,
    );
    const paramsList = {
      is_partner_list: true,
      partner_id: action?.payload?.partner_id,
      sort: 'date_published:-1',
    };
    const responseList: NewesteNotificationResponse = yield call(getNewesteNotificationRequest, paramsList);
    yield put(accountActions.getNewesteNotificationSucceeded(responseList));
    yield put(accountActions.getActionNewesteNotificationSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getActionNewesteNotificationFailed());
  }
}

export default function* partnerAccountSaga() {
  yield takeLatest(accountActions.getPartnerDetail, getPartnerDetailSaga);
  yield takeLatest(accountActions.getListBlockedUsers, getListBlockedUsersSaga);
  yield takeLatest(accountActions.unblockUser, unblockUserSaga);
  yield takeLatest(accountActions.getListPartnerUsers, getListPartnerUsersSaga);
  yield takeLatest(accountActions.deletePartnerUser, deletePartnerUserSaga);
  yield takeLatest(accountActions.addPartnerUser, addPartnerUserSaga);
  yield takeLatest(accountActions.updatePartnerUser, updatePartnerUserSaga);
  yield takeLatest(accountActions.getListPartnerLocation, getListPartnerLocationSaga);
  yield takeLatest(accountActions.filterPartnerDetail, filterPartnerDetailSaga);
  yield takeLatest(accountActions.addPartnerLocation, addPartnerLocationSaga);
  yield takeLatest(accountActions.editPartnerLocation, editPartnerLocationSaga);
  yield takeLatest(accountActions.getPartnerLocationDetail, getPartnerLocationDetailSaga);
  yield takeLatest(accountActions.getTradeInScorecardReports, getTradeInScorecardReportsSaga);
  yield takeLatest(accountActions.getNotificationSetting, getNotificationSettingSaga);
  yield takeLatest(accountActions.getListLeadGen, getListLeadGenSaga);
  yield takeLatest(accountActions.getListTradeInBicycle, getListTradeInBicycleSaga);
  yield takeLatest(accountActions.getNewesteNotification, getNewesteNotificationSaga);
  yield takeLatest(accountActions.getActionNewesteNotification, getActionNewesteNotificationSaga);

  // yield takeLatest(accountActions.getPartnerUserProfile, getPartnerUserProfileSaga);
  // yield takeLatest(accountActions.getPartnerUserList, getPartnerUserListSaga);
  // yield takeLatest(accountActions.addPartnerUser, addPartnerUserSaga);
  // yield takeLatest(accountActions.updatePartnerUser, updatePartnerUserSaga);
  // yield takeLatest(accountActions.deletePartnerUser, deletePartnerUserSaga);
}
