import { DataList } from '../common';

interface ModelItem {
  id: number;
  name: string;
}

export type ModelsResponse = ModelItem[];

export interface BrandModel {
  id: number;
  name: string;
  valueModifier: number;
  lastUpdate: Date;
  approved: boolean;
}

export type BrandDetailResponse = BrandModel;

export interface ModelModel {
  id: number;
  name: string;
  valueModifier: number;
  lastUpdate: Date;
  approved: boolean;
}

export type ModelDetailResponse = ModelModel;

interface DataListRequest {
  page: number;
  size?: number;
}

export interface BicyclesByContentRequest extends DataListRequest {
  content: string;
  yearId?: string;
}

export interface BicyclesByBrandModelRequest extends DataListRequest {
  brand: number;
  model: number;
}

export interface YearModel {
  id: number;
  name: string;
}
export interface BicycleByContentModel extends BicycleModel {
  description: string;
  brakeTypeId: number;
  brakeTypeName: string;
  imageDefault: string;
  yearModels: YearModel[];
}

export interface BicycleModel {
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
}

export interface BicycleDetailModel {
  id: number;
  brandId: number;
  modelId: number;
  typeId: number;
  yearId: number;
  retailPrice: number;
  description: string;
  lastUpdate: string;
  imageDefault: string;
  familyName?: string;
  imageId: number;
  idSaleforce: string;
  active: boolean;
  name: string;
  bicycleName?: string;
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
  msrp: number;
  delete: boolean;
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
  tradeInValueAvg: number;
  tradeInValueMin: number;
  tradeInValueMax: number;
  privatePartyValueAvg: number;
  privatePartyValueMin: number;
  privatePartyValueMax: number;
  tradeInValue: number;
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
}

export interface FrameSize {
  frameSize: string;
  totalForSale: number;
  totalSalePending: number;
  totalSold: number;
  all: number;
}

export interface UserInfoModel {
  _id: string;
  email: string;
  display_name: string;
  gravatar: string;
  avatar: string;
}

export interface RatingBicycleModel {
  rate: number;
  title: string;
  comment: string;
}

export interface RatingBicycleResponse {
  id: number;
  rate: number;
  rateTime: string;
  userId: string;
  bicycleId: number;
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
  ratingResponse: DataList<RatingDataModel>;
  rateValueDetail: RateValueDetailModel;
}

export interface RateValueDetailModel {
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

export interface RatingDataModel {
  id: number;
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

export interface BicycleBaseComponentModel {
  bicycleBrands: CommonComponentItem[];
  bicycleYears: CommonComponentItem[];
}

interface CommonComponentItem {
  id: number;
  name: string;
}

export interface GetBicyclesBrandYearModelParams {
  brandId: number;
  modelId: number;
  yearId: number;
}

export interface BicyclesBrandYearModelItem {
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
  imageDefault: string;
  yearModels: YearModel[];
}

export interface GetBicyclesBrandYearModelResponse {
  data: BicyclesBrandYearModelItem[];
  page: number;
  total_item: number;
  page_size: number;
  total_page: number;
}

export interface TrackingEventControllerParams {
  bicycleId?: number;
  brandId?: number;
  event?: string;
  productFamily?: string;
}
