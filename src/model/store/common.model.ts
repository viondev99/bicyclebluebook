export interface StateModel {
  abbreviation: string;
  name: string;
}

export interface StatesModel {
  state: StateModel[];
}

export enum CommonComponents {
  Condition = 'CONDITION',
  BicycleType = 'BICYCLE_TYPE',
  UpgradeComponent = 'UPGRADE_COMPONENT',
  ComponentTypeCustomQuote = 'COMPONENT_TYPE_CUSTOM_QUOTE',
  BrandBicycle = 'BRAND_BICYCLE',
  AllBrandBicycle = 'ALL_BRAND_BICYCLE',
  AllModelBicycle = 'ALL_MODEL_BICYCLE',
  AllYearBicycle = 'ALL_YEAR_BICYCLE',
  AllSizeInventory = 'ALL_SIZE_INV',
  AllFrameMaterialInventory = 'ALL_FRAME_MATERIAL_INV',
  AllBrakeTypeInventory = 'ALL_BRAKE_TYPE_INV',
  StatusTradeIn = 'STATUS_TRADE_IN',
  ConfigMarket = 'CONFIG_MARKET',
  EBayCategoryPrimary = 'EBAY_CATEGORY_PRIMARY',
  FilterInventoryActive = 'FILTER_INVENTORY_ACTIVE',
  FilterInventoryActiveWarehouse = 'FILTER_INVENTORY_ACTIVE_WAREHOUSE',
  FilterInventoryInactive = 'FILTER_INVENTORY_INACTIVE',
  EBayListingType = 'EBAY_LISTING_TYPE',
  InventoryType = 'INVENTORY_TYPE',
  InventoryTypeAll = 'INVENTORY_TYPE_ALL',
  ListingEBayDuration = 'LISTING_EBAY_DURATION',
  DetailBicycleMyListing = 'DETAIL_BICYCLE_MY_LISTING',
  AllSuspension = 'ALL_SUSPENSION',
  AllGender = 'ALL_GENDER',
  AllWheelSize = 'ALL_WHEEL_SIZE',
  AllBrandContainNonActive = 'ALL_BRAND_CONTAIN_NON_ACTIVE',
  AllModelContainNonActive = 'ALL_MODEL_CONTAIN_NON_ACTIVE',
  AllYearContainNonActive = 'ALL_YEAR_CONTAIN_NON_ACTIVE',
  StatusInventory = 'STATUS_INV',
  StatusInventoryValue = 'STATUS_INV_VALUE',
  StageInventory = 'STAGE_INV',
  StageInventoryValue = 'STAGE_INV_VALUE',
  StageByStatusInventory = 'STAGE_BY_STATUS_INV',
  StatusTradeInValue = 'STATUS_TRADE_IN_VALUE',
  detailScoreCard = 'DETAIL_SCORE_CARD',
}

export enum TypeMarket {
  BBB = 'BBB',
  EBay = 'EBAY',
}

export interface MarketConfigsModel {
  marketConfigId: number;
  marketPlaceId: number;
  type: TypeMarket;
  marketName: string;
}

export interface CommonComponentModel {
  id: number;
  name: string;
}

export interface OptionsModel {
  label: string;
  value: string;
}

export enum StatusInventory {
  InActive = 'IN_ACTIVE',
  Active = 'ACTIVE',
  Sold = 'SOLD',
  Decline = 'DECLINED',
  Pending = 'PENDING',
  NonCompliant = 'NON_COMPLIANT',
  Return = 'RETURNED',
  Reversed = 'RESERVED',
}

