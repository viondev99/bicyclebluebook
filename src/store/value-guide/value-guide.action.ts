/* eslint-disable import/named */
import { createActions } from 'redux-actions';
import {
  BicycleBaseComponentModel,
  BicycleBasicDetailModel,
  BicycleDetailModel,
  BicycleIdName,
  brandIdName,
  BrandModel,
  GetBrandYearModelParams,
  GetBrandYearModelResponse,
  GetLogoBrandValueGuideResponse,
  ModelBicycleModel,
  ModelModel,
  ModelValueGuideModelsResponse,
  RatingModel,
  RecommendModel,
} from 'model/store/value-guide.model';
import { ModelsResponse, TrackingEventControllerParams, YearModel } from 'model/api/value-guide.model';
import { DataList } from '../../model/common';

export type ValueGuideModelsResponse = ModelValueGuideModelsResponse[];
export type GetModelsByBrandIsBikePayload = {
  brand: string;
  isEbike?: boolean;
};
export type GetModelsByBrandPayload = string;
export type GetModelsByBrandSuccessPayload = ModelBicycleModel[];
export type GetModelsByBrandFailedPayload = string;

export type GetFamiliesByBrandParams = {
  brandId?: string;
  brandName?: string;
  isVGService?: boolean;
};

export type GetBicyclesByBrandModelPayload = {
  brand: number;
  model: number;
  page: number;
  size?: number;
};

export type GetBicyclesByBrandFamilyNamePayload = {
  brand: number;
  familyName: string;
  page: number;
  size?: number;
};

export type GetBicyclesByContentPayload = {
  content: string;
  page: number;
  size?: number;
};

export type GetBicyclesByContentSuccessPayload = DataList<BicycleBasicDetailModel>;
export type GetBicyclesByContentFailedPayload = string;

export type GetBicyclesByBrandFamilyNameSuccessPayload = DataList<BicycleBasicDetailModel>;
export type GetBicyclesByBrandFamilyNameFailedPayload = string;

export type GetBicyclesByBrandModelSuccessPayload = DataList<BicycleBasicDetailModel>;
export type GetBicyclesByBrandModelFailedPayload = string;

export type GetDetailBrandPayload = brandIdName;
export type GetDetailBrandSuccessPayload = BrandModel;
export type GetDetailBrandFailedPayload = string;

export type GetDetailModelPayload = string;
export type GetDetailModelSuccessPayload = ModelModel;
export type GetDetailModelFailedPayload = string;

export type GetDetailBicyclePayload = {
  idOrName?: string;
  isVGService?: boolean;
};
export type GetDetailBicycleSuccessPayload = BicycleDetailModel;
export type GetDetailBicycleFailedPayload = string;

export type GetRecommendedPayload = BicycleIdName;
export type GetRecommendedSuccessPayload = RecommendModel[];
export type GetRecommendedFailedPayload = string;

export type GetRatingPayload = { bicycleId: string; page?: string; sortType?: string };
export type GetRatingSuccessPayload = RatingModel;
export type GetRatingFailedPayload = string;

export type StoreRatingPayload = {
  bicycleId: string;
  rate: number;
  title: string;
  comment: string;
};
export type StoreRatingSuccessPayload = any;
export type StoreRatingFailedPayload = string;

export type GetBaseComponentPayload = null;
export type GetBaseComponentParams = {
  isVGService?: boolean;
};
export type GetBaseComponentSuccessPayload = BicycleBaseComponentModel;
export type GetBaseComponentFailedPayload = string;

export type GetBrandFromYearModelSuccesspayload = YearModel[];
export type GetBrandFromYearModelFailedPayload = string;

export type ValueGuidePayload =
  | GetModelsByBrandPayload
  | GetModelsByBrandIsBikePayload
  | GetModelsByBrandSuccessPayload
  | GetModelsByBrandFailedPayload
  | GetDetailBrandPayload
  | GetDetailBrandSuccessPayload
  | GetDetailBrandFailedPayload
  | GetDetailModelPayload
  | GetDetailModelSuccessPayload
  | GetBicyclesByBrandModelPayload
  | GetBicyclesByBrandModelSuccessPayload
  | GetBicyclesByBrandModelFailedPayload
  | GetBicyclesByBrandFamilyNamePayload
  | GetBicyclesByBrandFamilyNameSuccessPayload
  | GetBicyclesByBrandFamilyNameFailedPayload
  | GetBicyclesByContentPayload
  | GetBicyclesByContentSuccessPayload
  | GetBicyclesByContentFailedPayload
  | GetDetailBicyclePayload
  | GetDetailBicycleSuccessPayload
  | GetDetailBicycleFailedPayload
  | GetRecommendedPayload
  | GetRecommendedSuccessPayload
  | GetRecommendedFailedPayload
  | GetRatingPayload
  | GetRatingSuccessPayload
  | GetRatingFailedPayload
  | StoreRatingPayload
  | StoreRatingSuccessPayload
  | StoreRatingFailedPayload
  | GetBaseComponentPayload
  | GetBaseComponentParams
  | GetBaseComponentSuccessPayload
  | GetBaseComponentFailedPayload
  | Array<string>
  | GetBrandYearModelParams
  | GetLogoBrandValueGuideResponse
  | GetBrandFromYearModelSuccesspayload
  | GetBrandFromYearModelFailedPayload
  | TrackingEventControllerParams;

