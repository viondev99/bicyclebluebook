import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import {
  getStorefrontDetail,
  getStorefrontUserProfile,
  getStorefrontUserList,
  StorefrontDetailResponse,
  StorefrontUserProfileResponse,
  GetStorefrontUserListResponse,
  StorefrontUserItem,
  UpdateStorefrontUserResponse,
  addStorefrontUser,
  updateStorefrontUser,
  deleteStorefrontUser,
  StorefrontListCasesAccountResponse,
  getStorefrontListCasesAccount,
  StorefrontListAssignCasesResponse,
  getStorefrontListAssignCases,
  getStorefrontDetailCases,
  updateStatusStorefrontDetailCases,
  updateAssigneeStorefrontDetailCases,
  StorefrontAddComplainOrderSendResponse,
  addStorefrontComplainOrderSendResponse,
  StorefrontOrPersonalByListIdsResponse,
  getStorefrontUserDetail,
  StorefrontUserDetail,
  storefrontAddOnlineStore,
} from 'api/store-front/account.api';
import {
  StorefrontDetailModel,
  StorefrontUserModel,
  StorefrontUserProfileModel,
} from 'model/store/store-front/account.model';
import t from 'helpers/language';
import StoreState from 'model/store';
import uniq from 'lodash/uniq';
import { getStoresBasicInfo, getUsersBasicInfo } from 'api/info.api';
import * as accountActions from './account.action';

function* getStorefrontDetailSaga(action: Action<string>) {
  try {
    const response: StorefrontDetailResponse = yield call(getStorefrontDetail, action.payload);
    const payload: StorefrontDetailModel = {
      id: response?._id || '',
      name: response?.name || '',
      logo: response?.logo || '',
      gallery: response?.gallery || '',
      email: response?.email || '',
      paypalEmail: response?.paypal_email || '',
      phone: response?.phone || '',
      website_url: response?.website_url || '',
      contact_name: response?.contact_name || '',
      reseller_number: response?.reseller_number || '',
      pdf_upload: response?.pdf_upload || '',
      description: response?.description || '',
      bindingAddress: {
        address: response?.binding_address?.address || '',
        city: response?.binding_address?.city || '',
        state: response?.binding_address?.state || '',
        zipCode: response?.binding_address?.zip_code || '',
      },
      shippingAddress: {
        address: response?.shipping_address?.address || '',
        city: response?.shipping_address?.city || '',
        state: response?.shipping_address?.state || '',
        zipCode: response?.shipping_address?.zip_code || '',
      },
      dateCreated: response?.date_created || '',
      dateUpdated: response?.date_updated || '',
    };
    yield put(accountActions.getStorefrontDetailSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getStorefrontDetailFailed());
  }
}

function* getStorefrontUserProfileSaga(action: Action<string>) {
  try {
    const response: StorefrontUserProfileResponse = yield call(getStorefrontUserProfile, action.payload);
    const payload: StorefrontUserProfileModel = {
      id: response?._id || '',
      firstName: response?.first_name || '',
      lastName: response?.last_name || '',
      avatar: response?.avatar || '',
      email: response?.email || '',
    };
    yield put(accountActions.getStorefrontUserProfileSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getStorefrontUserProfileFailed());
  }
}

function* getStorefrontUserListSaga(action: Action<accountActions.GetStorefrontUserListPayload>) {
  try {
    const response: GetStorefrontUserListResponse = yield call(getStorefrontUserList, action.payload);
    const data: StorefrontUserModel[] = response.data.map((item) => ({
      id: item._id,
      account: item.account,
      storefront: item.storefront,
      name: item.display_name,
      email: item.email,
      role: item.role,
      dateCreated: item.date_created,
      dateUpdated: item.date_updated,
    }));
    yield put(accountActions.getStorefrontUserListSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getStorefrontUserListFailed());
  }
}

