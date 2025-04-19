import { Action, handleActions } from 'redux-actions';
import {
  GetRecommendedFailedPayload,
  GetRecommendedSuccessPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { RecommendStoreModel } from 'model/store/value-guide.model';
import { ProductRecentViewStoreModel } from '../../../model/store/recent-view/product/product.model';
import { mergeReducer } from '../../../helpers/hor/merge-reducer';

const INIT_STATE: RecommendStoreModel = {
  recommended: [],
  loading: false,
  error: '',
};

const reducer = handleActions<RecommendStoreModel, ValueGuidePayload>(
  {
    GET_RECOMMENDED: (state, action) => {
      return {
        ...state,
        recommended: [],
        loading: true,
      };
    },
    GET_RECOMMENDED_SUCCEEDED: (state, action: Action<GetRecommendedSuccessPayload>) => {
      return {
        ...state,
        recommended: action.payload,
        loading: false,
      };
    },
    GET_RECOMMENDED_FAILED: (state, action: Action<GetRecommendedFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

const handleFavourite = handleActions<RecommendStoreModel, number>(
  {
    ADD_TO_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      return {
        ...state,
        recommended: state.recommended.map((i) => {
          if (i.masterListingId === action.payload) {
            return { ...i, favourite: true };
          }
          return i;
        }),
      };
    },
    REMOVE_FROM_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      return {
        ...state,
        recommended: state.recommended.map((i) => {
          if (i.masterListingId === action.payload) {
            return { ...i, favourite: false };
          }
          return i;
        }),
      };
    },
  },
  INIT_STATE,
  { prefix: 'marketplace' },
);

export default mergeReducer(reducer, handleFavourite);
