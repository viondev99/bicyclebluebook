import { Product } from '../common';

export interface CompareStore {
  listCompare: Partial<Product>[];
  loading: boolean;
  error: string;
}
