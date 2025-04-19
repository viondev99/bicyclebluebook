import { Action, handleActions } from 'redux-actions';
import {
  GetModelsByBrandFailedPayload,
  GetModelsByBrandSuccessPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import {
  GetBrandYearModelResponse,
  GetLogoBrandValueGuideResponse,
  ListingModelStoreModel,
} from 'model/store/value-guide.model';

const INIT_STATE: ListingModelStoreModel = {
  models: [],
  valueGuideModels: [],
  dataBrandYearModel: null,
  brandIdSearchValueGuide: '',
  selectedProductId: '',
  dataLogoBrandValueGuide: null,
  loading: false,
  error: '',
};

const reducer = handleActions<ListingModelStoreModel, ValueGuidePayload>(
  {
    GET_LOGO_BRAND_VALUE_GUIDE: (state) => {
      return { ...state };
    },
    GET_LOGO_BRAND_VALUE_GUIDE_SUCCEEDED: (state, action: Action<GetLogoBrandValueGuideResponse>) => {
      return { ...state, dataLogoBrandValueGuide: action.payload };
    },
    GET_LOGO_BRAND_VALUE_GUIDE_FAILED: (state) => {
      return { ...state, dataLogoBrandValueGuide: null };
    },

    SAVE_SELECTED_PRODUCT_ID: (state, action: Action<string>) => {
      return { ...state, selectedProductId: action.payload };
    },
    SAVE_BRAND_ID_SEARCH_VALUE_GUIDE: (state, action: Action<string>) => {
      return { ...state, brandIdSearchValueGuide: action.payload };
    },
    GET_BRAND_YEAR_MODEL_V2: (state) => {
      return { ...state, loading: true };
    },
    GET_BRAND_YEAR_MODEL_V2_SUCCEEDED: (state, action: Action<GetBrandYearModelResponse>) => {
      return { ...state, dataBrandYearModel: action.payload, loading: false };
    },
    GET_BRAND_YEAR_MODEL_V2_FAILED: (state) => {
      return { ...state, valueGuideModels: [], loading: false };
    },
    VALUE_GUIDE_GET_MODEL_BY_BRAND_ID: (state) => {
      return { ...state, valueGuideModels: [], loading: true };
    },
    VALUE_GUIDE_GET_MODEL_BY_BRAND_ID_SUCCEEDED: (state, action: Action<GetModelsByBrandSuccessPayload>) => {
      return { ...state, valueGuideModels: action.payload, loading: false };
    },
    VALUE_GUIDE_GET_MODEL_BY_BRAND_ID_FAILED: (state, action: Action<GetModelsByBrandFailedPayload>) => {
      return { ...state, error: action.payload, valueGuideModels: [], loading: false };
    },
    GET_MODELS_BY_BRAND: (state) => {
      return { ...state, models: [], loading: true };
    },
    GET_MODELS_BY_BRAND_SUCCEEDED: (state, action: Action<GetModelsByBrandSuccessPayload>) => {
      return { ...state, models: action.payload, loading: false };
    },
    GET_MODELS_BY_BRAND_FAILED: (state, action: Action<GetModelsByBrandFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },
    RESET_MODELS_BY_BRAND: (state) => {
      return { ...state, models: [], valueGuideModels: [] };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
