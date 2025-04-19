import { ModelsResponse } from 'api/trade-in.api';
import { DataList } from '../common';

export interface ModelBicycleModel {
  id: number;
  name: string;
}

export interface ModelValueGuideModelsResponse {
  id: {
    id: number;
    name: string;
  };
}

export enum Condition {
  Excellent = 'EXCELLENT',
  VeryGood = 'VERY_GOOD',
  Good = 'GOOD',
  Fair = 'FAIR',
}

export interface ValueGuideModel {
  baseComponent: BaseComponentStoreModel;
  bicycle: {
    list: ListingBicycleStoreModel;
    detail: DetailBicycleStoreModel;
  };
  brand: {
    detail: DetailBrandStoreModel;
  };
  model: {
    list: ListingModelStoreModel;
    detail: DetailModelStoreModel;
  };
  family: ListingFamilyStoreModel;
  recommend: RecommendStoreModel;
  rating: RatingStoreModel;
}

export interface DetailModelStoreModel {
  model: ModelModel | null;
  loading: boolean;
  error: string;
}

export interface ListingModelStoreModel {
  models: ModelBicycleModel[];
  valueGuideModels: ModelBicycleModel[];
  dataBrandYearModel: GetBrandYearModelResponse;
  brandIdSearchValueGuide: string;
  dataLogoBrandValueGuide: GetLogoBrandValueGuideResponse;
  selectedProductId: string;
  loading: boolean;
  error: string;
}

export interface ListingFamilyStoreModel {
  families: Array<string>;
  loading: boolean;
  error: string;
}

export interface DetailBicycleStoreModel {
  bicycle: BicycleDetailModel | null;
  loading: boolean;
  error: string;
}

export interface ListingBicycleStoreModel {
  bicycles: DataList<BicycleBasicDetailModel>;
  loading: boolean;
  error: string;
}

export interface DetailBrandStoreModel {
  brand: BrandModel | null;
  loading: boolean;
  error: string;
}

export interface RecommendStoreModel {
  recommended: RecommendModel[];
  loading: boolean;
  error: string;
}

export interface RatingStoreModel {
  rating: RatingModel;
  loading: boolean;
  error: string;
}

export interface BicycleBasicDetailModel {
  bicycleId: number;
  description: string;
  name: string;
  brandId: number;
  brandName: string;
  modelId: number;
  modelName: string;
  yearId: number;
  yearName: string;
  typeId: number;
  typeName: string;
  sizeId: number;
  sizeName: string;
  brakeTypeId: number;
  brakeTypeName: string;
  imageDefault: string;
  yearModels: any[];
}

export interface BaseComponentStoreModel {
  baseComponent: BicycleBaseComponentModel;
  branchYearModel: CommonComponentItem[];
  loading: boolean;
  error: string;
}

export interface BrandModel {
  id: number;
  name: string;
  valueModifier: number;
  lastUpdate: Date;
  approved: boolean;
}

export interface ModelModel {
  id: number;
  name: string;
  lastUpdate: Date;
  brandId: number;
  brandName: string;
  approved: boolean;
}

export interface BicycleModel {
  id?: number;
  bicycleId: number;
  name: string;
  brandId: number;
  brandName: string;
  modelId: number;
  modelName: string;
  yearId: number;
  yearName: string;
  typeId: number;
  typeName: string;
  sizeId: number;
  sizeName: string;
  yearModels: any[];
  imageDefault?: string;
  bicycleImageDefault?: string;
  bicycleName?: string;
}

export interface brandIdName {
  brandId: string;
  brandName: string;
}

export interface BicycleDetailModel {
  id: number;
  brandId: number;
  modelId: number;
  typeId: number;
  yearId: number;
  bicycleName?: string;
  retailPrice: number;
  description: string;
  lastUpdate: string;
  imageDefault: string;
  imageId: number;
  idSaleforce: string;
  active: boolean;
  name: string;
  brakeTypeId: number;
  sizeId: number;
  rating: number;
  isEbike: boolean;
  brandName: string;
  yearName: string;
  modelName: string;
  typeName: string;
  sizeName: string;
  totalRating: number;
  images: any[];
  bicycleImages: any[];
  components: ComponentModel[];
  spec: any[];
  conditions: ConditionModel[];
  additionalYears: AdditionalYearModel[];
  delete: boolean;
  msrp: number;
  familyName: string;
}

export interface ComponentModel {
  id: number;
  componentTypeId: number;
  componentName: string;
  componentValue: string;
  categoryName: string;
}

export interface ConditionModel {
  condition: string;
  percent: number;
  message: string;
  tradeInValueAvg?: number;
  tradeInValueMin?: number;
  tradeInValueMax?: number;
  privatePartyValueAvg?: number;
  privatePartyValueMin?: number;
  privatePartyValueMax?: number;
  tradeInValue?: number;
}

export interface RecommendModel {
  inventoryId: number;
  inventoryTitle: string;
  currentListedPrice: number;
  discountedPrice: number;
  initialListPrice: number;
  imageDefault: string;
  bicycleSizeName?: string;
  masterListingId: number;
  marketListingId: number;
  sellerIsBBB: boolean;
  frameSizes: FrameSize[];
  bestDeal: boolean;
  bicycleTypeName?: string;
  favourite?: boolean;
}

export interface FrameSize {
  frameSize: string;
  totalForSale: number;
  totalSalePending: number;
  totalSold: number;
  all: number;
}

export interface RatingModel {
  bicycleImages: string;
  bicycleYear: string;
  bicycleBrand: string;
  bicycleModel: string;
  bicycleType: string;
  bicycleSize: string;
  avgRating: number;
  totalRating: number;
  ratingResponse: any;
  rateValueDetail: RateValueDetailModel;
}

export interface RatingDataModel {
  nameDisplay: string;
  rate: number;
  title: string;
  rateTime: string;
  userId: string;
  avatar: string;
  address?: string;
  city: string;
  state: string;
  country?: string;
  comment?: string;
}

export interface AdditionalYearModel {
  bicycleId: number;
  yearId: number;
  brandId: number;
  modelId: number;
  yearName: string;
  imageDefault: string;
  bicycleTypeId: number;
  isEbike: boolean;
}

export interface UserInfoModel {
  _id: string;
  email: string;
  display_name: string;
  gravatar: string;
  avatar: string;
}

export interface RateValueDetailModel {
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

export interface BicycleBaseComponentModel {
  bicycleBrands: CommonComponentItem[];
  bicycleYears: CommonComponentItem[];
}

interface CommonComponentItem {
  id: number;
  name: string;
}

export interface GetBrandYearModelParams {
  brandId?: number | string;
  brandName?: string;
  familyName?: string;
  modelId?: string | number;
  yearId?: number;
  isEbike?: boolean;
  isVGService?: boolean;
  isSellTrade?: boolean;
}

export interface Bicycle {
  bicycleId: number;
  bicycleName: string;
  bicycleImageDefault: string;
}

export interface BicycleIdName {
  bicycleId?: number;
  bicycleName?: string;
}

export interface Model {
  id: number;
  name: string;
  bicycle: Bicycle[];
}

export interface Year {
  id: number;
  name: string;
}

export interface GetBrandYearModelResponse {
  models: Model[];
  years: Year[];
  productFamily: string;
}

export interface GetLogoBrandValueGuideResponse {
  id: number;
  name: string;
  brandLogo?: string;
  valueModifier: number;
  lastUpdate: Date;
  approved: boolean;
}

export enum TrackingEvent {
  ViewdBike = 'view-bike',
  SearchBrand = 'search-brand',
  SearchProductFamily = 'search-product-family',
}
