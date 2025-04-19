import { createActions } from 'redux-actions';
import {
  StorefrontDetailModel,
  StorefrontUserProfileModel,
  StorefrontUserModel,
  StorefrontListCasesAccountModel,
  StorefrontListAssignCasesModel,
  StorefrontDetailCasesModel,
  StorefrontAddComplainOrderSendResponseModel,
  StorefrontInfoStorefrontOrPersonalByListIdsModel,
  FormCreateOnlineStoreModel,
} from 'model/store/store-front/account.model';
import { StorefrontRole } from 'constants/roles';
import { StorefrontUserDetail } from '../../../api/store-front/account.api';

export type GetStorefrontUserListPayload = {
  id: string;
  page: number;
  pageSize: number;
  searchKey: string;
  sort: string;
};

export type AddStorefrontUserPayload = {
  email: string;
  firstName: string;
  lastName: string;
  role: StorefrontRole;
  storefront: string;
};

export type UpdateStorefrontUserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: StorefrontRole;
};

export type GetStorefrontListCasesPayload = {
  page: number;
  page_size: number;
  is_seller: boolean;
  sort: number;
  status: string;
  storefrontIds?: string[];
};

export type GetListAssignPayload = {
  storeFrontId: string;
  page_size: number | string;
};

export type GetDetailCasesPayload = {
  id: string;
};

export type UpdateDetailCasesPayload = {
  id: string;
  status: string;
  assign?: string;
};

export type AddComplainOrderSendResponsePayload = {
  content: string;
  note: string;
  upload: Blob;
  status: string;
  case_id: string;
  carrier?: string;
  tracking_number?: string;
  amount_refund?: string;
  needReloadListCases?: boolean;
};

export type UpdateStorefrontMoveToOpenOrCloseCasesPayload = {
  id: string;
  status: string;
};

export type CreateOnlineStorePayload = FormCreateOnlineStoreModel;

export type GetDetailUserOnlineStorePayload = string;

export type StorefrontAccountPayload =
  | string
  | StorefrontDetailModel
  | Partial<StorefrontDetailModel>
  | StorefrontUserProfileModel
  | GetStorefrontUserListPayload
  | StorefrontUserModel[]
  | StorefrontUserModel
  | Partial<StorefrontUserModel>
  | AddStorefrontUserPayload
  | Partial<StorefrontListCasesAccountModel>
  | UpdateStorefrontUserPayload
  | GetStorefrontListCasesPayload
  | GetListAssignPayload
  | StorefrontListAssignCasesModel
  | GetDetailCasesPayload
  | StorefrontDetailCasesModel
  | UpdateDetailCasesPayload
  | AddComplainOrderSendResponsePayload
  | StorefrontAddComplainOrderSendResponseModel
  | UpdateStorefrontMoveToOpenOrCloseCasesPayload
  | StorefrontInfoStorefrontOrPersonalByListIdsModel[]
  | CreateOnlineStorePayload
  | GetDetailUserOnlineStorePayload
  | StorefrontUserDetail;
