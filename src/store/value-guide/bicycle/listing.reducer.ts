import { Action, handleActions } from 'redux-actions';
import {
  GetBicyclesByBrandModelFailedPayload,
  GetBicyclesByBrandModelSuccessPayload,
  GetBicyclesByContentFailedPayload,
  GetBicyclesByContentSuccessPayload,
  GetBicyclesByBrandFamilyNameSuccessPayload,
  GetBicyclesByBrandFamilyNameFailedPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { ListingBicycleStoreModel } from 'model/store/value-guide.model';
import { DataList } from 'model/common';

const INIT_STATE: ListingBicycleStoreModel = {
  bicycles: new DataList(),
  loading: false,
  error: '',
};

const reducer = handleActions<ListingBicycleStoreModel, ValueGuidePayload>(
  {
    GET_BICYCLES_BY_BRAND_MODEL: (state) => {
      return {
        ...state,
        error: '',
        bicycles: new DataList(),
        loading: true,
      };
    },
    GET_BICYCLES_BY_BRAND_MODEL_SUCCEEDED: (state, action: Action<GetBicyclesByBrandFamilyNameSuccessPayload>) => {
      return { ...state, bicycles: action.payload, loading: false };
    },
    GET_BICYCLES_BY_BRAND_MODEL_FAILED: (state, action: Action<GetBicyclesByBrandFamilyNameFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },

    GET_BICYCLES_BY_BRAND_FAMILY_NAME: (state) => {
      return {
        ...state,
        error: '',
        bicycles: new DataList(),
        loading: true,
      };
    },
    GET_BICYCLES_BY_BRAND_FAMILY_NAME_SUCCEEDED: (state, action: Action<GetBicyclesByBrandModelSuccessPayload>) => {
      return { ...state, bicycles: action.payload, loading: false };
    },
    GET_BICYCLES_BY_BRAND_FAMILY_NAME_FAILED: (state, action: Action<GetBicyclesByBrandModelFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },

    GET_BICYCLES_BY_CONTENT: (state) => {
      return {
        ...state,
        error: '',
        loading: true,
      };
    },
    GET_BICYCLES_BY_CONTENT_SUCCEEDED: (state, action: Action<GetBicyclesByContentSuccessPayload>) => {
      return { ...state, bicycles: action.payload, loading: false };
    },
    GET_BICYCLES_BY_CONTENT_BRAND_FAILED: (state, action: Action<GetBicyclesByContentFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
