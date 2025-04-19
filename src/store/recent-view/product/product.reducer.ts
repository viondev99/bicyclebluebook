import { Action, handleActions } from 'redux-actions';

import { ProductRecentViewStoreModel } from '../../../model/store/recent-view/product/product.model';
import {
  ProductRecentViewPayload,
  AddProductRecentViewSuccessPayload,
  AddProductRecentViewFailedPayload,
  GetProductRecentViewsSuccessPayload,
  GetProductRecentViewsFailedPayload,
} from './product.action';
import { mergeReducer } from '../../../helpers/hor/merge-reducer';

const INIT_STATE: ProductRecentViewStoreModel = {
  productRecentViews: [],
  productDetailRecentViews: [],
  loading: false,
  error: '',
};

const productRecentViewReducer = handleActions<ProductRecentViewStoreModel, ProductRecentViewPayload>(
  {
    ADD_PRODUCT_RECENT_VIEW: (state) => {
      return { ...state, loading: true };
    },
    ADD_PRODUCT_RECENT_VIEW_SUCCEEDED: (state, action: Action<AddProductRecentViewSuccessPayload>) => {
      return { ...state, productRecentViews: action.payload, loading: false };
    },
    ADD_PRODUCT_RECENT_VIEW_FAILED: (state, action: Action<AddProductRecentViewFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },
    GET_PRODUCT_RECENT_VIEWS: (state) => {
      return { ...state, loading: true };
    },
    GET_PRODUCT_RECENT_VIEWS_SUCCEEDED: (state, action: Action<GetProductRecentViewsSuccessPayload>) => {
      return { ...state, productDetailRecentViews: action.payload, loading: false };
    },
    GET_PRODUCT_RECENT_VIEWS_FAILED: (state, action: Action<GetProductRecentViewsFailedPayload>) => {
      return { ...state, error: action.payload, loading: false };
    },
    REMOVE_PRODUCT_RECENT_VIEWS: (state) => {
      return { ...state, productRecentViews: [], loading: false };
    },
  },
  INIT_STATE,
  {
    prefix: 'recentView',
  },
);

const handleFavourite = handleActions<ProductRecentViewStoreModel, number>(
  {
    ADD_TO_FAVOURITE_SUCCEEDED: (state, action: Action<number>) => {
      return {
        ...state,
        productDetailRecentViews: state.productDetailRecentViews.map((i) => {
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
        productDetailRecentViews: state.productDetailRecentViews.map((i) => {
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

export default mergeReducer<ProductRecentViewStoreModel>(productRecentViewReducer, handleFavourite);