export const {
  valueGuideGetModelByBrandId,
  valueGuideGetModelByBrandIdSucceeded,
  valueGuideGetModelByBrandIdFailed,
  getModelsByBrand,
  getModelsByBrandSucceeded,
  getModelsByBrandFailed,
  resetModelsByBrand,
  getFamiliesByBrand,
  getFamiliesByBrandSucceeded,
  getFamiliesByBrandFailed,
  resetFamiliesByBrand,
  getDetailBrand,
  getDetailBrandSucceeded,
  getDetailBrandFailed,
  getDetailModel,
  getDetailModelSucceeded,
  getDetailModelFailed,
  getBicyclesByBrandFamilyName,
  getBicyclesByBrandFamilyNameSucceeded,
  getBicyclesByBrandFamilyNameFailed,
  getBicyclesByBrandModel,
  getBicyclesByBrandModelSucceeded,
  getBicyclesByBrandModelFailed,
  getBicyclesByContent,
  getBicyclesByContentSucceeded,
  getBicyclesByContentFailed,
  getDetailBicycle,
  getDetailBicycleSucceeded,
  getDetailBicycleFailed,
  getRecommended,
  getRecommendedSucceeded,
  getRecommendedFailed,
  getRating,
  getRatingSucceeded,
  getRatingFailed,
  storeRating,
  storeRatingSucceeded,
  storeRatingFailed,
  getBaseComponent,
  getBaseComponentSucceeded,
  getBaseComponentFailed,
  addToFavourite,
  addToFavouriteSucceeded,
  addToFavouriteFailed,
  removeFromFavourite,
  removeFromFavouriteSucceeded,
  removeFromFavouriteFailed,
  getBrandYearModelV2,
  getBrandYearModelV2Succeeded,
  getBrandYearModelV2Failed,
  saveBrandYearModelV2,
  saveBrandIdSearchValueGuide,
  saveSelectedProductId,
  getLogoBrandValueGuide,
  getLogoBrandValueGuideSucceeded,
  getLogoBrandValueGuideFailed,
  getBrandFromYearModel,
  getBrandFromYearModelSucceeded,
  getBrandFromYearModelFailed,
  trackingEventController,
  trackingEventControllerSucceeded,
  trackingEventControllerFailed,
} = createActions<ValueGuidePayload>(
  {
    VALUE_GUIDE_GET_MODEL_BY_BRAND_ID: (payload: GetModelsByBrandPayload) => payload,
    VALUE_GUIDE_GET_MODEL_BY_BRAND_ID_SUCCEEDED: (payload: GetModelsByBrandSuccessPayload) => payload,
    VALUE_GUIDE_GET_MODEL_BY_BRAND_ID_FAILED: null,
    GET_MODELS_BY_BRAND: (payload: GetModelsByBrandPayload) => payload,
    GET_MODELS_BY_BRAND_SUCCEEDED: (payload: GetModelsByBrandSuccessPayload) => payload,
    GET_MODELS_BY_BRAND_FAILED: (payload: GetModelsByBrandFailedPayload) => payload,
    RESET_MODELS_BY_BRAND: null,

    GET_FAMILIES_BY_BRAND: (payload: GetFamiliesByBrandParams) => payload,
    GET_FAMILIES_BY_BRAND_SUCCEEDED: (payload: Array<string>) => payload,
    GET_FAMILIES_BY_BRAND_FAILED: (payload: GetModelsByBrandFailedPayload) => payload,
    RESET_FAMILIES_BY_BRAND: null,

    GET_DETAIL_BRAND: (payload: GetDetailBrandPayload) => payload,
    GET_DETAIL_BRAND_SUCCEEDED: (payload: GetDetailBrandSuccessPayload) => payload,
    GET_DETAIL_BRAND_FAILED: (payload: GetDetailBrandFailedPayload) => payload,

    GET_DETAIL_MODEL: (payload: GetDetailModelPayload) => payload,
    GET_DETAIL_MODEL_SUCCEEDED: (payload: GetDetailModelSuccessPayload) => payload,
    GET_DETAIL_MODEL_FAILED: (payload: GetDetailModelFailedPayload) => payload,

    GET_BICYCLES_BY_BRAND_MODEL: (payload: GetBicyclesByBrandModelPayload) => payload,
    GET_BICYCLES_BY_BRAND_MODEL_SUCCEEDED: (payload: GetBicyclesByBrandModelSuccessPayload) => payload,
    GET_BICYCLES_BY_BRAND_MODEL_FAILED: (payload: GetBicyclesByBrandModelFailedPayload) => payload,

    GET_BICYCLES_BY_BRAND_FAMILY_NAME: (payload: GetBicyclesByBrandFamilyNamePayload) => payload,
    GET_BICYCLES_BY_BRAND_FAMILY_NAME_SUCCEEDED: (payload: GetBicyclesByBrandFamilyNameSuccessPayload) => payload,
    GET_BICYCLES_BY_BRAND_FAMILY_NAME_FAILED: (payload: GetBicyclesByBrandFamilyNameFailedPayload) => payload,

    GET_BICYCLES_BY_CONTENT: (payload: GetBicyclesByContentPayload) => payload,
    GET_BICYCLES_BY_CONTENT_SUCCEEDED: (payload: GetBicyclesByContentSuccessPayload) => payload,
    GET_BICYCLES_BY_CONTENT_FAILED: (payload: GetBicyclesByContentFailedPayload) => payload,

    GET_DETAIL_BICYCLE: (payload: GetDetailBicyclePayload) => payload,
    GET_DETAIL_BICYCLE_SUCCEEDED: (payload: GetDetailBicycleSuccessPayload) => payload,
    GET_DETAIL_BICYCLE_FAILED: (payload: GetDetailBicycleFailedPayload) => payload,

    GET_RECOMMENDED: (payload: GetRecommendedPayload) => payload,
    GET_RECOMMENDED_SUCCEEDED: (payload: GetRecommendedSuccessPayload) => payload,
    GET_RECOMMENDED_FAILED: (payload: GetRecommendedFailedPayload) => payload,

    GET_RATING: (payload: GetRatingPayload) => payload,
    GET_RATING_SUCCEEDED: (payload: GetRatingSuccessPayload) => payload,
    GET_RATING_FAILED: (payload: GetRatingFailedPayload) => payload,

    STORE_RATING: (payload: StoreRatingPayload) => payload,
    STORE_RATING_SUCCEEDED: (payload: StoreRatingSuccessPayload) => payload,
    STORE_RATING_FAILED: (payload: StoreRatingFailedPayload) => payload,

    GET_BASE_COMPONENT: (payload: GetBaseComponentParams) => payload,
    GET_BASE_COMPONENT_SUCCEEDED: (payload: GetBaseComponentSuccessPayload) => payload,
    GET_BASE_COMPONENT_FAILED: (payload: GetBaseComponentFailedPayload) => payload,

    GET_BRAND_YEAR_MODEL_V2: (payload: GetBrandYearModelParams) => payload,
    GET_BRAND_YEAR_MODEL_V2_SUCCEEDED: (payload: GetBrandYearModelResponse) => payload,
    GET_BRAND_YEAR_MODEL_V2_FAILED: (payload: StoreRatingFailedPayload) => payload,

    SAVE_BRAND_YEAR_MODEL_V2: (payload?: GetBrandYearModelResponse) => payload,

    SAVE_BRAND_ID_SEARCH_VALUE_GUIDE: (id: string) => id,

    SAVE_SELECTED_PRODUCT_ID: (id: string) => id,

    GET_LOGO_BRAND_VALUE_GUIDE: (payload: string) => payload,
    GET_LOGO_BRAND_VALUE_GUIDE_SUCCEEDED: (payload: GetLogoBrandValueGuideResponse) => payload,
    GET_LOGO_BRAND_VALUE_GUIDE_FAILED: () => null,

    GET_BRAND_FROM_YEAR_MODEL: (payload: boolean) => payload,
    GET_BRAND_FROM_YEAR_MODEL_SUCCEEDED: (payload: GetBrandFromYearModelSuccesspayload) => payload,
    GET_BRAND_FROM_YEAR_MODEL_FAILED: (payload: GetBrandFromYearModelFailedPayload) => payload,

    GET_MODEL_BY_BRAND: (payload: string) => payload,
    GET_MODEL_BY_BRAND_SUCCEEDED: (payload: ModelsResponse) => payload,
    GET_MODEL_BY_BRAND_FAILED: null,

    TRACKING_EVENT_CONTROLLER: (payload: TrackingEventControllerParams) => payload,
    TRACKING_EVENT_CONTROLLER_SUCCEEDED: (payload: unknown) => payload,
    TRACKING_EVENT_CONTROLLER_FAILED: (payload: unknown) => payload,
  },
  {
    prefix: 'valueGuide',
  },
);
export const {
  getBrandFromYearModelRedBarn,
  getBrandFromYearModelRedBarnSucceeded,
  getBrandFromYearModelRedBarnFailed,
} = createActions<ValueGuidePayload>(
  {
    GET_BRAND_FROM_YEAR_MODEL_RED_BARN: null,
    GET_BRAND_FROM_YEAR_MODEL_RED_BARN_SUCCEEDED: (payload: GetBrandFromYearModelSuccesspayload) => payload,
    GET_BRAND_FROM_YEAR_MODEL_RED_BARN_FAILED: (payload: GetBrandFromYearModelFailedPayload) => payload,
  },
  {
    prefix: 'valueGuide',
  },
);