export enum StageInventory {
  Accepted = 'ACCEPTED',
  WaitingOnParts = 'WAITING_ON_PARTS',
  PartOut = 'PART_OUT',
  ThirtyDayHold = 'THIRTY_DAY_HOLD',
  TwentyOneDayHold = 'TWENTY_ONE_DAY_HOLD',
  Photography = 'PHOTOGRAPHY',
  ReadyListed = 'READY_LISTED',
  Listed = 'LISTED',
  DeListed = 'DE_LISTED',
  Boxed = 'BOXED',
  Sold = 'SOLD',
  SalePending = 'SALE_PENDING',
  Draft = 'DRAFT',
  UPSStaging = 'UPS_STAGING',
  BBBUpsClaim = 'BBB_UPS_CLAIM',
  ListedActiveBids = 'LISTED_ACTIVE_BIDS',
  Archived = 'ARCHIVED',
  IncompleteBicycleDetails = 'INCOMPLETE_BICYCLE_DETAILS',
  IncompleteCustomQuote = 'INCOMPLETE_CUSTOM_QUOTE',
  IncompleteSummary = 'INCOMPLETE_SUMMARY',
  IncompleteUpdateImages = 'INCOMPLETE_UPDATE_IMAGES',
  IncompleteTransactionDetails = 'INCOMPLETE_TRANSACTION_DETAILS',
  CustomQuotePendingReview = 'CUSTOM_QUOTE_PENDING_REVIEW',
  Complete = 'COMPLETE',
  CustomQuoteReviewed = 'CUSTOM_QUOTE_REVIEWED',
  Declined = 'DECLINED',
  Expired = 'EXPIRED',
  StaffUser = 'STAFF_USER',
  ShippedToCustomer = 'SHIPPED_TO_CUSTOMER',
  ReceivedByCustomer = 'RECEIVED_BY_CUSTOMER',
  ScorecardDeclinedDealer = 'SCORECARD_DECLINED_DEALER',
  DoesNotQualify = 'DOES_NOT_QUALIFY',
  ReturnToDealerNonCompliant = 'RETURN_TO_DEALER_NON_COMPLIANT',
  InTransitToBBB = 'IN_TRANSIT_TO_BBB',
  ReceivedAtWarehouse = 'RECEIVED_AT_WAREHOUSE',
  Inspection = 'INSPECTION',
  NonCompliant = 'NON_COMPLIANT',
  CustomerReturnDamage = 'CUSTOMER_RETURN_DAMAGE',
  CustomerReturn = 'CUSTOMER_RETURN',
  CustomerReturned = 'CUSTOMER_RETURNED',
  Reversed = 'RESERVED',
  DealerUpsClaim = 'DEALER_UPS_CLAIM',
  LayawayHold = 'LAYAWAY_HOLD',
  FEDEXStaging = 'FEDEX_STAGING',
  Processing = 'PROCESSING',
  AwaitingPickup = 'AWAITING_PICKUP',
  PickedUp = 'PICKED_UP',
  PTP = 'PTP',
  FlatRateType = 'FLAT_RATE_TYPE',
  BicycleBlueBookType = 'BICYCLE_BLUE_BOOK_TYPE',
  ForSale = 'FOR_SALE',
  AwaitingShipment = 'WAITING_SHIPMENT',
  AllProcessing = 'ALL_PROCESSING',
  AllProcessed = 'ALL_PROCESSED',
  Shipped = 'SHIPPED',
  Cancelled = 'CANCELLED',
  ComingSoon = 'COMING_SOON',
}

export interface TypeModel {
  id: number;
  name: string;
  sortOrder: number;
  valueModifier: number;
  lastUpdate: string;
  imageDefault?: string;
}

export enum Operator {
  Equal = 'EQUAL',
  RangeIn = 'RANGE_IN',
  Range = 'RANGE',
}

export enum TypeTable {
  InventoryComponentDetail = 'INVENTORY_COMP_DETAIL',
  Inventory = 'INVENTORY',
}

export interface CategoriesModel {
  id: number;
  name: string;
  operators: Operator;
  values: String[];
  valueNames: Array<{ id: string; name: string }>;
  typeTable: TypeTable;
}

export enum StatusTradeIn {
  Declined = 'DECLINED',
  IncompleteSummary = 'INCOMPLETE_SUMMARY',
  IncompleteUploadImages = 'INCOMPLETE_UPLOAD_IMAGES',
  Shipping = 'SHIPPING',
  Completed = 'COMPLETED',
  CustomQuoteIncomplete = 'CUSTOM_QUOTE_INCOMPLETE',
  CustomQuotePendingReview = 'CUSTOM_QUOTE_PENDING_REVIEW',
  CustomQuoteValueProvided = 'CUSTOM_QUOTE_VALUE_PROVIDED',
  Cancel = 'CANCEL',
  IncompleteDetail = 'INCOMPLETE_DETAIL',
  CanceledDetail = 'CANCELED_DETAIL',
  CanceledSummary = 'CANCELED_SUMMARY',
  CanceledImage = 'CANCELED_IMAGE',
  CanceledShipping = 'CANCELED_SHIPPING',
  CanceledComplete = 'CANCELED_COMPLETE',
  ReturnToShop = 'RETURNED_TO_SHOP',
  Expired = 'EXPIRED',
}

export interface StatusTradeInModel {
  id: number;
  name: string;
  type: StatusTradeIn;
}

export enum EbayType {
  FixedPriceItem = 'FIXED_PRICE_ITEM',
}

export interface ComponentCustomQuoteSelectModel {
  id: number;
  inventoryCompTypeId: number;
  value: string;
  orderSort: number;
}

