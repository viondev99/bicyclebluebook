import { NextPageContext } from 'next/dist/next-server/lib/utils';
import { ReactElement } from 'react';
import { ReduxWrapperAppContext } from 'next-redux-wrapper';
import { StatusMarketListing } from '../constants/marketplace';
import { StageInventory, StatusInventory } from './store/common.model';

export interface ComponentStatic {
  renderLayout?: ({ children }: { children: ReactElement }) => ReactElement;
  getInitialProps?: (ctx: NextPageContext & ReduxWrapperAppContext) => Promise<any> | any;
}

export interface DataListInterface<Model = any> {
  data: Model[];
  page: number;
  page_size: number;
  total_item: number;
  total_page: number;
}

export class DataList<T> implements DataListInterface<T> {
  data: T[] = [];

  dataReplace: T[] = [];

  page: number = 1;

  page_size: number = 0;

  total_item: number = 0;

  total_page: number = 0;

  total_page_year: number = 0;

  total_items_year: number = 0;

  id: any;

  years: object[];
}

export enum Condition {
  Excellent = 'EXCELLENT',
  VeryGood = 'VERY_GOOD',
  Good = 'GOOD',
  Fair = 'FAIR',
  LikeNew = 'LIKE_NEW',
}

export enum ShippingType {
  BICYCLE_BLUE_BOOK_TYPE = 'BICYCLE_BLUE_BOOK_TYPE',
  FLAT_RATE_TYPE = 'FLAT_RATE_TYPE',
}

export enum StageCart {
  InShoppingCart = 'IN_SHOPPING_CART',
  Sold = 'SOLD',
  Returned = 'RETURNED',
  Cancelled = 'CANCELLED',
  NoLongerAvailable = 'NO_LONGER_AVAILABLE',
}

export interface Component {
  name: string;
  value: string;
}

export interface Product {
  bbbValue: number;
  bestDeal: boolean;
  bestOfferAutoAcceptPrice: number;
  bicycleBrandName: string;
  bicycleId: number;
  bicycleModelName: string;
  bicycleName: string;
  bicycleSizeName: string;
  bicycleTypeName: string;
  bicycleYearName: string;
  brandId: number;
  modelId: number;
  yearId: number;
  brakeName: string;
  brakeTypeId: number;
  cityName: string;
  cogsPrice: number;
  condition: Condition;
  countryCode: string;
  countryName: string;
  currentListedPrice: number;
  currentHighestBid?: number;
  delete: boolean;
  discountedPrice: number;
  favourite: boolean;
  colorName: string;
  frameMaterialId: number;
  frameMaterialName: string;
  frameSize: string;
  frameSizes: FrameSize[];
  bottomBracketName: string;
  suspensionName: string;
  gender: string;
  genderName: string;
  isAvailableAssembled: boolean;
  imageDefault: string;
  images: string[];
  initialListPrice: number;
  inventoryId: number;
  inventoryName: string;
  inventoryDescription: string;
  location: string;
  marketListingId: number;
  marketPlaceId: number;
  masterListingId: number;
  minimumOfferAutoAcceptPrice: number;
  sellerId: string;
  sellerIsBBB: boolean;
  serialNumber: string;
  shippingType: ShippingType;
  stageCart: StageCart;
  stageInventory: StageInventory;
  stateCode: string;
  stateName: string;
  statusInventory: StatusInventory;
  storefrontId: string;
  status?: StatusMarketListing;
  title: string;
  totalForSale: number;
  totalListings: number;
  totalSalePending: number;
  totalSold: number;
  type: string;
  typeInventoryId: number;
  typeInventoryName: string;
  wheelSize: string;
  wheelSizeName: string;
  zipCode: string;
  msrpPrice: number;
  isAuction?: boolean;
  components: Component[];
  noteToCustomer?: string;
  listingType?: string;
  wholesale?: boolean;
  showBBBLogo?: boolean;
  isBestOffer?: boolean;
}

export interface FrameSize {
  frameSize: string;
  totalForSale: number;
  totalSalePending: number;
  totalSold: number;
  all: number;
}

export type ViewTypeMarketplace = 'list' | 'grid';

export interface SubMenuModel {
  id: string;
  name: string;
  url: string;
  icon: string;
}
export interface MenuModel {
  id: string;
  icon: string;
  name: string;
  url?: string;
  subMenu?: SubMenuModel[];
}

export interface ListStoreFrontMarketPlaceParams {
  storefrontIds?: string[];
}
