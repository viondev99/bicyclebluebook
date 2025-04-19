import { Action, handleActions } from 'redux-actions';

import { CommonStoreModel, GetBannerPublishingResponse, ItemStoreFrontModel } from '../../model/store/common.model';
import {
  CommonPayload,
  GetStatesSuccessPayload,
  GetStatesFailedPayload,
  GetComponentsSuccessPayload,
  GetComponentsFailedPayload,
  GetPartnersSuccessPayload,
  GetPartnersFailedPayload,
} from './common.action';

const INIT_STATE: CommonStoreModel = {
  states: {},
  loadingState: false,
  components: {},
  loadingComponent: false,
  partners: [],
  listStoreFronts: [],
  loadingPartner: false,
  error: '',
  bannerPublishing: null,
  isSelectedStore: false,
};

const commonReducer = handleActions<CommonStoreModel, CommonPayload>(
  {
    GET_BANNER_PUBLISHING: (state) => {
      return {
        ...state,
      };
    },
    GET_BANNER_PUBLISHING_SUCCEEDED: (state, action: Action<GetBannerPublishingResponse>) => {
      return {
        ...state,
        bannerPublishing: action.payload,
      };
    },
    GET_BANNER_PUBLISHING_FAILED: (state) => {
      return {
        ...state,
      };
    },

    GET_LIST_STORE_FRONT_SUCCEEDED: (state, action: Action<ItemStoreFrontModel[]>) => {
      return {
        ...state,
        listStoreFronts: action.payload,
      };
    },
    GET_LIST_STORE_FRONT_FAILED: (state) => {
      return {
        ...state,
        listStoreFronts: [],
      };
    },
    GET_STATES: (state) => {
      return {
        ...state,
        states: {},
        loadingState: true,
      };
    },
    GET_STATES_SUCCEEDED: (state, action: Action<GetStatesSuccessPayload>) => {
      return {
        ...state,
        states: action.payload,
        loadingState: false,
      };
    },
    GET_STATES_FAILED: (state, action: Action<GetStatesFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loadingState: false,
      };
    },
    GET_COMPONENTS: (state) => {
      return {
        ...state,
        components: {},
        loadingComponent: true,
      };
    },
    GET_COMPONENTS_SUCCEEDED: (state, action: Action<GetComponentsSuccessPayload>) => {
      return {
        ...state,
        components: action.payload,
        loadingComponent: false,
      };
    },
    GET_COMPONENTS_FAILED: (state, action: Action<GetComponentsFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loadingComponent: false,
      };
    },
    GET_PARTNERS: (state) => {
      return {
        ...state,
        loadingPartner: true,
      };
    },
    GET_PARTNERS_SUCCEEDED: (state, action: Action<GetPartnersSuccessPayload>) => {
      return {
        ...state,
        partners: action.payload,
        loadingPartner: false,
      };
    },
    GET_PARTNERS_FAILED: (state, action: Action<GetPartnersFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loadingPartner: false,
      };
    },
    HANDLE_SELECTED_STORE: (state, action: Action<boolean>) => {
      return {
        ...state,
        isSelectedStore: action.payload,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'common',
  },
);

export default commonReducer;
