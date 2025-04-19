import { DataList } from '../../../common';

export interface compRequest {
  compId: number;
  value: string;
}

export interface FinishedModel {
  bicycleBrandName: string;
  bicycleId: number;
  timeSold?: string;
  bicycleModelName: string;
  orderId: string;
  bicycleName: string;
  bicycleTypeId: number;
  bicycleTypeName: string;
  bicycleYearName: string;
  cogsPrice: number;
  condition: string;
  discountedPrice: number;
  inventoryId: number;
  inventoryName: string;
  isAvailableAssembled: boolean;
  marketListingId: number;
  masterListingId: number;
  offers: number;
  sellerIsBBB: boolean;
  serialNumber: string;
  sizeName: string;
  stageInventory: string;
  statusInventory: string;
  totalForSale: number;
  totalListings: number;
  totalSalePending: number;
  totalSold: number;
  typeInventoryId: number;
  typeInventoryName: string;
  views: number;
  isAllowReturn: boolean;
  returnWithinDays?: number;
  stockLocationId?: string;
  sale?: {
    orderId?: string;
    localPickup?: string;
    soldDateTime?: string;
    shippingType?: string;
    isRequestReturn?: boolean;
    buyerId?: string;
    price?: number;
    orderCode?: string;
    accountId?: string;
    buyerDisplayName?: string;
    isCancelOrder: boolean;
  };
  storefrontId?: string;
}

export interface ContentDraft {
  bicycleName?: string;
  brandName: string;
  modelName: string;
  yearName: string;
  bicycleTypeId: number;
  compRequests: compRequest[];
  condition: string;
  country: string;
  description: string;
  eBikeHours: number;
  eBikeMileage: number;
  emailPaypal: string;
  expireAfterDays: number;
  flatRate: number;
  hasDiagnosticReport: boolean;
  hasKey: boolean;
  isAllowReturn: boolean;
  isBestOffer: boolean;
  isEbike: boolean;
  isExpirable: boolean;
  isTamperedWith: boolean;
  localPickupShipping: boolean;
  minimumOfferAutoAcceptPrice: number;
  odometerReading: string;
  requireInsuranceShipping: boolean;
  returnShippingPayer: string;
  returnWithinDays: number;
  salePrice: number;
  serialNumber: string;
  shippingType: string;
  state: string;
  zipCode: string;
}

export interface DoneListing {
  masterListingId: number;
  marketListingId: number;
  inventoryId: number;
  bicycleId: number;
  modelId: number;
  brandId: number;
  yearId: number;
  typeId: number;
  bicycleName: string;
  bicycleModelName: string;
  bicycleBrandName: string;
  bicycleYearName: number;
  bicycleTypeName: string;
  sizeName: string;
  brakeTypeId: number;
  brakeName: string;
  frameMaterialId: number;
  frameMaterialName: string;
  marketPlaceId: number;
  marketType: string;
  bbbValue: number;
  initialListPrice: number;
  cogsPrice: number;
  discountedPrice: number;
  bestOfferAutoAcceptPrice: number;
  minimumOfferAutoAcceptPrice: number;
  statusInventory: string;
  stageInventory: string;
  inventoryName: string;
  typeInventoryId: number;
  typeInventoryName: string;
  condition: string;
  serialNumber: number;
  isAllowReturn: boolean;
  returnShippingPayer: string;
  returnWithinDays: number;
  views?: number;
  sale?: {
    orderId?: string;
    orderCode?: string;
    localPickup?: string;
    soldDateTime?: string;
    shippingType?: string;
    isRequestReturn?: string;
    inventoryId?: string;
    buyerId?: string;
    buyerDisplayName?: string;
    isCancelOrder?: boolean;
  };
}

export interface DraftListing {
  content: ContentDraft;
  draftId: number;
}

export interface CountNewReturn {
  total_new: number;
}

export interface ListingItemModel {
  done?: DoneListing;
  draft?: DraftListing;
  finished?: FinishedModel;
  postingTime: string;
  title: string;
  statusMarketListing: string;
  currentListedPrice: string;
  imageDefault: string;
  bestOffer: boolean;
  statusMessage: string;
}

export type ListingsResponse = DataList<ListingItemModel>;

export interface DeleteListingResponse {
  message: string;
}

