import { Action, handleActions } from 'redux-actions';
import {
  GetDetailModelFailedPayload,
  GetDetailModelSuccessPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { DetailModelStoreModel } from 'model/store/value-guide.model';

const INIT_STATE: DetailModelStoreModel = {
  model: null,
  loading: false,
  error: '',
};

const reducer = handleActions<DetailModelStoreModel, ValueGuidePayload>(
  {
    GET_DETAIL_MODEL: (state) => {
      return { ...state, model: null, loading: true };
    },
    GET_DETAIL_MODEL_SUCCEEDED: (state, action: Action<GetDetailModelSuccessPayload>) => {
      return { ...state, model: action.payload, loading: true };
    },
    GET_DETAIL_MODEL_FAILED: (state, action: Action<GetDetailModelFailedPayload>) => {
      return { ...state, error: action.payload, loading: true };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
