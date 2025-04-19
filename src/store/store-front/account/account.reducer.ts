import { Action, handleActions } from 'redux-actions';

import {
  StorefrontAccountStoreModel,
  StorefrontDetailModel,
  StorefrontUserProfileModel,
  StorefrontUserModel,
  StorefrontListCasesAccountModel,
  StorefrontListAssignCasesModel,
  StorefrontInfoStorefrontOrPersonalByListIdsModel,
} from 'model/store/store-front/account.model';
import { StorefrontUserDetail } from 'api/store-front/account.api';
import { GetStorefrontListCasesPayload, StorefrontAccountPayload } from './account.action';

const INIT_STATE: StorefrontAccountStoreModel = {
  detail: undefined,
  userProfile: undefined,
  users: [],
  loading: false,
  loadingAction: false,
  successAction: false,
  dataCases: undefined,
  dataAssign: undefined,
  dataDetailCases: undefined,
  filterListCases: undefined,
  listInfoStorefrontAndPersonal: [],
  storefrontUserDetail: undefined,
  isSuccessAfterCreateOnlineStore: false,
};

const storefrontAccountReducer = handleActions<StorefrontAccountStoreModel, StorefrontAccountPayload>(
  {
    UPDATE_STOREFRONT_LIST_INFO_STOREFRONT_AND_PERSONAL_SUCCEEDED: (
      state,
      action: Action<StorefrontInfoStorefrontOrPersonalByListIdsModel[]>,
    ) => {
      return {
        ...state,
        listInfoStorefrontAndPersonal: action.payload,
      };
    },
    UPDATE_STOREFRONT_MOVE_TO_OPEN_OR_CLOSE_CASES: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: true,
      };
    },
    UPDATE_STOREFRONT_MOVE_TO_OPEN_OR_CLOSE_CASES_SUCCEEDED: (state) => {
      return {
        ...state,
        successAction: true,
        loadingAction: false,
      };
    },
    UPDATE_STOREFRONT_MOVE_TO_OPEN_OR_CLOSE_CASES_FAILED: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: false,
      };
    },
    ADD_STOREFRONT_COMPLAIN_ORDER_SEND_RESPONSE: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: true,
      };
    },
    ADD_STOREFRONT_COMPLAIN_ORDER_SEND_RESPONSE_SUCCEEDED: (state) => {
      return {
        ...state,
        successAction: true,
        loadingAction: false,
      };
    },
    ADD_STOREFRONT_COMPLAIN_ORDER_SEND_RESPONSE_FAILED: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: false,
      };
    },
    UPDATE_STOREFRONT_DETAIL_CASES: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: true,
      };
    },
    UPDATE_STOREFRONT_DETAIL_CASES_SUCCEEDED: (state) => {
      return {
        ...state,
        successAction: true,
        loadingAction: false,
      };
    },
    UPDATE_STOREFRONT_DETAIL_CASES_FAILED: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: false,
      };
    },
    GET_STOREFRONT_DETAIL_CASES: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_STOREFRONT_DETAIL_CASES_SUCCEEDED: (state, action: Action<StorefrontListAssignCasesModel>) => {
      return {
        ...state,
        dataDetailCases: { ...state.dataDetailCases, ...action.payload },
        loading: false,
      };
    },
    GET_STOREFRONT_DETAIL_CASES_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    UPDATE_STOREFRONT_FILTER_LIST_CASES: (state, action: Action<GetStorefrontListCasesPayload>) => {
      return {
        ...state,
        filterListCases: action.payload,
      };
    },
    GET_STOREFRONT_LIST_ASSIGN: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_STOREFRONT_LIST_ASSIGN_SUCCEEDED: (state, action: Action<StorefrontListAssignCasesModel>) => {
      return {
        ...state,
        dataAssign: { ...state.dataAssign, ...action.payload },
        loading: false,
      };
    },
    GET_STOREFRONT_LIST_ASSIGN_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_STOREFRONT_LIST_CASES: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_STOREFRONT_LIST_CASES_SUCCEEDED: (state, action: Action<Partial<StorefrontListCasesAccountModel>>) => {
      return {
        ...state,
        dataCases: { ...state.dataCases, ...action.payload },
        loading: false,
      };
    },
    GET_STOREFRONT_LIST_CASES_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_STOREFRONT_DETAIL: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_STOREFRONT_DETAIL_SUCCEEDED: (state, action: Action<Partial<StorefrontDetailModel>>) => {
      return {
        ...state,
        detail: { ...state.detail, ...action.payload },
        loading: false,
      };
    },
    GET_STOREFRONT_DETAIL_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_STOREFRONT_USER_PROFILE: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_STOREFRONT_USER_PROFILE_SUCCEEDED: (state, action: Action<Partial<StorefrontUserProfileModel>>) => {
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
        loading: false,
      };
    },
    GET_STOREFRONT_USER_PROFILE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_STOREFRONT_USER_LIST: (state) => {
      return {
        ...state,
        users: [],
        loading: true,
      };
    },
    GET_STOREFRONT_USER_LIST_SUCCEEDED: (state, action: Action<StorefrontUserModel[]>) => {
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    },
    GET_STOREFRONT_USER_LIST_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    ADD_STOREFRONT_USER: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: true,
      };
    },
    ADD_STOREFRONT_USER_SUCCEEDED: (state, action: Action<StorefrontUserModel>) => {
      return {
        ...state,
        users: [action.payload, ...state.users],
        successAction: true,
        loadingAction: false,
      };
    },
    ADD_STOREFRONT_USER_FAILED: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: false,
      };
    },
    UPDATE_STOREFRONT_USER: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: true,
      };
    },
    UPDATE_STOREFRONT_USER_SUCCEEDED: (state, action: Action<Partial<StorefrontUserModel>>) => {
      return {
        ...state,
        users: state.users.map((item) => {
          if (item.account === action.payload.account) {
            return { ...item, ...action.payload };
          }
          return item;
        }),
        successAction: true,
        loadingAction: false,
      };
    },
    UPDATE_STOREFRONT_USER_FAILED: (state) => {
      return {
        ...state,
        successAction: false,
        loadingAction: false,
      };
    },
    DELETE_STOREFRONT_USER: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    DELETE_STOREFRONT_USER_SUCCEEDED: (state, action: Action<string>) => {
      return {
        ...state,
        users: state.users.filter((item) => item.account !== action.payload),
        loadingAction: false,
      };
    },
    DELETE_STOREFRONT_USER_FAILED: (state) => {
      return {
        ...state,
        loadingAction: false,
      };
    },
    ADD_ONLINE_STORE: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    ADD_ONLINE_STORE_SUCCEEDED: (state) => {
      return {
        ...state,
        loadingAction: false,
        isSuccessAfterCreateOnlineStore: true,
      };
    },
    ADD_ONLINE_STORE_FAILED: (state) => {
      return {
        ...state,
        loadingAction: false,
      };
    },
    GET_STORE_FRONT_USER_DETAIL: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    GET_DETAIL_USER_ONLINE_STORE: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    GET_DETAIL_USER_ONLINE_STORE_SUCCEEDED: (state, action: Action<StorefrontUserDetail>) => {
      return {
        ...state,
        storefrontUserDetail: action.payload,
        loadingAction: false,
      };
    },
    GET_DETAIL_USER_ONLINE_STORE_FAILED: (state) => {
      return {
        ...state,
        loadingAction: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'storefront-account',
  },
);

export default storefrontAccountReducer;