export interface MarkListingResponse {
  bbbValue: number;
  bicycleBrandName: string;
  bicycleId: number;
  bicycleModelName: string;
  bicycleSizeName: string;
  bicycleTypeName: string;
  bicycleYearName: number;
  chargeCycles: number;
  chargerIncluded: boolean;
  cogsPrice: number;
  condition: string;
  countTrackingView: number;
  createPo: boolean;
  createdTime: string;
  currentListedPrice: number;
  customQuote: boolean;
  dealPercent: number;
  delete: boolean;
  description: string;
  discountedPrice: number;
  eBikeHours: number;
  firstListedTime: string;
  hasDiagnosticReport: boolean;
  hasKey: boolean;
  id: number;
  imageDefault: string;
  imageDefaultId: number;
  initialListPrice: number;
  isTamperedWith: boolean;
  lastUpdate: string;
  msrpPrice: number;
  name: string;
  odometerReading: string;
  privatePartyValue: number;
  recordType: string;
  searchGuideRecommendation: string;
  sellerId: string;
  sellerIsBBB: boolean;
  serialNumber: string;
  stage: string;
  status: string;
  title: string;
  typeId: string;
  valueAdditionalComponent: number;
  valueGuidePrice: number;
}

export interface ListingReturnModel {
  amount_refund: number;
  buyer: string;
  date_created: string;
  date_refunded: string;
  date_updated: string;
  image: string;
  insurance: number;
  inventory: number;
  market_listing: number;
  master_listing: number;
  note_to_buyer: string;
  order: string;
  price: number;
  quantity: number;
  reason_seller_return: string;
  request_code: string;
  return_status: string;
  seller: string;
  shipping: number;
  shipping_payer: string;
  storefront: string;
  subtotal: number;
  tax: number;
  user_type: string;
  _id: string;
  tracking_id: string;
}

export type ListingsReturnResponse = DataList<ListingReturnModel>;

export interface RelistSoldResponse {
  bestOffer: boolean;
  countListingError: number;
  createdTime: string;
  delete: boolean;
  id: number;
  inventoryId: number;
  lastUpdate: string;
  marketPlaceConfigId: number;
  marketPlaceId: number;
  masterListingId: number;
  ownerId: string;
  paypalEmailSeller: string;
  rating: number;
  status: string;
  timeListed: string;
  trackingCount: number;
}

export interface CreateListingDraftRequest {
  bicycleTypeId: number;
  brandName: string;
  carrierType?: string;
  compRequests: compRequest[];
  condition: string;
  country: string;
  customCarrier?: string;
  description: string;
  chargerIncluded: boolean;
  chargeCycles: number;
  eBikeHours: string;
  eBikeMileage: string;
  emailPaypal: string;
  expireAfterDays: string;
  flatRate: number;
  hasDiagnosticReport: boolean;
  hasKey?: boolean;
  isAllowReturn: boolean;
  isBestOffer: boolean;
  isEbike: boolean;
  isExpirable: boolean;
  isTamperedWith: boolean;
  localPickupShipping: boolean;
  minimumOfferAutoAcceptPrice: number;
  modelName: string;
  odometerReading: number;
  length?: number;
  width?: number;
  weight?: number;
  height?: number;
  bestOfferAutoAcceptPrice: number | null;
  cityName: string;
  addressLine: string;
  isFreeShip: boolean;
  needValidate: boolean;
  profitCalculator?: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: string;
    sellingPrice: number;
    shippingFee: number;
  };
  requireInsuranceShipping: boolean;
  returnShippingPayer: string;
  returnWithinDays: number;
  salePrice: number;
  serialNumber: string;
  shippingType: string;
  state: string;
  yearName: string;
  zipCode: string;
  myListingImageIds?: Number[];
  isBuyerPaysSignatureFee?: boolean;
  shippingMethod?: any;
}

export interface CreateListingPartAccessoriesDraftRequest {
  listingTitle: string;
  listingType: string;
  description: string;
  emailPaypal?: string;
  isBuyerPaysSignatureFee: boolean | string;
  localPickupShipping: boolean;
  zipCode: string;
  salePrice: number;
  bestOfferAutoAcceptPrice: number | null;
  minimumOfferAutoAcceptPrice: number;
  requireInsuranceShipping: boolean;
  flatRate: number;
  compRequests: compRequest[];
  isBestOffer: boolean;
  shippingType: string;
  country: string;
  state: string;
  cityName: string;
  needValidate: boolean;
  addressLine: string;
  eBikeMileage: string;
  serialNumber: string;
  isAllowReturn: boolean;
  returnWithinDays: number;
  returnShippingPayer: string;
  isExpirable: boolean;
  expireAfterDays: string;
  isFreeShip: boolean;
  length?: number;
  width?: number;
  weight?: number;
  height?: number;
  profitCalculator?: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: string;
    sellingPrice: number;
    shippingFee: number;
  };
  carrierType?: string;
  customCarrier?: string;
  myListingImageIds?: Number[];
}

