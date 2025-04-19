/* eslint-disable import/no-cycle */
import { ReconciliationReportObject } from 'api/partner/reconciliation-report.api';
import { DataList } from '../../common';
import { GetDetailCustomQuoteResponse } from './scorecard-custom-quote.model';
import {
  GetStandardQuoteResponse,
  GetStepSummaryStandardQuoteResponse,
  SetCreateScorecardQuantityParams,
} from './scorecard-summary-standardquote.model';
import { DataTradeInBicycleRequest, DataTradeInRequest } from './trade-in-request.model';

export type ScorecardStatus =
  | 'DECLINED'
  | 'INCOMPLETE_SUMMARY'
  | 'INCOMPLETE_UPLOAD_IMAGES'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'CUSTOM_QUOTE_INCOMPLETE'
  | 'CUSTOM_QUOTE_PENDING_REVIEW'
  | 'CUSTOM_QUOTE_VALUE_PROVIDED'
  | 'CANCEL'
  | 'INCOMPLETE_DETAIL'
  | 'CANCELED_DETAIL'
  | 'CANCELED_SUMMARY'
  | 'CANCELED_IMAGE'
  | 'CANCELED_SHIPPING'
  | 'CANCELED_COMPLETE'
  | 'CANCELED_TRANSFERRED'
  | 'RETURNED_TO_SHOP'
  | 'EXPIRED'
  | 'QUOTE'
  | 'EXPIRED_QUOTE'
  | 'COMPLETE_RED_BARN'
  | 'INCOMPLETE_RED_BARN'
  | 'ACCEPTED_RED_BARN'
  | 'DECLINED_RED_BARN'
  | 'CANCELED_RED_BARN';

export type ReimbursementStatus = 'OPEN' | 'DUE' | 'PAID' | 'CANCELED' | 'NON_COMPLIANT';

export interface Bikes {
  brand: string;
  model: string;
  year: string;
  id?: string;
}
export interface ScoreCardItem {
  allowAdminCancel: boolean;
  cancel: boolean;
  createdTime: string;
  customerName: string;
  inventoryId: number;
  inventoryStage: string;
  inventoryStatus: string;
  partnerAddress: string;
  partnerName: string;
  save: boolean;
  status: ScorecardStatus;
  statusId: number;
  statusName: string;
  titleBicycle: string;
  tradeInId: number;
  tradeInValue: number;
  lastModifyCancelBy: 'BY_PARTNER' | 'BY_ADMIN';
  isArchived?: boolean;
  customerEmail?: string;
  reimbursementStatus?: string;
  payoutValue?: number;
  customQuoteId?: number;
  shippingType?: string;
  tradeInRequestId?: number;
  tradeInQuoteId?: number;
  date_created?: string;
  lead_source?: string;
  bike?: Bikes;
  partner?: {
    name: string;
    _id: string;
  };
  condition?: string;
  trade_in_value?: number;
  status_view?: string | ScorecardStatus;
  stage_view?: string;
  bicycleName?: string;
  _id?: string;
  name?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  bicycleId?: string;
  brand?: string;
  model?: string;
  year?: string;
  notes?: string;
  title?: string;
  frameSize?: string;
  drivetrain?: string;
  wheels?: string;
  value?: number;
  id?: string;
}

export interface ShippmentSuccessPayload {
  active?: boolean;
  billingWeight?: number;
  carrierType?: string;
  createdTime?: string;
  fromCity?: string;
  fromCountryCode?: string;
  fromLine?: string;
  fromStateCode?: string;
  fromZipCode?: string;
  fullLinkLabel?: string;
  height?: number;
  inboundBaseShippingFee?: number;
  inboundOversizeShippingFee?: number;
  inboundShippingType?: string;
  inventoryId?: number;
  isOversized?: boolean;
  length?: number;
  realTotalChargeAmount?: number;
  schedulePickup?: boolean;
  shipmentId?: number;
  shipmentType?: string;
  shippingConfigId?: number;
  toCity?: string;
  toCountryCode?: string;
  toLine?: string;
  toStateCode?: string;
  toZipCode?: string;
  totalChargeAmount?: number;
  totalChargeCurrency?: string;
  trackingNumber?: string;
  tradeInId?: number;
  weight?: number;
  width?: number;
}

