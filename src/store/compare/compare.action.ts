import { createActions } from 'redux-actions';
import { Product } from '../../model/common';

export type ListComparePayload = Partial<Product>[];
export type ProductPayload = Partial<Product>;

export type ActionPayload = ListComparePayload | ProductPayload | string | number;

const {
  getListCompare,
  getListCompareSuccess,
  getListCompareFail,
  addToListCompare,
  addToListCompareSuccess,
  addToListCompareFail,
  removeFromListCompare,
  removeFromListCompareSuccess,
  removeFromListCompareFail,
} = createActions<ActionPayload>(
  {
    getListCompare: null,
    getListCompareSuccess: (payload: ListComparePayload) => payload,
    getListCompareFail: (err: string) => err,
    addToListCompare: (payload: ProductPayload) => payload,
    addToListCompareSuccess: (payload: ListComparePayload) => payload,
    addToListCompareFail: (err: string) => err,
    removeFromListCompare: (payload: number) => payload,
    removeFromListCompareSuccess: (payload: ListComparePayload) => payload,
    removeFromListCompareFail: (err: string) => err,
  },
  { prefix: 'compare' },
);

export default {
  getListCompare,
  getListCompareSuccess,
  getListCompareFail,
  addToListCompare,
  addToListCompareSuccess,
  addToListCompareFail,
  removeFromListCompare,
  removeFromListCompareSuccess,
  removeFromListCompareFail,
};
