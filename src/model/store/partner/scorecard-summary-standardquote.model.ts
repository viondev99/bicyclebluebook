// eslint-disable-next-line import/no-cycle
import { FormSummary } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/formDefaultValue';
import { UpgradeCompsName } from 'constants/scorecard';
// eslint-disable-next-line import/no-cycle
import { RedBarnComponent } from './scorecard.model';

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

export interface Id {
  tradeInId: number;
  inventoryCompTypeId: number;
}

export interface TradeInComponent {
  id: Id;
  value: string;
}

export interface BicycleComponent {
  id: number;
  componentTypeId: number;
  componentName: string;
  componentValue: string;
  categoryName: string;
}

export interface Spec {
  specId: number;
  specName: string;
  specValue: string;
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
  notes: string;
  confirmEmail?: string;
  paypalEmail?: string;
}

export interface Proof {
  name: string;
  date: Date;
}

interface UpgradeComps {
  id: string;
  name: UpgradeCompsName;
  percentValue: number;
  up: boolean;
  value: string;
}

export interface GetStepSummaryStandardQuoteResponse {
  tradeInId: number;
  tradeValue: number;
  condition: string;
  bicycleTypeId: number;
  bicycleBaseInfo: BicycleBaseInfo;
  tradeInComponents: TradeInComponent[];
  redBarnComponents?: RedBarnComponent[];
  bicycleComponents: BicycleComponent[];
  spec: Spec[];
  upgradeComps: any[];
  owner: Owner;
  proof: Proof;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  isInstantPayout: boolean;
  bbbReviewNote: any;
  payoutAmount?: number;
  detailScoreCard?: number;
  customQuoteId?: number;
  confirmEmail?: string;
  paypalEmail?: string;
  status?: string;
  stage?: string;
  scoreCardId?: number | string;
}

export interface GetStandardQuoteResponse {
  archived: boolean;
  condition: string;
  createdTime: string;
  delete: boolean;
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  id: string;
  lastUpdate: string;
  ownerAddress: string;
  ownerCity: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerLicensePassport: string;
  ownerName: string;
  ownerPaypalEmail: string;
  ownerPhone: string;
  ownerState: string;
  ownerZipCode: string;
  partnerAddress: string;
  partnerId: string;
  partnerName: string;
  proofDate: string;
  proofName: string;
  redBarnCustomQuotesId: string;
  serialNumber: string;
  status: string;
  title: string;
  userCreatedId: string;
  value: number;
}
export interface HandleExportScorecardHistoryParams {
  activeType: string;
  content: string;
  statuses: string;
  isExportAll?: boolean;
  stages?: string;
  startDate?: string;
  endDate?: string;
  ranges?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface HandleExportScorecardHistoryExportParams {
  activeType: string;
  content: string;
  statuses: string;
  isExportAll?: boolean;
  sort: string;
  typeSort: string;
  scoreCardHistoryType: string;
  isArchived: boolean;
  isIncomplete: boolean;
  isReturnedToShop: boolean;
  isCancelled: boolean;
  typeTradeIn?: string;
  tradeInType?: string;
  stageFilter?: string;
  statusFilter?: string;
  startDateFilter?: string;
  endDateFilter?: string;
  ranges?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface DataScoreCardHistoryExport {
  tradeInId: number;
  partnerAddress: string;
  partnerName: string;
  createdTime: Date;
  titleBicycle: string;
  statusId: number;
  statusName: string;
  status: string;
  stage?: string;
  inventoryId: number;
  inventoryStatus: string;
  inventoryStage: string;
  tradeInValue: number;
  partnerId: string;
  isReactivated: boolean;
  isInstantPayout: boolean;
  save: boolean;
  cancel: boolean;
  allowAdminCancel: boolean;
  customerName: string;
  customerEmail: string;
  customQuoteId?: number;
  reimbursementStatus?: string;
  payoutValue?: number;
}

export interface HandleExportScorecardHistoryExportResponse {
  data: DataScoreCardHistoryExport[];
  page: number;
  total_item: number;
  page_size: number;
  total_page: number;
}

export interface SetCreateScorecardQuantityParams {
  isOpenModalNumberScorecard?: boolean;
  dataStepSummary?: Partial<FormSummary>;

  listDataStepCustomQuote: any[];
  listDataStepStandardQuote: any[];
  listDataStepEbikeQuote: any[];
  indexScorecardSelected: number;

  createScorecardQuantity?: number;
  type: string;
}
export enum RedBarnStatus {
  INCOMPLETE_RED_BARN = 'INCOMPLETE_RED_BARN',
  COMPLETE_RED_BARN = 'COMPLETE_RED_BARN',
}
