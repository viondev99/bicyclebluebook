import { Product } from '../common';

export interface HomeStoreModel {
  recommended: Partial<Product>[];
  error: string;
  loadingRecommended: boolean;
}
