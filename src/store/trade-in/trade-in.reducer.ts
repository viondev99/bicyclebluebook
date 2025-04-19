import { ModelsResponse } from 'api/trade-in.api';
import { Action, handleActions } from 'redux-actions';

import { TradeInStoreModel } from '../../model/store/trade-in.model';
import {
  TradeInPayload,
  GetModelsByBrandSuccessPayload,
  GetModelsByBrandFailedPayload,
  GetBicyclesByBrandModelSuccessPayload,
  GetBicyclesByBrandModelFailedPayload,
  GetConditionsByComponentsSuccessPayload,
  GetConditionsByComponentsFailedPayload,
  GetBrandsByTypeSuccessPayload,
  GetBrandsByTypeFailedPayload,
  RequestTradeInFailedPayload,
} from './trade-in.action';

const INIT_STATE: TradeInStoreModel = {
  models: [],
  loadingModel: false,
  bicycles: [],
  loadingBicycle: false,
  conditions: null,
  loadingCondition: false,
  brands: [],
  loadingBrand: false,
  loadingRequest: false,
  completeRequest: false,
  error: '',
};

const tradeInReducer = handleActions<TradeInStoreModel, TradeInPayload>(
  {
    GET_MODELS_BY_BRAND: (state) => {
      return { ...state, models: [], loadingModel: true };
    },
    GET_MODELS_BY_BRAND_SUCCEEDED: (state, action: Action<ModelsResponse>) => {
      return { ...state, models: action.payload, loadingModel: false };
    },
    GET_MODELS_BY_BRAND_FAILED: (state, action: Action<GetModelsByBrandFailedPayload>) => {
      return { ...state, error: action.payload, loadingModel: false, models: [] };
    },
    RESET_MODELS_BY_BRAND: (state) => {
      return { ...state, models: [] };
    },
    GET_BICYCLES_BY_BRAND_MODEL: (state) => {
      return { ...state, bicycles: [], loadingBicycle: true };
    },
    GET_BICYCLES_BY_BRAND_MODEL_SUCCEEDED: (state, action: Action<GetBicyclesByBrandModelSuccessPayload>) => {
      return { ...state, bicycles: action.payload, loadingBicycle: false };
    },
    GET_BICYCLES_BY_BRAND_MODEL_FAILED: (state, action: Action<GetBicyclesByBrandModelFailedPayload>) => {
      return { ...state, error: action.payload, loadingBicycle: false };
    },
    RESET_BICYCLES_BY_BRAND_MODEL: (state) => {
      return { ...state, bicycles: [] };
    },
    GET_CONDITIONS_BY_COMPONENTS: (state) => {
      return { ...state, conditions: null, loadingCondition: true };
    },
    GET_CONDITIONS_BY_COMPONENTS_SUCCEEDED: (state, action: Action<GetConditionsByComponentsSuccessPayload>) => {
      return { ...state, conditions: action.payload, loadingCondition: false };
    },
    GET_CONDITIONS_BY_COMPONENTS_FAILED: (state, action: Action<GetConditionsByComponentsFailedPayload>) => {
      return { ...state, error: action.payload, loadingCondition: false };
    },
    RESET_CONDITIONS_BY_COMPONENTS: (state) => {
      return { ...state, conditions: null };
    },
    GET_BRANDS_BY_TYPE: (state) => {
      return { ...state, brands: [], loadingBrand: true };
    },
    GET_BRANDS_BY_TYPE_SUCCEEDED: (state, action: Action<GetBrandsByTypeSuccessPayload>) => {
      return { ...state, brands: action.payload, loadingBrand: false };
    },
    GET_BRANDS_BY_TYPE_FAILED: (state, action: Action<GetBrandsByTypeFailedPayload>) => {
      return { ...state, error: action.payload, loadingBrand: false };
    },
    RESET_BRAND_BY_TYPE: (state) => {
      return { ...state, brands: [] };
    },
    REQUEST_TRADE_IN: (state) => {
      return { ...state, completeRequest: false, loadingRequest: true };
    },
    REQUEST_TRADE_IN_SUCCEEDED: (state) => {
      return { ...state, completeRequest: true, loadingRequest: false };
    },
    REQUEST_TRADE_IN_FAILED: (state, action: Action<RequestTradeInFailedPayload>) => {
      return { ...state, error: action.payload, completeRequest: false, loadingRequest: false };
    },
    RESET_REQUEST_TRADE_IN: (state) => {
      return { ...state, completeRequest: false, loadingRequest: false };
    },
  },
  INIT_STATE,
  {
    prefix: 'tradeIn',
  },
);

export default tradeInReducer;