export interface ComponentCustomQuoteModel {
  id: number;
  name: string;
  selects?: ComponentCustomQuoteSelectModel[];
  sort: number;
  required: boolean;
  system: boolean;
  select: boolean;
}

export interface StageByStatusInventoryModel {
  [StatusInventory.Active]: StageInventory[];
  [StatusInventory.Return]: StageInventory[];
  [StatusInventory.Sold]: StageInventory[];
  [StatusInventory.Pending]: StageInventory[];
  [StatusInventory.Decline]: StageInventory[];
  [StatusInventory.Reversed]: StageInventory[];
  [StatusInventory.InActive]: StageInventory[];
  [StatusInventory.NonCompliant]: StageInventory[];
}

export interface ConditionModel {
  condition: string;
  percent: number;
  message: string;
}

export interface ListingEbayDurationModel {
  id: number;
  value: string;
}

export interface UpgradeComponentsModel {
  id: number;
  name: string;
  percentValue: number;
  up: boolean;
}

export interface EBayCategoriesPrimaryModel {
  primaryId: number;
  primaryName: string;
  childs: CommonComponentModel[];
}

export interface BicycleDetailComponentTypeModel {
  id: number;
  value: string;
  orderSort: number;
}

export interface SelectCompModel {
  id: number;
  inventoryCompTypeId: number;
  orderSort: number;
  value: string;
}
export interface CompModel {
  id: number;
  name: string;
  select: boolean;
  selects: SelectCompModel[];
  sort: number;
  system: boolean;
}

export interface BicycleDetailComponentModel {
  types: BicycleDetailComponentTypeModel[];
  comps: CompModel[];
}

export interface ComponentsModel {
  allBrandBicycle: CommonComponentModel[];
  allBrandContainNonActive: CommonComponentModel[];
  allModelBicycle: CommonComponentModel[];
  allModelContainNonActive: CommonComponentModel[];
  allYearContainNonActive: CommonComponentModel[];
  bicycleDetailComp: BicycleDetailComponentModel;
  brakeType: CommonComponentModel[];
  brandBicycle: CommonComponentModel[];
  categoriesActive: CategoriesModel[];
  categoriesActiveWarehouse: CategoriesModel[];
  categoriesInActive: CategoriesModel[];
  componentCustomQuote: ComponentCustomQuoteModel[];
  condition: ConditionModel[];
  ebayCategoriesPrimary: EBayCategoriesPrimaryModel[];
  ebayTypes: EbayType[];
  frameMaterial: CommonComponentModel[];
  gender: CommonComponentModel[];
  invType: CommonComponentModel[];
  invTypeAll: CommonComponentModel[];
  listingEbayDuration: ListingEbayDurationModel[];
  marketConfigs: MarketConfigsModel[];
  sizeInv: CommonComponentModel[];
  stageByStatusInv: StageByStatusInventoryModel;
  stageInv: StageInventory[];
  stageInvValue: Partial<string>;
  statusInv: StatusInventory[];
  statusInvValue: Partial<string>;
  statusTradeInValue: Partial<string>;
  statusTradeIns: StatusTradeInModel[];
  suspension: CommonComponentModel[];
  type: TypeModel[];
  upgradeComponents: UpgradeComponentsModel[];
  wheelSize: CommonComponentModel[];
  year: CommonComponentModel[];
  ebikeSubtypes: CommonComponentModel[];
}

export interface PartnerModel {
  id: string;
  name: string;
}

export interface ItemStoreFrontModel {
  _id: string;
  name: string;
}

export interface CommonStoreModel {
  states: Partial<StatesModel>;
  loadingState: boolean;
  components: Partial<ComponentsModel>;
  loadingComponent: boolean;
  partners: Array<PartnerModel>;
  listStoreFronts?: ItemStoreFrontModel[];
  loadingPartner: boolean;
  error: string;
  bannerPublishing: GetBannerPublishingResponse | GetBannerPublishingResponse[];
  isSelectedStore?: boolean;
}

export interface GetListStoreFrontRequest {
  page?: number;
}

export interface GetListStoreFrontResponse {
  total_item: number;
  data: ItemStoreFrontModel[];
  page: number;
  page_size: number;
  total_page: number;
}

export interface GetBannerPublishingResponse {
  description: string;
  text_in_circle: string;
  promo_description: string;
  promo_text: string;
  promo_url: string;
  display_pages: any[];
  _id: string;
  title: string;
  publishes_from: Date;
  publishes_to: Date;
  is_active: boolean;
  date_created: Date;
  date_updated: Date;
  size?: string;
  not_display_pages?: string[];
}
