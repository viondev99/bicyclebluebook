import { Action, handleActions } from 'redux-actions';
import {
  GetBaseComponentFailedPayload,
  GetBaseComponentSuccessPayload,
  GetBrandFromYearModelSuccesspayload,
  GetBrandFromYearModelFailedPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { BaseComponentStoreModel } from 'model/store/value-guide.model';
import { ModelsResponse } from 'api/trade-in.api';

const INIT_STATE: BaseComponentStoreModel = {
  baseComponent: {
    bicycleBrands: [],
    bicycleYears: [],
  },
  branchYearModel: [],
  loading: false,
  error: '',
};

const reducer = handleActions<BaseComponentStoreModel, ValueGuidePayload>(
  {
    GET_BASE_COMPONENT: (state) => {
      return {
        ...state,
        baseComponent: {
          bicycleBrands: [],
          bicycleYears: [],
        },
        loading: true,
      };
    },
    GET_BASE_COMPONENT_SUCCEEDED: (state, action: Action<GetBaseComponentSuccessPayload>) => {
      return { ...state, baseComponent: action.payload, loading: true };
    },
    GET_BASE_COMPONENT_FAILED: (state, action: Action<GetBaseComponentFailedPayload>) => {
      return {
        ...state,
        baseComponent: {
          ...state.baseComponent,
          bicycleBrands: [],
        },
        error: action.payload,
        loading: true,
      };
    },
    GET_BRAND_FROM_YEAR_MODEL: (state) => {
      return { ...state, branchYearModel: [], loading: true };
    },
    GET_BRAND_FROM_YEAR_MODEL_SUCCEEDED: (state, action: Action<GetBrandFromYearModelSuccesspayload>) => {
      return { ...state, branchYearModel: action.payload, loading: true };
    },
    GET_BRAND_FROM_YEAR_MODEL_FAILED: (state, action: Action<GetBrandFromYearModelFailedPayload>) => {
      return { ...state, error: action.payload, loading: true };
    },
    GET_BRAND_FROM_YEAR_MODEL_RED_BARN: (state) => {
      return { ...state, branchYearModel: [], loading: true };
    },
    GET_BRAND_FROM_YEAR_MODEL_RED_BARN_SUCCEEDED: (state, action: Action<GetBrandFromYearModelSuccesspayload>) => {
      return { ...state, branchYearModel: action.payload, loading: true };
    },
    GET_BRAND_FROM_YEAR_MODEL_RED_BARN_FAILED: (state, action: Action<GetBrandFromYearModelFailedPayload>) => {
      return { ...state, error: action.payload, loading: true };
    },
    TRACKING_EVENT_CONTROLLER: (state) => {
      return { ...state };
    },
    TRACKING_EVENT_CONTROLLER_SUCCEEDED: (state) => {
      return { ...state };
    },
    TRACKING_EVENT_CONTROLLER_FAILED: (state) => {
      return { ...state };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
