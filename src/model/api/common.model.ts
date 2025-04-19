export interface OfferModel {
  id: number;
  buyerId: string;
  offerPrice: number;
  status: string;
  createdTime: Date;
  masterListingId: number;
  quantity: number;
  buyerName: string;
  inventory: InventoryModel;
  marketListings: MarketListingModel[];
  returnPolicy: ReturnPolicyModel;
  paid: boolean;
}

export interface InventoryModel {
  bicycleId: number;
  modelId: number;
  brandId: number;
  yearId: number;
  typeId: number;
  bicycleName: string;
  bicycleModelName: string;
  bicycleBrandName: string;
  bicycleYearName: string;
  bicycleTypeName: string;
  bicycleSizeName: string;
  sizeName: string;
  brakeTypeId: number;
  brakeName: string;
  frameMaterialId: number;
  frameMaterialName: string;
  imageDefault: string;
  status: string;
  stage: string;
  bbbValue: number;
  initialListPrice: number;
  currentListedPrice: number;
  cogsPrice: number;
  discountedPrice: number;
  storefrontId: string;
  name: string;
  typeInventoryId: number;
  typeInventoryName: string;
  title: string;
  condition: string;
  serialNumber: string;
  createdTime: Date;
  id: number;
  zipCode: string;
  countryName: string;
  countryCode: string;
  stateName: string;
  stateCode: string;
  cityName: string;
  county: string;
  isFreeShip: boolean;
  sellerId: string;
  sellerIsBBB: boolean;
  sizeCategoryDisplayName: string;
  shippingFee: number;
  recordType: string;
  images: string[];
  allowLocalPickup: boolean;
  location: string;
}

export interface MarketListingModel {
  id: number;
  inventoryId: number;
  status: string;
  createdTime: Date;
  lastUpdate: Date;
  timeListed: Date;
  timeSold: Date;
  marketPlaceConfigId: number;
  marketPlaceId: number;
  trackingCount: number;
  countListingError: number;
  bestOfferAutoAcceptPrice: number;
  minimumOfferAutoAcceptPrice: number;
  paypalEmailSeller: string;
  ownerId: string;
  rating: number;
  masterListingId: number;
  offerId: number;
  bestOffer: boolean;
  delete: boolean;
}

export interface ReturnPolicyModel {
  marketListingId: number;
  isAllowReturn: boolean;
  returnShippingPayer: string;
  returnWithinDays: number;
}

export interface CommonRequestQuery {
  page?: number;
  sort?: string;
  page_size?: number;
}
