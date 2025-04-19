import { GetOffersDetailResponse } from 'store/marketplace/marketplace.action';
import { DataList, Product } from '../common';

export interface MarketplaceStoreModel {
  product: DataList<Partial<Product>>;
  loading: boolean;
  error: string;
  leftFilter?: any;
}

export interface DetailMarketplaceModel extends Partial<Product> {
  loading: boolean;
  error?: string;
  shipping?: {
    height: number;
    isFreeShip: boolean;
    length: number;
    weight: number;
    width: number;
  };
  allowLocalPickup?: boolean;
  isAllowReturn?: boolean;
  shippingFee?: number;
  offerCount?: number;
  sale?: SaleInformation;
  timeSold?: string;
  addressLine?: string;
  cityName?: string;
  stateCode?: string;
  stateName?: string;
  countryCode?: string;
  countryName?: string;
  zipCode?: string;
  returnWithinDays?: number;
  returnShippingPayer?: 'SELLER' | 'BUYER';
  listingType?: string;
  itemLocation?: string;
  oversizedShipping?: boolean;
  shippingProfileLabel?: string;
  dataOffersDetail: GetOffersDetailResponse;
}

export interface SaleInformation {
  apartment?: string;
  buyerDisplayName: string;
  buyerEmail: string;
  buyerId: string;
  buyerRole: string;
  cartType: string;
  createdTime: string;
  delete: boolean;
  discount: number;
  id: number;
  insurance: number;
  inventoryId: number;
  lineItemId: string;
  localPickup: boolean;
  marketPlaceId: number;
  orderCode: string;
  orderId: string;
  price: number;
  shippingAddressLine: string;
  shippingCity: string;
  shippingFee: number;
  shippingPhone: string;
  shippingPostalCode: string;
  shippingState: string;
  shippingCountryCode?: string;
  shippingType: string;
  soldDateTime: string;
  tax: number;
}