export interface ScorecardModel {
  scorecardList: DataList<ScoreCardItem>;
  reimbursementList: DataList<ReimbursementItem>;
  dataStepSummaryStandardQuote: GetStepSummaryStandardQuoteResponse;
  dataDetailStandardQuote: GetStandardQuoteResponse;
  dataStepShippingAndCompleteStandardQuote: GetStepShippingAndCompleteStandardQuoteResponse;
  dataDetailCustomQuote: GetDetailCustomQuoteResponse;
  dataStepDetailStandardQuote: GetStepDetailStandardQuoteResponse;
  visibleModalValueProvidedCustomQuote: boolean;
  loading: boolean;
  shipment: ShippmentSuccessPayload;
  reconciliationReport: ReconciliationReportObject;
  dataTradeInRequest: DataTradeInRequest;
  dataTradeInBicycleRequest: DataTradeInBicycleRequest;
  loadingButton: boolean;
  createScoreCardQuantityData: SetCreateScorecardQuantityParams;
  dataBarcodeInventory: GetBarcodeInventoryResponse;
  dataFeedbackByScoreCard: GetFeedBackByScoreCardResponse;
  dataReportScorecard: ReportScorecardResponse;
  checkDataExist?: boolean;
  detaillHistoryLead?: ScoreCardItem;
  dataRedBarnReport?: RedBarnReportResponse;
  detaillHistoryQuote?: ScoreCardItem;
  loadingBarcode: boolean;
}

export interface GetListTradeInBicycleParams {
  brandId: number | string;
  chargerIncluded: boolean;
  ebikeSubtypeId: number | string;
  hasKey: boolean;
  isEbike?: boolean;
  modelId: number | string;
  yearId: number | string;
  bicycleId?: number | string;
  bicycleIndex?: number;
  isTamperedWith?: boolean;
  hasDiagnosticReport?: boolean;
  eBikeHours?: number | string;
  eBikeMileage?: number | string;
  brand?: string;
  familyName?: string;
  upgradeCompIds?: number[] | string[];
  condition?: string;
  tradeInValue?: number | string;
  frameSize?: string;
}

export interface AddTradeInDropOffParams {
  brandId: number | string;
  modelId: number | string;
  partnerId: string;
  step: string;
  yearId: number | string;
}

export interface Component {
  id: number;
  componentTypeId: number;
  componentName: string;
  componentValue: string;
  categoryName: string;
}

export interface OtherBicycle {
  bicycleId: number;
  yearId: number;
  yearName: string;
  imageDefault: string;
  isEbike: boolean;
}

export interface UpgradeComp {
  id: number;
  name: string;
  percentValue: number;
  up: boolean;
}

export interface UpgradeCompModifier {
  tradeInUpgradeCompId: number;
  minMsrp: number;
  maxMsrp: number;
  percentModifier: number;
}

export interface TradeInPriceConfig {
  id: number;
  name: string;
  price: number;
}

export interface Condition {
  condition: string;
  percent: number;
  message: string;
  tradeInValue: number;
  tradeInPriceConfigs: TradeInPriceConfig[];
}

export interface GetListTradeInBicycleResponse {
  bicycleId: number;
  msrp: number;
  imageDefault: string;
  images: string[];
  components: Component[];
  otherBicycles: OtherBicycle[];
  upgradeComps: UpgradeComp[];
  upgradeCompModifiers: UpgradeCompModifier[];
  conditions: Condition[];
  uncleanTradeInValueDecrease: number;
  bicycleTypeId: number;
  bicycleTypeName: string;
  isEbike: boolean;
  bicycleName?: string;
}

