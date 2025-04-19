import { Action, handleActions } from 'redux-actions';
import {
  GetDetailBrandFailedPayload,
  GetDetailBrandSuccessPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { DetailBrandStoreModel } from 'model/store/value-guide.model';

const INIT_STATE: DetailBrandStoreModel = {
  brand: null,
  loading: false,
  error: '',
};

const reducer = handleActions<DetailBrandStoreModel, ValueGuidePayload>(
  {
    GET_DETAIL_BRAND: (state) => {
      return { ...state, brand: null, loading: true };
    },
    GET_DETAIL_BRAND_SUCCEEDED: (state, action: Action<GetDetailBrandSuccessPayload>) => {
      return { ...state, brand: action.payload, loading: true };
    },
    GET_DETAIL_BRAND_FAILED: (state, action: Action<GetDetailBrandFailedPayload>) => {
      return { ...state, error: action.payload, loading: true };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