function* addStorefrontUserSaga(action: Action<accountActions.AddStorefrontUserPayload>) {
  try {
    const response: StorefrontUserItem = yield call(addStorefrontUser, action.payload);
    const data: StorefrontUserModel = {
      id: response._id,
      account: response.account,
      storefront: response.storefront,
      name: response.display_name,
      email: response.email,
      role: response.role,
      dateCreated: response.date_created,
      dateUpdated: response.date_updated,
    };
    toastSuccess(t('storeFront.account.createUser'));
    yield put(accountActions.addStorefrontUserSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(accountActions.addStorefrontUserFailed());
  }
}

function* updateStorefrontUserSaga(action: Action<accountActions.UpdateStorefrontUserPayload>) {
  try {
    const payload = {
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      email: action.payload.email,
      role: action.payload.role,
    };
    const response: UpdateStorefrontUserResponse = yield call(updateStorefrontUser, action.payload.id, payload);
    const data: Partial<StorefrontUserModel> = {
      id: response.user,
      account: response._id,
      storefront: response.storefront,
      name: `${response?.first_name || ''} ${response?.last_name || ''}`,
      email: response.email,
      role: action.payload.role,
      dateCreated: response.date_created,
      dateUpdated: response.date_updated,
    };
    toastSuccess(t('storeFront.account.updateUser'));
    yield put(accountActions.updateStorefrontUserSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(accountActions.updateStorefrontUserFailed());
  }
}

function* deleteStorefrontUserSaga(action: Action<string>) {
  try {
    yield call(deleteStorefrontUser, action.payload);
    toastSuccess(t('storeFront.account.removeUser'));
    yield put(accountActions.deleteStorefrontUserSucceeded(action.payload));
  } catch (e) {
    toastError(e);
    yield put(accountActions.deleteStorefrontUserFailed());
  }
}

function* getStorefrontListCasesSaga({ payload }: Action<accountActions.GetStorefrontListCasesPayload>) {
  try {
    const response: StorefrontListCasesAccountResponse = yield call(getStorefrontListCasesAccount, payload);
    yield put(accountActions.getStorefrontListCasesSucceeded(response));
    yield put(accountActions.updateStorefrontFilterListCases(payload));

    let listStorefrontId: string[] = [];
    let listPartnerId: string[] = [];
    if (response) {
      response?.data?.forEach((item) => {
        listStorefrontId = uniq([...listStorefrontId, ...[item?.storefront]]);
        listPartnerId = uniq([...listPartnerId, ...[item?.seller_id]]);
      });
      const resStoreFrontInfo: StorefrontOrPersonalByListIdsResponse[] = yield call(
        getStoresBasicInfo,
        listStorefrontId,
      );
      const resPersonalInfo: StorefrontOrPersonalByListIdsResponse[] = yield call(getUsersBasicInfo, listStorefrontId);
      yield put(
        accountActions.updateStorefrontListInfoStorefrontAndPersonalSucceeded([
          ...resStoreFrontInfo,
          ...resPersonalInfo,
        ]),
      );
    }
  } catch (e) {
    toastError(e);
    yield put(accountActions.getStorefrontListCasesFailed());
  }
}

function* getStorefrontListAssignSaga({ payload }: Action<accountActions.GetListAssignPayload>) {
  try {
    const response: StorefrontListAssignCasesResponse = yield call(getStorefrontListAssignCases, payload);
    yield put(accountActions.getStorefrontListAssignSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getStorefrontListAssignFailed());
  }
}

function* getStorefrontDetailCasesSaga({ payload }: Action<accountActions.GetDetailCasesPayload>) {
  try {
    const response: StorefrontListAssignCasesResponse = yield call(getStorefrontDetailCases, payload);
    yield put(accountActions.getStorefrontDetailCasesSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getStorefrontDetailCasesFailed());
  }
}
function* updateStorefrontDetailCasesSaga({ payload }: Action<accountActions.UpdateDetailCasesPayload>) {
  try {
    yield call(updateStatusStorefrontDetailCases, payload);
    yield call(updateAssigneeStorefrontDetailCases, payload);
    yield put(accountActions.updateStorefrontDetailCasesSucceeded());
    toastSuccess(t('cases.assign.updated'), t('seoTitle.success'));
  } catch (e) {
    toastError(e);
    yield put(accountActions.updateStorefrontDetailCasesFailed());
  }
}

function* addStorefrontComplainOrderSendResponseSaga({
  payload,
}: Action<accountActions.AddComplainOrderSendResponsePayload>) {
  try {
    // check reload list cases when update modal
    let needReloadListCases: boolean = payload?.needReloadListCases ? true : false;
    delete payload.needReloadListCases;

    const response: StorefrontAddComplainOrderSendResponse = yield call(
      addStorefrontComplainOrderSendResponse,
      payload,
    );
    const dataDetailCases = yield select((store: StoreState) => store.storeFront.account.dataDetailCases);
    if (dataDetailCases?.send_reponses) {
      yield put(
        accountActions.getStorefrontDetailCasesSucceeded({
          ...dataDetailCases,
          status: payload?.amount_refund ? 'closed' : dataDetailCases?.status, // if refunded cases and screen is case details => closed
          send_reponses: [...dataDetailCases.send_reponses, ...[response]],
        }),
      );
    }
    if (needReloadListCases) {
      const filterListCases = yield select((store: StoreState) => store.storeFront.account.filterListCases);
      yield put(accountActions.getStorefrontListCases(filterListCases));
    }
    toastSuccess(t('cases.assign.success'));
    yield put(accountActions.addStorefrontComplainOrderSendResponseSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.addStorefrontComplainOrderSendResponseFailed());
  }
}

function* updateStorefrontMoveToOpenOrCloseCasesSaga({
  payload,
}: Action<accountActions.UpdateStorefrontMoveToOpenOrCloseCasesPayload>) {
  try {
    yield call(updateStatusStorefrontDetailCases, payload);
    const filterListCases = yield select((store: StoreState) => store.storeFront.account.filterListCases);
    yield put(accountActions.updateStorefrontMoveToOpenOrCloseCasesSucceeded());
    yield put(accountActions.getStorefrontListCases(filterListCases));
    toastSuccess(t('cases.assign.updated_status'));
  } catch (e) {
    toastError(e);
    yield put(accountActions.updateStorefrontMoveToOpenOrCloseCasesFailed());
  }
}

function* addOnlineStoreSaga({ payload }: Action<accountActions.CreateOnlineStorePayload>) {
  try {
    yield call(storefrontAddOnlineStore, payload);
    yield put(accountActions.addOnlineStoreSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(accountActions.addOnlineStoreFailed());
  }
}

function* getDetailUserOnlineStoreSaga({ payload }: Action<accountActions.GetDetailUserOnlineStorePayload>) {
  try {
    const response: StorefrontUserDetail = yield call(getStorefrontUserDetail, payload);
    yield put(accountActions.getDetailUserOnlineStoreSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(accountActions.getDetailUserOnlineStoreFailed());
  }
}

export default function* storefrontAccountSaga() {
  yield takeLatest(accountActions.getStorefrontDetail, getStorefrontDetailSaga);
  yield takeLatest(accountActions.getStorefrontUserProfile, getStorefrontUserProfileSaga);
  yield takeLatest(accountActions.getStorefrontUserList, getStorefrontUserListSaga);
  yield takeLatest(accountActions.addStorefrontUser, addStorefrontUserSaga);
  yield takeLatest(accountActions.updateStorefrontUser, updateStorefrontUserSaga);
  yield takeLatest(accountActions.deleteStorefrontUser, deleteStorefrontUserSaga);
  yield takeLatest(accountActions.getStorefrontListCases, getStorefrontListCasesSaga);
  yield takeLatest(accountActions.getStorefrontListAssign, getStorefrontListAssignSaga);
  yield takeLatest(accountActions.getStorefrontDetailCases, getStorefrontDetailCasesSaga);
  yield takeLatest(accountActions.updateStorefrontDetailCases, updateStorefrontDetailCasesSaga);
  yield takeLatest(accountActions.addStorefrontComplainOrderSendResponse, addStorefrontComplainOrderSendResponseSaga);
  yield takeLatest(accountActions.updateStorefrontMoveToOpenOrCloseCases, updateStorefrontMoveToOpenOrCloseCasesSaga);
  yield takeLatest(accountActions.addOnlineStore, addOnlineStoreSaga);
  yield takeLatest(accountActions.getDetailUserOnlineStore, getDetailUserOnlineStoreSaga);
}