export interface CreateListingDraftResponse {
  myListingDraftId: number;
  content: string;
  createdTime: Date;
  lastUpdate: Date;
  currentListedPrice: number;
  title: string;
  imageDrafts: any[];
  bestOffer: boolean;
  id: number;
}

export interface InventoryShipmentResponse {
  active: boolean;
  billingWeight: number;
  carrierType: string;
  createdTime: string;
  fromCity: string;
  fromCountryCode: string;
  fromLine: string;
  fromStateCode: string;
  fromZipCode: string;
  fullLinkLabel: string;
  height: number;
  inboundBaseShippingFee: number;
  inboundOversizeShippingFee: number;
  inboundShippingType: string;
  inventoryId: number;
  isDelivered: boolean;
  isOversized: boolean;
  isScheduled: boolean;
  lastTrackingStatusCode: string;
  lastTrackingStatusDescription: string;
  lastTrackingStatusUpdateTime: string;
  length: number;
  manualCarrier: string;
  outboundShippingType: string;
  realTotalChargeAmount: number;
  scheduleDate: string;
  schedulePickup: boolean;
  shipmentId: number;
  shipmentType: string;
  shippingConfigId: number;
  statusShipping: string;
  timeTracking: string;
  toCity: string;
  toCountryCode: string;
  toLine: string;
  toStateCode: string;
  toZipCode: string;
  totalChargeAmount: number;
  totalChargeCurrency: string;
  trackingNumber: string;
  tradeInId: number;
  weight: number;
  width: number;
}

export interface MarkAsDeliveredModel {
  order_id: string;
  master_listing_id: number;
  inventory_id: string;
  market_listing_id: string;
}

export interface RefundItemModel {
  order_id: string;
  master_listing_id: number;
  note?: string;
  amount: number;
  reason?: string;
  market_listing_id: number;
  inventory_id: number;
}

export interface SendEmailItemReturnParams {
  order_id: string;
  master_listing_id: number;
  market_listing_id: number;
  inventory_id: number;
  is_send: boolean;
}

export interface UploadShippingLabelModel {
  order_id: string;
  master_listing_id: number;
  note?: string;
  carrier: string;
  tracking_id: string;
  file: File;
  inventory_id?: number;
  market_listing_id?: number;
}
export interface DeleteListingPayload {
  idDelete: string;
  isDraft?: boolean;
}

export interface PostImageResponse {
  id: number;
  image: string;
  listingDraftId: number;
  sortOrder: number;
}

export interface InventoryComponent {
  bbbcreated: boolean;
  id: { inventoryId: number; inventoryCompTypeId: number };
  needUpgrade: boolean;
  nonStandard: boolean;
  upgrade: boolean;
  value: string;
}

export interface DetailListingListedResponse {
  ignoreStripe?: boolean;
  isBuyerPaysSignatureFee?: boolean | string;
  listingTitle?: string;
  listingType?: string;

