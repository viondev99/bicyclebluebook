import { Action, handleActions } from 'redux-actions';
import {
  GetDetailBicycleFailedPayload,
  GetDetailBicycleSuccessPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { DetailBicycleStoreModel } from 'model/store/value-guide.model';

const INIT_STATE: DetailBicycleStoreModel = {
  bicycle: null,
  loading: true,
  error: '',
};

const reducer = handleActions<DetailBicycleStoreModel, ValueGuidePayload>(
  {
    GET_DETAIL_BICYCLE: (state) => {
      return { ...state, error: '', bicycle: null, loading: true };
    },
    GET_DETAIL_BICYCLE_SUCCEEDED: (state, action: Action<GetDetailBicycleSuccessPayload>) => {
      return { ...state, bicycle: action.payload, loading: false };
    },
    GET_DETAIL_BICYCLE_FAILED: (state, action: Action<GetDetailBicycleFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