export interface BicycleBaseInfo {
  bicycleId: number;
  bicycleModelId: number;
  bicycleModelName: string;
  bicycleBrandId: number;
  bicycleBrandName: string;
  bicycleYearId: number;
  bicycleYearName: string;
  retailPrice: number;
  bicycleProductFamily: string;
}

export interface TradeInComponent {
  id: {
    tradeInId: number;
    inventoryCompTypeId: number;
  };
  value: string;
}

export interface RedBarnComponent {
  redBarnCompDetailId: {
    redBarnScorecardId: number;
    inventoryCompTypeId: number;
  };
  value: string;
}

export interface BicycleComponent {
  id: number;
  componentTypeId: number;
  componentName: string;
  componentValue: string;
  categoryName: string;
}

export interface Owner {
  name: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  licenseOrPassport: string;
  serial: string;
  confirmEmail?: string;
  paypalEmail?: string;
}

export interface Proof {
  name: string;
  date: Date;
}

export interface GetStepDetailStandardQuoteResponse {
  tradeInId: number;
  tradeValue: number;
  condition: string;
  bicycleTypeId: number;
  bicycleBaseInfo: BicycleBaseInfo;
  tradeInComponents: TradeInComponent[];
  redBarnComponents?: RedBarnComponent[];
  bicycleComponents: BicycleComponent[];
  spec: any[];
  upgradeComps: any[];
  owner: Owner;
  proof: Proof;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  hasDiagnosticReport?: boolean;
  hasKey?: boolean;
  isEbike?: boolean;
  isInstantPayout?: boolean;
  isTamperedWith?: boolean;
  chargerIncluded?: boolean;
  eBikeHours: string | number;
  eBikeMileage: string | number;
  ebikeSubtypeId: string | number;
  bicycleOtherType: GetListTradeInBicycleParams;
  confirmEmail?: string;
  paypalEmail?: string;
}

export interface TradeInSummaryBody {
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  id?: string | number;
  owner: {
    address: string;
    city: string;
    email: string;
    firstName: string;
    lastName: string;
    licenseOrPassport: string;
    name: string;
    paypalEmail: string;
    phone: string;
    serial: string;
    state: string;
    zipCode: string;
  };
  paypalEmail?: string;
  proof: {
    date: string | Date;
    name: string;
  };
  save: boolean;
}

export interface TradeIn {
  id: number;
  bicycleId: number;
  partnerId: string;
  value: number;
  serialNumber: string;
  ownerName: string;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerLicensePassport: string;
  ownerFirstName: string;
  ownerLastName: string;
  proofName: string;
  proofDate: Date;
  createdTime: Date;
  lastUpdate: Date;
  condition: string;
  title: string;
  partnerAddress: string;
  partnerName: string;
  userCreatedId: string;
  status: string;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  adminArchived: boolean;
  save: boolean;
  archived: boolean;
}

export interface TradeInImage {
  imageId?: number;
  fullLink?: string;
  id?: string;
  url?: string;
  file?: string | File;
  isDeleted?: boolean;
  isEdited?: boolean;
  initialImage?: boolean;
  inventoryId?: number;
  title?: string;
  subTitle?: string;
}

export interface ImageType {
  id: number;
  name: string;
  defaultImage: string;
  require: boolean;
}

export interface GetTradeInByIdResponseStepThreeResponse {
  tradeIn: TradeIn;
  tradeInImages: TradeInImage[];
  imageTypes: ImageType[];
}

export interface CalculateShippingResponse {
  totalCharge: number;
  carrierType: string;
}

export interface BlueBook {
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZipCode: string;
  fullLinkLabel: string;
  height: number;
  length: number;
  oversized: boolean;
  scheduled: boolean;
  weight: number;
  width: number;
}

export interface MyAccount {
  carrier: string;
  carrierTrackingNumber: string;
}

export interface DropOff {}

