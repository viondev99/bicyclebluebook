import { Action, handleActions } from 'redux-actions';
import { GetModelsByBrandFailedPayload, ValueGuidePayload } from 'store/value-guide/value-guide.action';
import { ListingFamilyStoreModel } from 'model/store/value-guide.model';

const INIT_STATE: ListingFamilyStoreModel = {
  families: [],
  loading: false,
  error: '',
};

const reducer = handleActions<ListingFamilyStoreModel, ValueGuidePayload>(
  {
    GET_FAMILIES_BY_BRAND: (state) => {
      return { ...state, families: [], loading: true };
    },
    GET_FAMILIES_BY_BRAND_SUCCEEDED: (state, action: Action<Array<string>>) => {
      return { ...state, families: action.payload, loading: false };
    },
    GET_FAMILIES_BY_BRAND_FAILED: (state, action: Action<GetModelsByBrandFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },
    RESET_FAMILIES_BY_BRAND: (state) => {
      return { ...state, families: [] };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
