import { Product } from 'model/common';

export enum MarketType {
  BBB = 'BBB',
}

export interface ProductRecentViewModel {
  id: number;
  marketType: MarketType;
  timeViewed: string;
}

export interface ProductRecentViewStoreModel {
  productRecentViews: ProductRecentViewModel[];
  productDetailRecentViews: Partial<Product>[];
  loading: boolean;
  error: string;
}