  addressLine: string;
  allowLocalPickup: boolean;
  bbbValue: number;
  bestOffer: boolean;
  bestOfferAutoAcceptPrice: number;
  shippingType?: string;
  flatRate?: number;
  insurance?: boolean;
  eBikeMileage?: string;
  eBikeHours?: string;
  bicycleBrandName: string;
  bicycleId: number;
  length: number;
  width: number;
  weight: number;
  height: number;
  bicycleModelName: string;
  bicycleName: string;
  bicycleSizeName: string;
  bicycleTypeId: number;
  bicycleTypeName: string;
  bicycleYearName: string;
  brakeName: string;
  brakeTypeId: number;
  brandId: number;
  cityName: string;
  cogsPrice: number;
  condition: string;
  countryCode: string;
  countryName: string;
  currentListedPrice: number;
  customCarrier: string;
  carrierType: string;
  delete: boolean;
  description: string;
  discountedPrice: number;
  expireAfterDays: number;
  frameMaterialId: number;
  frameMaterialName: string;
  imageDefault: string;
  initialListPrice: number;
  inventoryComponents: InventoryComponent[];
  inventoryId: number;
  inventoryImages: { id: number; image: string; inventoryId: number }[];
  inventoryName: string;
  inventoryTypeId: number;
  isAllowReturn: boolean;
  returnShippingPayer?: string;
  isEbike: boolean;
  isExpirable: boolean;
  isFreeShip: boolean;
  marketListingId: number;
  marketPlaceId: number;
  masterListingId: number;
  minimumOfferAutoAcceptPrice: number;
  modelId: number;
  msrpPrice: number;
  paypalEmailSeller: string;
  returnWithinDays: number;
  serialNumber: string;
  stateCode: string;
  stateName: string;
  statusMarketListing: string;
  title: string;
  type: string;
  typeInventoryId: number;
  typeInventoryName: string;
  yearId: number;
  zipCode: string;
  profitCalculator?: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: string | 'margin' | 'fixed';
    sellingPrice: number;
    shippingFee: number;
  };
  isPaymentViaStripe?: boolean;
}

export interface UpdateListingModel {
  bestOfferAutoAcceptPrice: number;
  listingTitle?: string;
  listingType?: string;
  isBuyerPaysSignatureFee?: boolean | string;

  bicycle?: {
    bicycleTypeId: number;
    brandName: string;
    chargeCycles: number;
    chargerIncluded: boolean;
    eBikeHours: number;
    eBikeMileage: number;
    ebikeSubtypeId?: number;
    hasDiagnosticReport: boolean;
    hasKey: boolean;
    isEbike: boolean;
    isTamperedWith?: boolean;
    modelName: string;
    odometerReading: number;
    yearName: string;
  };
  condition?: string;
  description: string;
  emailPaypal: string;
  expiration: {
    expireAfterDays: number;
    isExpirable: boolean;
  };
  isBestOffer: boolean;
  minimumOfferAutoAcceptPrice: number;
  msrpPrice?: number;
  profitCalculator?: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: string;
    sellingPrice: number;
    shippingFee: number;
  };
  reasonDeactive?: string;
  returnPolicy: {
    isAllowReturn: boolean;
    returnShippingPayer: string;
    returnWithinDays: number;
  };
  salePrice: number;
  serialNumber: string;
  shipping: {
    addressLine: string;
    carrierType?: string;
    cityName: string;
    country: string;
    customCarrier?: string;
    flatRate?: number;
    height?: number;
    isFreeShip?: boolean;
    length?: number;
    localPickupShipping?: boolean;
    requireInsuranceShipping?: boolean;
    shippingServiceId?: number;
    shippingType?: string;
    state?: string;
    weight?: number;
    width?: number;
    zipCode: string;
  };
  statusMarketListing?: string;
  updateComps: {
    compId: number;
    value: string;
  }[];
  isChangeToStripe?: boolean;
}

export interface UpdateListingResponse {
  bestOffer: boolean;
  countListingError: number;
  createdTime: string;
  delete: boolean;
  id: number;
  inventoryId: number;
  lastUpdate: string;
  marketPlaceConfigId: number;
  marketPlaceId: number;
  masterListingId: number;
  ownerId: string;
  paypalEmailSeller: string;
  rating: number;
  status: string;
  timeListed: string;
  trackingCount: number;
}

export interface ImageUpload {
  imageId?: number;
  fullLink?: string;
  id?: string;
  url?: string;
  file?: any;
  isDeleted?: boolean;
  isEdited?: boolean;
  initialImage?: boolean;
  inventoryId?: number;
  title?: string;
  subTitle?: string;
  name?: string;
  type?: string;
  uri?: string;
}

export interface ListingCancelledItem {
  buyer: string;
  buyer_name: string;
  date_created: string;
  date_updated: string;
  image: string;
  insurance: number;
  master_listing: number;
  order: string;
  order_code: string;
  price: number;
  quantity: number;
  reason: string;
  seller: string;
  shipping: number;
  subtotal: number;
  tax: number;
  user_type: string;
  status?: string;
  _id: string;
  storefront?: string;
}

export interface ReportListingRequest {
  id: number;
  reason: string;
}

export interface ReportListingResponse {
  createTime: string;
  final: boolean;
  id: number;
  lastUpdate: string;
  masterListingId: number;
  reactive: boolean;
  reason: string;
  userId: string;
}
