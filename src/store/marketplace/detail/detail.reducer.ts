import { Action, ActionMeta, handleActions } from 'redux-actions';
import { DetailMarketplaceModel } from 'model/store/marketplace.model';
import { mergeReducer } from 'helpers/hor/merge-reducer';
import {
  GetDetailMeta,
  GetDetailProductSucceededPayload,
  GetOffersDetailResponse,
  MarketplacePayload,
} from '../marketplace.action';

const INIT_STATE_DETAIL: DetailMarketplaceModel = {
  loading: true,
  error: null,
  shipping: null,
  allowLocalPickup: false,
  dataOffersDetail: null,
};

const detailMarketplaceReducer = handleActions<DetailMarketplaceModel, MarketplacePayload>(
  {
    GET_DETAIL_PRODUCT: (state, action: ActionMeta<number, GetDetailMeta>) => {
      if (action.meta?.silentLoad) {
        return state;
      }
      return INIT_STATE_DETAIL;
    },
    GET_DETAIL_PRODUCT_SUCCEEDED: (state, action: Action<GetDetailProductSucceededPayload>) => {
      return {
        ...state,
        ...action.payload,
        error: null,
        loading: false,
      };
    },
    GET_DETAIL_PRODUCT_FAILED: (state, action: Action<string>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
    GET_LIST_OFFERS_DETAIL: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_OFFERS_DETAIL_SUCCEEDED: (state, action: Action<GetOffersDetailResponse>) => {
      return {
        ...state,
        dataOffersDetail: action.payload,
        loading: false,
      };
    },
    GET_LIST_OFFERS_DETAIL_FAILED: (state) => {
      return {
        ...state,
        dataOffersDetail: null,
        loading: false,
      };
    },
  },
  INIT_STATE_DETAIL,
  {
    prefix: 'marketplace',
  },
);

const handleFavourite = handleActions<DetailMarketplaceModel, number>(
  {
    ADD_TO_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      if (action.payload === state.masterListingId) {
        return {
          ...state,
          favourite: true,
        };
      }
      return state;
    },
    REMOVE_FROM_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      if (action.payload === state.masterListingId) {
        return {
          ...state,
          favourite: false,
        };
      }
      return state;
    },
  },
  INIT_STATE_DETAIL,
  { prefix: 'marketplace' },
);

export default mergeReducer<DetailMarketplaceModel>(detailMarketplaceReducer, handleFavourite);
