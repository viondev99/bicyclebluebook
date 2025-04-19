import { Action, handleActions } from 'redux-actions';
import { GetRecommendedFailedPayload, GetRecommendedSuccessPayload, HomePayload } from './home.action';
import { HomeStoreModel } from '../../model/store/home.model';
import { mergeReducer } from '../../helpers/hor/merge-reducer';

const INIT_STATE: HomeStoreModel = {
  recommended: [],
  error: '',
  loadingRecommended: false,
};

const reducer = handleActions<HomeStoreModel, HomePayload>(
  {
    getRecommended: (state, action) => {
      return {
        ...state,
        recommended: [],
        loadingRecommended: true,
      };
    },
    getRecommendedSucceeded: (state, action: Action<GetRecommendedSuccessPayload>) => {
      return {
        ...state,
        recommended: action.payload,
        loadingRecommended: false,
      };
    },
    getRecommendedFailed: (state, action: Action<GetRecommendedFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loadingRecommended: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'home',
  },
);

const handleFavourite = handleActions<HomeStoreModel, number>(
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

export default mergeReducer<HomeStoreModel>(reducer, handleFavourite);