export interface GetStepShippingAndCompleteStandardQuoteResponse {
  tradeInId: number;
  blueBook: BlueBook;
  myAccount: MyAccount;
  dropOff: DropOff;
  shippingType: string;
}

export interface PageSetup {
  about: string;
}

export interface ShippingAddress {
  country: string;
}

export interface BindingAddress {
  country: string;
}

export interface IsActive {
  is_active: boolean;
}

export interface Status {
  active: IsActive;
  is_lock: boolean;
}

export interface Usersss {
  status: Status;
  _id: string;
  email: string;
  user_name: string;
  role: string;
  gravatar: string;
}

export interface CheckCustomerExistData {
  page_setup: PageSetup;
  shipping_address: ShippingAddress;
  binding_address: BindingAddress;
  avatar: string;
  token_email: string;
  role_base: any[];
  _id: string;
  user: Usersss;
  first_name: string;
  last_name: string;
  country: string;
  zip_code: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  email: string;
  date_created: Date;
  date_updated: Date;
  name_search: string;
  customer_stripe: string;
}

export interface CheckCustomerExistResponse {
  is_exists: boolean;
  data: CheckCustomerExistData;
}

export interface ReimbursementItem {
  add_on: number;
  dateReceived: string;
  inventoryId: number;
  partnerId: string;
  partnerName: string;
  poNumber: string;
  purchaseOrderId: string;
  status: ReimbursementStatus;
  subtotal: number;
  total: number;
  tradeInId: number;
}

export interface GetBarcodeInventoryResponse {
  id: number;
  bicycleId: number;
  bicycleModelName: string;
  bicycleBrandName: string;
  bicycleYearName: string;
  bicycleTypeName: string;
  description: string;
  imageDefaultId: number;
  imageDefault: string;
  status: string;
  msrpPrice: number;
  initialListPrice: number;
  currentListedPrice: number;
  cogsPrice: number;
  flatPriceChange: number;
  discountedPrice: number;
  createdTime: Date;
  lastUpdate: Date;
  partnerId: string;
  sellerId: string;
  stage: string;
  serialNumber: string;
  name: string;
  typeId: number;
  title: string;
  condition: string;
  countTrackingView: number;
  scoreCardId: number;
  recordType: string;
  privatePartyValue: number;
  valueAdditionalComponent: number;
  bbbValue: number;
  searchGuideRecommendation: string;
  valueGuidePrice: number;
  dealPercent: number;
  storefrontId: string;
  sellerIsBBB: boolean;
  noteToCustomer: string;
  proofDate: Date;
  scorecardStatus: string;
  isNonBbbShippingService: boolean;
  isTradeInAccepted: boolean;
  inboundShippingInsuranceAdded: boolean;
  isInstantPayout: boolean;
  subDescription: string;
  customQuote: boolean;
  createPo: boolean;
  delete: boolean;
}

export interface Partner {
  id: string;
  email: string;
  name: string;
}

export interface GetFeedBackByScoreCardResponse {
  partner: Partner;
  _id: string;
  scorecardid: string;
  type: string;
  message: string;
  date_created: Date;
  date_updated: Date;
}

export interface ReportScorecardResponse {
  inventoryId: number;
  inventoryRecord: string;
  name: string;
  scorecardStatus: string;
  tradeInValue: number;
  ownerName: string;
  scorecardId: number;
  createdDate: Date;
  partnerId: string;
  receivedDate: Date;
  partnerName: string;
  shippingState: string;
  accountManagerId: string;
  accountManager: string;
}

export interface DataRedBarnReport {
  licensingScorecardId: string;
  createdDate: Date;
  accountName: string;
  scorecardStatus: string;
  bikeDescription: string;
  tradeInValue: number;
  accountManger: string;
  ownerName: string;
  bikeName?: string;
}

export interface RedBarnReportResponse {
  data: DataRedBarnReport[];
  page: number;
  total_item: number;
  page_size: number;
  total_page: number;
}
