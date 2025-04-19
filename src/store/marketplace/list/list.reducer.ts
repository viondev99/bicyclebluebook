import { Action, handleActions } from 'redux-actions';
import { MarketplaceStoreModel } from '../../../model/store/marketplace.model';
import { DataList, Product } from '../../../model/common';
import { MarketplacePayload } from '../marketplace.action';
import { mergeReducer } from '../../../helpers/hor/merge-reducer';

const INIT_STATE: MarketplaceStoreModel = {
  product: new DataList(),
  loading: true,
  leftFilter: null,
  error: '',
};

const marketplaceReducer = handleActions<MarketplaceStoreModel, MarketplacePayload>(
  {
    GET_PRODUCTS: (state, action) => {
      return {
        ...state,
        loading: true,
        product: new DataList(),
      };
    },
    GET_PRODUCT_SUCCEEDED: (state, action: Action<DataList<Product>>) => {
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    },
    GET_PRODUCT_FAILED: (state, action: Action<string>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
  },
  INIT_STATE,
  { prefix: 'marketplace' },
);

const handleFavourite = handleActions<MarketplaceStoreModel, number>(
  {
    ADD_TO_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      return {
        ...state,
        product: {
          ...state.product,
          data: state.product.data.map((i) => {
            if (i.masterListingId === action.payload) {
              return { ...i, favourite: true };
            }
            return i;
          }),
        },
      };
    },
    REMOVE_FROM_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      return {
        ...state,
        product: {
          ...state.product,
          data: state.product.data.map((i) => {
            if (i.masterListingId === action.payload) {
              return { ...i, favourite: false };
            }
            return i;
          }),
        },
      };
    },
    ADD_FILTER: (state, action: Action<any>) => {
      return {
        ...state,
        leftFilter: action?.payload,
      };
    },
  },
  INIT_STATE,
  { prefix: 'marketplace' },
);

export default mergeReducer<MarketplaceStoreModel>(marketplaceReducer, handleFavourite);
