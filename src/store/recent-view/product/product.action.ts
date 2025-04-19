import { createActions } from 'redux-actions';

import { ProductRecentViewModel } from 'model/store/recent-view/product/product.model';
import { Product } from 'model/common';

export type AddProductRecentViewPayload = ProductRecentViewModel;
export type AddProductRecentViewSuccessPayload = ProductRecentViewModel[];
export type AddProductRecentViewFailedPayload = string;

export type GetProductRecentViewsPayload = ProductRecentViewModel[];
export type GetProductRecentViewsSuccessPayload = Partial<Product>[];
export type GetProductRecentViewsFailedPayload = string;

export type ProductRecentViewPayload =
  | AddProductRecentViewPayload
  | AddProductRecentViewSuccessPayload
  | AddProductRecentViewFailedPayload
  | GetProductRecentViewsPayload
  | GetProductRecentViewsSuccessPayload
  | GetProductRecentViewsFailedPayload;

export const {
  addProductRecentView,
  addProductRecentViewSucceeded,
  addProductRecentViewFailed,
  getProductRecentViews,
  getProductRecentViewsSucceeded,
  getProductRecentViewsFailed,
  removeProductRecentViews,
} = createActions<ProductRecentViewPayload>(
  {
    ADD_PRODUCT_RECENT_VIEW: (payload: AddProductRecentViewPayload) => payload,
    ADD_PRODUCT_RECENT_VIEW_SUCCEEDED: (payload: AddProductRecentViewSuccessPayload) => payload,
    ADD_PRODUCT_RECENT_VIEW_FAILED: (payload: AddProductRecentViewFailedPayload) => payload,
    GET_PRODUCT_RECENT_VIEWS: (payload: GetProductRecentViewsPayload) => payload,
    GET_PRODUCT_RECENT_VIEWS_SUCCEEDED: (payload: GetProductRecentViewsSuccessPayload) => payload,
    GET_PRODUCT_RECENT_VIEWS_FAILED: (payload: GetProductRecentViewsFailedPayload) => payload,
    REMOVE_PRODUCT_RECENT_VIEWS: null,
  },
  {
    prefix: 'recentView',
  },
);
