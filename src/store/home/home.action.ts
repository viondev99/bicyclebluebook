import { createActions } from 'redux-actions';
import { Product } from '../../model/common';

export type GetRecommendedPayload = {
  isGuest: boolean;
};
export type GetRecommendedSuccessPayload = Partial<Product>[];
export type GetRecommendedFailedPayload = string;

export type HomePayload = GetRecommendedPayload | GetRecommendedSuccessPayload | GetRecommendedFailedPayload;

export const { getRecommended, getRecommendedSucceeded, getRecommendedFailed } = createActions<HomePayload>(
  {
    getRecommended: (payload?: GetRecommendedPayload) => payload,
    getRecommendedSucceeded: (payload: GetRecommendedSuccessPayload) => payload,
    getRecommendedFailed: (payload: GetRecommendedFailedPayload) => payload,
  },
  {
    prefix: 'home',
  },
);
