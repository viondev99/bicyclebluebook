import { createActions } from 'redux-actions';
import {
  ModelBicycleModel,
  BicycleBasicDetailModel,
  ConditionsBicycleModel,
  TradeInValuesModel,
  BrandBicycleModel,
} from 'model/store/trade-in.model';
import { ModelsResponse } from 'model/api/value-guide.model';

export type GetModelsByBrandPayload = string;
export type GetModelsByBrandIsBikePayload = {
  brand: string;
  isEbike?: boolean;
  isVGService?: boolean;
};
export type GetModelsByBrandSuccessPayload = ModelBicycleModel[];
export type GetModelsByBrandFailedPayload = string;

export type GetBicyclesByBrandModelPayload = {
  brand: string;
  model: string;
};
export type GetBicyclesByBrandModelSuccessPayload = BicycleBasicDetailModel[];
export type GetBicyclesByBrandModelFailedPayload = string;

export type GetConditionsByComponentsPayload = {
  brand: string;
  model: string;
  year: string;
};
export type GetConditionsByComponentsSuccessPayload = ConditionsBicycleModel;
export type GetConditionsByComponentsFailedPayload = string;

export type GetBrandsByTypePayload = string;
export type GetBrandsByTypeSuccessPayload = BrandBicycleModel[];
export type GetBrandsByTypeFailedPayload = string;

export type RequestTradeInPayload = {
  bike: {
    brand: string;
    model: string;
    year: string;
    id?: number;
  };
  tradeInValues?: Partial<TradeInValuesModel>;
  bikeWantPurchase: {
    type: string;
    brand: string;
  };
  name: string;
  email: string;
  zipCode: string;
  phone: string;
  condition?: string;
  tradeInValue?: number;
};
export type RequestTradeInFailedPayload = string;

export type TradeInPayload =
  | GetModelsByBrandPayload
  | GetModelsByBrandSuccessPayload
  | GetModelsByBrandFailedPayload
  | GetBicyclesByBrandModelPayload
  | GetBicyclesByBrandModelSuccessPayload
  | GetBicyclesByBrandModelFailedPayload
  | GetConditionsByComponentsPayload
  | GetConditionsByComponentsSuccessPayload
  | GetConditionsByComponentsFailedPayload
  | GetBrandsByTypePayload
  | GetBrandsByTypeSuccessPayload
  | GetBrandsByTypeFailedPayload
  | RequestTradeInPayload
  | RequestTradeInFailedPayload
  | ModelsResponse;

export const {
  getModelsByBrand,
  getModelsByBrandSucceeded,
  getModelsByBrandFailed,
  resetModelsByBrand,
  getBicyclesByBrandModel,
  getBicyclesByBrandModelSucceeded,
  getBicyclesByBrandModelFailed,
  resetBicyclesByBrandModel,
  getConditionsByComponents,
  getConditionsByComponentsSucceeded,
  getConditionsByComponentsFailed,
  resetConditionsByComponents,
  getBrandsByType,
  getBrandsByTypeSucceeded,
  getBrandByTypeFailed,
  resetBrandByType,
  requestTradeIn,
  requestTradeInSucceeded,
  requestTradeInFailed,
  resetRequestTradeIn,
} = createActions<TradeInPayload>(
  {
    GET_MODELS_BY_BRAND: (payload: GetModelsByBrandPayload) => payload,
    GET_MODELS_BY_BRAND_SUCCEEDED: (payload: ModelsResponse) => payload,
    GET_MODELS_BY_BRAND_FAILED: (payload: GetModelsByBrandFailedPayload) => payload,
    RESET_MODELS_BY_BRAND: null,
    GET_BICYCLES_BY_BRAND_MODEL: (payload: GetBicyclesByBrandModelPayload) => payload,
    GET_BICYCLES_BY_BRAND_MODEL_SUCCEEDED: (payload: GetBicyclesByBrandModelSuccessPayload) => payload,
    GET_BICYCLES_BY_BRAND_MODEL_FAILED: (payload: GetBicyclesByBrandModelFailedPayload) => payload,
    RESET_BICYCLES_BY_BRAND_MODEL: null,
    GET_CONDITIONS_BY_COMPONENTS: (payload: GetConditionsByComponentsPayload) => payload,
    GET_CONDITIONS_BY_COMPONENTS_SUCCEEDED: (payload: GetConditionsByComponentsSuccessPayload) => payload,
    GET_CONDITIONS_BY_COMPONENTS_FAILED: (payload: GetConditionsByComponentsFailedPayload) => payload,
    RESET_CONDITIONS_BY_COMPONENTS: null,
    GET_BRANDS_BY_TYPE: (payload: GetBrandsByTypePayload) => payload,
    GET_BRANDS_BY_TYPE_SUCCEEDED: (payload: GetBrandsByTypeSuccessPayload) => payload,
    GET_BRANDS_BY_TYPE_FAILED: (payload: GetBrandsByTypeFailedPayload) => payload,
    RESET_BRAND_BY_TYPE: null,
    REQUEST_TRADE_IN: (payload: RequestTradeInPayload) => payload,
    REQUEST_TRADE_IN_SUCCEEDED: null,
    REQUEST_TRADE_IN_FAILED: (payload: RequestTradeInFailedPayload) => payload,
    RESET_REQUEST_TRADE_IN: null,
  },
  {
    prefix: 'tradeIn',
  },
);