export const {
  getStorefrontDetail,
  getStorefrontDetailSucceeded,
  getStorefrontDetailFailed,
  getStorefrontUserProfile,
  getStorefrontUserProfileSucceeded,
  getStorefrontUserProfileFailed,
  getStorefrontUserList,
  getStorefrontUserListSucceeded,
  getStorefrontUserListFailed,
  addStorefrontUser,
  addStorefrontUserSucceeded,
  addStorefrontUserFailed,
  updateStorefrontUser,
  updateStorefrontUserSucceeded,
  updateStorefrontUserFailed,
  deleteStorefrontUser,
  deleteStorefrontUserSucceeded,
  deleteStorefrontUserFailed,
  getStorefrontListCases,
  getStorefrontListCasesSucceeded,
  getStorefrontListCasesFailed,
  getStorefrontListAssign,
  getStorefrontListAssignSucceeded,
  getStorefrontListAssignFailed,
  getStorefrontDetailCases,
  getStorefrontDetailCasesSucceeded,
  getStorefrontDetailCasesFailed,
  updateStorefrontDetailCases,
  updateStorefrontDetailCasesSucceeded,
  updateStorefrontDetailCasesFailed,
  addStorefrontComplainOrderSendResponse,
  addStorefrontComplainOrderSendResponseSucceeded,
  addStorefrontComplainOrderSendResponseFailed,
  updateStorefrontFilterListCases,
  updateStorefrontMoveToOpenOrCloseCases,
  updateStorefrontMoveToOpenOrCloseCasesSucceeded,
  updateStorefrontMoveToOpenOrCloseCasesFailed,
  updateStorefrontListInfoStorefrontAndPersonalSucceeded,
  addOnlineStore,
  addOnlineStoreSucceeded,
  addOnlineStoreFailed,
  getDetailUserOnlineStore,
  getDetailUserOnlineStoreSucceeded,
  getDetailUserOnlineStoreFailed,
} = createActions<StorefrontAccountPayload>(
  {
    GET_STOREFRONT_DETAIL: (payload: string) => payload,
    GET_STOREFRONT_DETAIL_SUCCEEDED: (payload: Partial<StorefrontDetailModel>) => payload,
    GET_STOREFRONT_DETAIL_FAILED: null,
    GET_STOREFRONT_USER_PROFILE: (payload: string) => payload,
    GET_STOREFRONT_USER_PROFILE_SUCCEEDED: (payload: Partial<StorefrontUserProfileModel>) => payload,
    GET_STOREFRONT_USER_PROFILE_FAILED: null,
    GET_STOREFRONT_USER_LIST: (payload: GetStorefrontUserListPayload) => payload,
    GET_STOREFRONT_USER_LIST_SUCCEEDED: (payload: StorefrontUserModel[]) => payload,
    GET_STOREFRONT_USER_LIST_FAILED: null,
    ADD_STOREFRONT_USER: (payload: AddStorefrontUserPayload) => payload,
    ADD_STOREFRONT_USER_SUCCEEDED: (payload: StorefrontUserModel) => payload,
    ADD_STOREFRONT_USER_FAILED: null,
    UPDATE_STOREFRONT_USER: (payload: UpdateStorefrontUserPayload) => payload,
    UPDATE_STOREFRONT_USER_SUCCEEDED: (payload: Partial<StorefrontUserModel>) => payload,
    UPDATE_STOREFRONT_USER_FAILED: null,
    DELETE_STOREFRONT_USER: (payload: string) => payload,
    DELETE_STOREFRONT_USER_SUCCEEDED: (payload: string) => payload,
    DELETE_STOREFRONT_USER_FAILED: null,
    GET_STOREFRONT_LIST_CASES: (payload: GetStorefrontListCasesPayload) => payload,
    GET_STOREFRONT_LIST_CASES_SUCCEEDED: (payload: Partial<StorefrontListCasesAccountModel>) => payload,
    GET_STOREFRONT_LIST_CASES_FAILED: null,
    GET_STOREFRONT_LIST_ASSIGN: (payload: GetListAssignPayload) => payload,
    GET_STOREFRONT_LIST_ASSIGN_SUCCEEDED: (payload: StorefrontListAssignCasesModel) => payload,
    GET_STOREFRONT_LIST_ASSIGN_FAILED: null,
    GET_STOREFRONT_DETAIL_CASES: (payload: GetDetailCasesPayload) => payload,
    GET_STOREFRONT_DETAIL_CASES_SUCCEEDED: (payload: StorefrontDetailCasesModel) => payload,
    GET_STOREFRONT_DETAIL_CASES_FAILED: null,
    UPDATE_STOREFRONT_DETAIL_CASES: (payload: UpdateDetailCasesPayload) => payload,
    UPDATE_STOREFRONT_DETAIL_CASES_SUCCEEDED: null,
    UPDATE_STOREFRONT_DETAIL_CASES_FAILED: null,
    ADD_STOREFRONT_COMPLAIN_ORDER_SEND_RESPONSE: (payload: AddComplainOrderSendResponsePayload) => payload,
    ADD_STOREFRONT_COMPLAIN_ORDER_SEND_RESPONSE_SUCCEEDED: (payload: StorefrontAddComplainOrderSendResponseModel) =>
      payload,
    ADD_STOREFRONT_COMPLAIN_ORDER_SEND_RESPONSE_FAILED: null,
    UPDATE_STOREFRONT_FILTER_LIST_CASES: (payload: GetStorefrontListCasesPayload) => payload,
    UPDATE_STOREFRONT_MOVE_TO_OPEN_OR_CLOSE_CASES: (payload: UpdateStorefrontMoveToOpenOrCloseCasesPayload) => payload,
    UPDATE_STOREFRONT_MOVE_TO_OPEN_OR_CLOSE_CASES_SUCCEEDED: null,
    UPDATE_STOREFRONT_MOVE_TO_OPEN_OR_CLOSE_CASES_FAILED: null,
    UPDATE_STOREFRONT_LIST_INFO_STOREFRONT_AND_PERSONAL_SUCCEEDED: (
      payload: StorefrontInfoStorefrontOrPersonalByListIdsModel[],
    ) => payload,
    ADD_ONLINE_STORE: (payload: FormCreateOnlineStoreModel) => payload,
    ADD_ONLINE_STORE_SUCCEEDED: null,
    ADD_ONLINE_STORE_FAILED: null,
    GET_DETAIL_USER_ONLINE_STORE: (payload: GetDetailUserOnlineStorePayload) => payload,
    GET_DETAIL_USER_ONLINE_STORE_SUCCEEDED: (payload: StorefrontUserDetail) => payload,
    GET_DETAIL_USER_ONLINE_STORE_FAILED: null,
  },
  {
    prefix: 'storefront-account',
  },
);
