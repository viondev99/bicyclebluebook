/* eslint-disable no-param-reassign */
import { objectToFormData } from 'helpers/objectToFormdata.helper';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import {
  HandleExportScorecardHistoryExportParams,
  HandleExportScorecardHistoryExportResponse,
} from 'model/store/partner/scorecard-summary-standardquote.model';
import Router from 'next/router';
import { GetListReimbursementPayload, ReimbursementSuccessPayload } from 'store/partner/scorecard/score-card.action';
import authorizedRequest from '../../helpers/request/authorizedRequest';
import { DataList } from '../../model/common';
import {
  CalculateShippingResponse,
  CheckCustomerExistResponse,
  GetStepShippingAndCompleteStandardQuoteResponse,
  GetStepDetailStandardQuoteResponse,
  GetTradeInByIdResponseStepThreeResponse,
  ScoreCardItem,
  TradeInSummaryBody,
} from '../../model/store/partner/scorecard.model';

export type GetScorecardResponse = DataList<ScoreCardItem>;

type GetScorecardQuery = {
  isArchived?: boolean;
  content?: string;
  page?: number;
  size?: number;
  sort?: string;
  sortField?: string;
  statuses?: string;
  typeSort?: string;
  sortType?: string;
  isIncomplete?: boolean;
  isReturnedToShop?: boolean;
  isCancelled?: boolean;
  typeTradeIn?: string;
  stage?: string;
  startDate?: string;
  endDate?: string;
  stageFilter?: string;
};

interface ArchiveActionTradeHistoryParams {
  tradeInId: number;
  isArchive: boolean;
}

export interface CreateNewTradeInResponse {
  id: number;
  bicycleId: number;
  partnerId: string;
  value: number;
  createdTime: Date;
  lastUpdate: Date;
  condition: string;
  title: string;
  partnerAddress: string;
  partnerName: string;
  userCreatedId: string;
  status: string;
  isInstantPayout: boolean;
  save: boolean;
  archived: boolean;
  adminArchived: boolean;
}

export interface CreateNewRedbarnResponse {
  id: string;
  bicycleId: number;
  partnerId: string;
  value: number;
  createdTime: Date;
  lastUpdate: Date;
  condition: string;
  title: string;
  partnerAddress: string;
  partnerName: string;
  userCreatedId: string;
  status: string;
  isInstantPayout: boolean;
  save: boolean;
  archived: boolean;
  adminArchived: boolean;
}

export interface CreateNewTradeInBody {
  bicycleId: number | string;
  chargerIncluded: boolean;
  clean: any;
  compRequests: {
    compId: string;
    value: string;
  }[];
  condition: string;
  hasDiagnosticReport: boolean;
  hasKey: boolean;
  isEbike?: boolean;
  isTamperedWith: boolean;
  upgradeCompIds: number[];
  value: number | Number;
  save?: boolean;
  eBikeHours?: number;
  eBikeMileage?: number;
  ebikeSubtypeId?: string;
  tradeInSaveAsQuoteRequest?: TradeInSaveAsQuoteRequest;
  ownerNotes?: string;
  status?: string;
  stage?: string;
}

export interface TradeInSaveAsQuoteRequest {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  ownerFirstName: string;
  ownerLastName: string;
  notes: string;
  shopEmployee: string;
}

export interface CreateNewTradeInParams {
  isInstantPayout?: boolean;
  id?: number | string | string[];
}

export interface CreateNewTradeInCustomQuoteProvidedValuePayload {
  customQuoteId?: string;
  redBarnCustomId?: string;
}

export interface TradeInDetailDeclineBody {
  comment: string;
  reasonDeclineId: string;
  tradeInId?: number;
  priceExpected?: string | number;
  customQuoteId?: number | string;
  redBarnCustomQuoteId?: string | number;
}

export interface GetTradeInByIdParams {
  indexStep: number;
  id: string | number;
}

export interface CheckTradeInCompleteStepResponse {
  indexStep: number;
  status: string;
  tradeInId: number;
  scoreCardId?: number | string;
}

export interface CreateTradeInImageResponse {
  isSave: boolean;
  oldImageIdsNewOrder: string[];
}

export interface DeleteTradeInImageResponse {
  imageIds: string[];
  isSave: boolean;
  oldImageIdsNewOrder: string[];
}

export interface CalculateShippingRequest {
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZipCode: string;
  height: string | number;
  length: string | number;
  weight: string | number;
  width: string | number;
  shippingType?: string;
  tradeInId?: string | number;
}

export interface CompleteShippingShippingSelectTwoRequest {
  carrier: string;
  carrierTrackingNumber: string;
  shippingType: string;
  tradeInId: string | number;
}

export interface CompleteShippingShippingSelectThreeRequest {
  dropOffContactEmail: string;
  dropOffTime: string | Date;
  shippingType: string;
  tradeInId: string;
}

export interface CompleteCustomQuoteRequest {
  draft: boolean;
  clean?: boolean;
  brandName: string;
  condition: string;
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  modelName: string;
  note: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  serialNumber: string;
  typeId: number;
  upgradeCompIds: number[];
  yearId: number;
  yearName?: string;
  compCustomQuotes: {
    compId: string;
    value: string;
  }[];
  redBarnCustomId?: string;
}

export interface CompleteCustomQuoteResponse {
  customQuoteId?: number;
  tradeInId?: number;
}

export interface CompleteCustomRedBarnQuoteResponse {
  redBarnCustomQuotesId?: string;
  scorecardRedBarnId?: string;
}
interface CustomerObject {
  email: string;
  first_name: string;
  last_name: string;
  city: string;
  address: string;
  state: string;
  zip_code: string;
  phone: string;
}

export interface CompleteCustomQuoteUploadImageParams {
  isDraft: boolean;
  oldImageIdsNewOrder: string[];
}

export interface DeleteCustomQuoteUploadImageParams {
  isDraft: boolean;
  oldImageIdsNewOrder: string[];
  imageIds: string[];
}
export interface BillingGiftPayload {
  customer: {
    address: string;
    city: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    phone: string;
    state: string;
    zip_code: string;
  };
  name: string;
  price: number;
  scorecard: number;
  scorecard_info: string;
}

export interface CreateFeedbackByScorecardPayload {
  bike?: {
    brand: object;
    bike_type: object;
    model: string;
  };
  message: string;
  scorecardid: string;
  type: string;
}

export interface GetTradeInExpireResponse {
  currentTradeInValue: number;
  newTradeInValue: number;
  oldStatusBeforeExpire: string;
  statusTradeIn: string;
  tradeInId: number;
}

export interface GetValueExpiredRedBarnResponse {
  tradeInRedBarnId?: string;
  statusTradeInRedBarn: string;
  newTradeInRedBarnValue: number;
  oldTradeInRedBarnValue: number;
  redBarnCustomQuoteId?: string;
}

export interface PatchTradeInActiveResponse {
  newTradeInValue: number;
  oldTradeInValue: number;
  statusTradeIn: string;
  tradeInId: number;
}

export interface PatchTradeInCancelResponse {
  tradeInId: number;
  partnerAddress: string;
  partnerName: string;
  createdTime: Date;
  customerName: string;
  customerEmail: string;
  titleBicycle: string;
  statusId: number;
  statusName: string;
  status: string;
  customQuoteId: number;
  inventoryId: number;
  inventoryStatus: string;
  inventoryStage: string;
  lastModifyCancelBy: string;
  tradeInValue: number;
  partnerId: string;
  isReactivated: boolean;
  save: boolean;
  cancel: boolean;
  allowAdminCancel: boolean;
}

interface ReportScorecardResponse {
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

export interface ReportScorecardPayload {
  crm?: boolean;
  displayTypes: string[];
  fromDate: number;
  partnerIds: string[];
  sortField: string;
  sortType: string;
  toDate: number;
}

export interface UpdateTradeInPayload {
  id: string | number;
  stage: string;
}

export interface UpdateTradeInAppPayload {
  id: string | number;
  bicycleId: number | string;
  condition: string;
  driveTrainsModificationId: number;
  isDraft: boolean;
  ownerDetails: {
    ownerAddress?: string;
    ownerCity?: string;
    ownerEmail?: string;
    ownerFirstName?: string;
    ownerLastName?: string;
    ownerLicensePassport?: string;
    ownerPhone?: string;
    ownerState?: string;
    ownerZipCode?: string;
    serialNumber?: string;
  };
  ownerEmail?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerZipCode?: string;
  partnerId?: string;
  shopDetails?: {
    employeeEmail?: string;
    employeeLocation?: string;
    employeeName?: string;
    proofDate?: string;
    proofName?: string;
  };
  value: number;
  wheelsModificationId?: number;
}

export interface GetBarcodeInventory {
  inventoryId: string;
}

export interface ReNewRedBarnResponse {
  archived: boolean;
  condition: string;
  createdTime: string;
  delete: boolean;
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  id: string;
  lastReactiveTime: string;
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
  statusBeforeCanceled: string;
  title: string;
  userCreatedId: string;
}

interface UploadImageScorecardTradeInApp {
  scorecardId: number;
  newImages: ImageUpload[];
  newImageIndexes?: number[];
  oldImageIdsNewOrder?: number[];
}

export function getScorecard(query: GetScorecardQuery) {
  return authorizedRequest.get<GetScorecardResponse>('/core/api/tradeIns', {
    params: query,
  });
}

export function getScorecardQuotes(query: GetScorecardQuery) {
  return authorizedRequest.get<GetScorecardResponse>('/core/api/tradeIn/quote', {
    params: query,
  });
}

export function getShipment(id: string) {
  return authorizedRequest.get<string>(`shipment/api/tradeIn/${id}/shipment`);
}

export function getScorecardHistoryInstantPayoutRequest(params: GetScorecardQuery) {
  return authorizedRequest.get<GetScorecardResponse>('/core/api/tradeIns/payout', {
    params,
  });
}
export function getScorecardHistoryTradeInRequest(params: GetScorecardQuery) {
  return authorizedRequest.get<GetScorecardResponse>('/core/api/tradeIn/requests', {
    params,
  });
}

export function getScorecardHistoryRedBarnQuoteRequest(params: GetScorecardQuery) {
  return authorizedRequest.get<GetScorecardResponse>('/core/api/scorecard/redbarn', {
    params,
  });
}

export function getStepSummaryStandardQuoteRequest(id: string, isQuoteTab?: boolean) {
  let url = `/core/api/tradeIn/${id}`;
  if (Router?.router?.query?.isQuote === 'true' || isQuoteTab) {
    url = `/core/api/tradeIn/quote/${id}/detail`;
  }
  return authorizedRequest.get<GetStepDetailStandardQuoteResponse>(`${url}`, {
    params: {
      indexStep: 1,
    },
  });
}
export function getStepShippingAndCompleteStandardQuoteRequest(id: string) {
  return authorizedRequest.get<GetStepShippingAndCompleteStandardQuoteResponse>(`/core/api/tradeIn/${id}`, {
    params: {
      indexStep: 3,
    },
  });
}

export function getStepDetailStandardQuoteRequest(id: string) {
  let url = `/core/api/tradeIn/${id}`;
  if (Router?.router?.query?.isQuote === 'true') {
    url = `/core/api/tradeIn/quote/${id}/detail`;
  }
  return authorizedRequest.get<GetStepDetailStandardQuoteResponse>(`${url}`, {
    params: {
      indexStep: 0,
    },
  });
}

export function getTradeInByIdRequestStepImage(params: GetTradeInByIdParams) {
  const { id, indexStep } = params || {};
  return authorizedRequest.get<GetTradeInByIdResponseStepThreeResponse>(`/core/api/tradeIn/${id}`, {
    params: {
      indexStep,
    },
  });
}

export function cancelActionTradeHistory(id: number) {
  return authorizedRequest.patch<GetScorecardResponse>(`/core/api/tradeIn/${id}/cancel`, null, {
    params: {
      isCancel: true,
    },
  });
}
export function archiveActionTradeHistory(tradeInId: number) {
  return authorizedRequest.patch<GetScorecardResponse>(`/core/api/tradeIn/archived`, null, {
    params: {
      tradeInId,
      isArchive: true,
    },
  });
}
export function moveToInboxActionTradeHistory(tradeInId: number) {
  return authorizedRequest.patch<GetScorecardResponse>(`/core/api/tradeIn/archived`, null, {
    params: {
      tradeInId,
      isArchive: false,
    },
  });
}

export function createNewTradeIn(body: CreateNewTradeInBody, params: CreateNewTradeInParams) {
  return authorizedRequest.post<CreateNewTradeInResponse>(`/core/api/tradeIn`, body, {
    params,
  });
}

export function updateNewTradeIn(body: CreateNewTradeInBody, params: CreateNewTradeInParams) {
  return authorizedRequest.put<CreateNewTradeInResponse>(`/core/api/tradeIn/${params?.id}`, body);
}

export function createNewTradeInRedbarn(body: CreateNewTradeInBody, params: CreateNewTradeInParams) {
  return authorizedRequest.post<CreateNewRedbarnResponse>(`/core/api/scorecard/redbarn`, body, {
    params,
  });
}

export function updateNewTradeInRedbarn(body: CreateNewTradeInBody, params: CreateNewTradeInParams) {
  return authorizedRequest.put<CreateNewTradeInResponse>(`/core/api/scorecard/redbarn/${params?.id}`, body);
}
export function getRedBarnQuoteRequest(id: string) {
  const url = `/core/api/scorecard/redbarn/${id}`;
  return authorizedRequest.get<any>(`${url}`, { params: { isGetAllInfo: true } });
}

export function getStepDetailRedBarnQuoteRequest(id: string) {
  const url = `/core/api/scorecard/redbarn/${id}`;

  return authorizedRequest.get<GetStepDetailStandardQuoteResponse>(`${url}`, {
    params: {
      indexStep: 0,
    },
  });
}

export function getStepSummaryRedBarnQuoteRequest(id: string, isQuoteTab?: boolean) {
  const url = `/core/api/scorecard/redbarn/${id}`;

  return authorizedRequest.get<GetStepDetailStandardQuoteResponse>(`${url}`, {
    params: {
      indexStep: 1,
    },
  });
}

export function declineRedBarnRequest(id: string, body: TradeInDetailDeclineBody) {
  return authorizedRequest.post(`core/api/scorecard/redbarn/${id}/decline`, body);
}

// export function updateNewTradeIn(body: CreateNewTradeInBody, params: CreateNewTradeInParams) {
//   return authorizedRequest.put<CreateNewTradeInResponse>(`/core/api/tradeIn`, body, {
//     params,
//   });
// }

export function createNewTradeInCustomQuoteProvidedValueRequest(
  body: CreateNewTradeInCustomQuoteProvidedValuePayload,
  params: CreateNewTradeInParams,
) {
  return authorizedRequest.post<CreateNewTradeInCustomQuoteProvidedValuePayload>(`/core/api/tradeIn`, body, {
    params,
  });
}

export function createNewRedBarnCustomQuoteProvidedValueRequest(params: CreateNewTradeInParams) {
  return authorizedRequest.put<CreateNewTradeInCustomQuoteProvidedValuePayload>(
    `/core/api/complete/redbarn/customQuote?id=${params?.id}`,
  );
}

export function tradeInDetailDecline(body: TradeInDetailDeclineBody) {
  return authorizedRequest.post<CreateNewTradeInResponse>(`core/api/tradeIn/detailDecline`, body);
}

export function customRedBarnDecline(id: string, payload: TradeInDetailDeclineBody) {
  return authorizedRequest.post<CreateNewTradeInResponse>(`core/api/scorecard/redbarn/${id}/decline`, payload);
}

export function createTradeInSummaryRequest(payload: TradeInSummaryBody) {
  const { id } = payload || {};
  delete payload.id;
  return authorizedRequest.post<CreateNewTradeInResponse>(`/core/api/tradeIn/summary/${id}`, payload);
}

export function createRedBarnSummaryRequest(payload: TradeInSummaryBody) {
  const { id } = payload || {};
  delete payload.id;
  return authorizedRequest.put<CreateNewTradeInResponse>(`core/api/scorecard/redbarn/${id}`, payload);
}

export function checkTradeInCompleteStepRequest(id: string) {
  let url = `/core/api/tradeIn/common/${id}`;
  if (Router?.router?.query?.isQuote === 'true' || Router?.router?.query?.tab === 'quotes') {
    url = `core/api/tradeIn/quote/common/${id}`;
  }
  return authorizedRequest.get<CheckTradeInCompleteStepResponse>(`${url}`);
}

export function checkTradeInCompleteQuotesStepRequest(id: string) {
  const url = `core/api/tradeIn/quote/common/${id}`;
  return authorizedRequest.get<CheckTradeInCompleteStepResponse>(`${url}`);
}

export function updateTradeInImageRequest(id: string, body: FormData, params: CreateTradeInImageResponse) {
  return authorizedRequest.put<CreateTradeInImageResponse>(`/core/api/tradeIn/${id}/image`, body, {
    params,
  });
}

export function deleteTradeInImageRequest(id: string, params: DeleteTradeInImageResponse) {
  return authorizedRequest.delete<DeleteTradeInImageResponse>(`/core/api/tradeIn/${id}/image`, {
    params,
  });
}

export function calculateShippingRequest(params: CalculateShippingRequest) {
  return authorizedRequest.get<CalculateShippingResponse>(`/shipment/api/shipment/inbound/fee`, {
    params,
  });
}

export function completeShippingShippingSelectOneRequest(params: CalculateShippingRequest) {
  return authorizedRequest.post<CalculateShippingResponse>(`/core/api/tradeIn/shipping`, null, {
    params,
  });
}

export function completeShippingShippingSelectTwoRequest(params: CompleteShippingShippingSelectTwoRequest) {
  return authorizedRequest.post<void>(`/core/api/tradeIn/shipping`, null, {
    params,
  });
}

export function completeShippingShippingSelectThreeRequest(params: CompleteShippingShippingSelectThreeRequest) {
  return authorizedRequest.post<void>(`/core/api/tradeIn/shipping`, null, {
    params,
  });
}

export function saveShippingShippingSelectThreeRequest(
  params: Partial<
    CalculateShippingRequest & CompleteShippingShippingSelectTwoRequest & CompleteShippingShippingSelectThreeRequest
  >,
) {
  return authorizedRequest.post<void>(`/core/api/tradeIn/shipping`, null, {
    params,
  });
}

export function completeCustomQuoteRequest(body: CompleteCustomQuoteRequest) {
  return authorizedRequest.post<CompleteCustomQuoteResponse>(`/core/api/tradeIn/customQuote`, body);
}

export function saveFirstCustomQuoteRequest(body: Partial<CompleteCustomQuoteRequest>) {
  return authorizedRequest.post<CompleteCustomQuoteResponse>(`/core/api/tradeIn/customQuote`, body);
}
export function saveCustomQuoteRequest(id: string, body: Partial<CompleteCustomQuoteRequest>) {
  return authorizedRequest.put<CompleteCustomQuoteResponse>(`/core/api/tradeIn/customQuote/${id}`, body);
}

export function saveFirstCustomRedBarnQuoteRequest(body: Partial<CompleteCustomQuoteRequest>) {
  return authorizedRequest.post<CompleteCustomRedBarnQuoteResponse>(`/core/api/redbarn/customQuote`, body);
}
export function saveCustomRedBarnQuoteRequest(id: string, body: Partial<CompleteCustomQuoteRequest>) {
  return authorizedRequest.put<CompleteCustomRedBarnQuoteResponse>(`/core/api/redbarn/customQuote/${id}`, body);
}

export function getDetailCustomQuoteRequest(id: string) {
  return authorizedRequest.get<void>(`/core/api/tradeIn/customQuote/${id}`);
}

export function getDetailCustomRedBarnQuoteRequest(id: string) {
  return authorizedRequest.get<void>(`/core/api/tradeIn/redbarn/customQuote/${id}`);
}

// export function saveFirstCustomQuoteRequest(payload: CreateFeedbackByScorecardPayload) {
//   return authorizedRequest.post<void>(`/support/api/v1/partner/feedback`, payload);
// }

export function completeCustomQuoteUploadImageRequest(
  id: CompleteCustomQuoteResponse,
  body: FormData,
  params: CompleteCustomQuoteUploadImageParams,
) {
  return authorizedRequest.put<void>(`/core/api/tradeIn/customQuote/${id?.customQuoteId}/image`, body, {
    params,
  });
}

export function completeCustomRedBarnQuoteUploadImageRequest(
  id: CompleteCustomRedBarnQuoteResponse,
  body: FormData,
  params: CompleteCustomQuoteUploadImageParams,
) {
  return authorizedRequest.put<void>(`/core/api/redbarn/customQuote/${id?.redBarnCustomQuotesId}/image`, body, {
    params,
  });
}

export function deleteCustomQuoteUploadImageRequest(id: string, params: DeleteCustomQuoteUploadImageParams) {
  return authorizedRequest.delete<void>(`/core/api/tradeIn/customQuote/${id}/image`, {
    params,
  });
}

export function deleteCustomRedBarnQuoteUploadImageRequest(id: string, params: DeleteCustomQuoteUploadImageParams) {
  return authorizedRequest.delete<void>(`/core/api/redbarn/customQuote/${id}/image`, {
    params,
  });
}

export function checkCustomerExistRequest(email: string) {
  return authorizedRequest.post<CheckCustomerExistResponse>(`/auth/api/v1/customers/check-exists`, { email });
}

export function createCustomerRequest(customer: CustomerObject) {
  const formData = objectToFormData(customer, { indices: true });

  return authorizedRequest.post<CustomerObject>(`/auth/api/v1/customers/create`, formData, {
    params: {
      withCredentials: false,
    },
  });
}

export function billingGiftRequest(payload: BillingGiftPayload) {
  return authorizedRequest.post<CustomerObject>(`/billing/api/v1/gift`, payload, {
    params: {
      withCredentials: false,
    },
  });
}

export function partnerFeedbackByScorecardRequest(scorecardid: string) {
  return authorizedRequest.get<void>(`/support/api/v1/partner/feedback-by-scorecard`, {
    params: {
      scorecardid,
    },
  });
}

export function createFeedbackByScorecardRequest(payload: CreateFeedbackByScorecardPayload) {
  return authorizedRequest.post<void>(`/support/api/v1/partner/feedback`, payload);
}

export function getTradeInExpireRequest(id: string) {
  return authorizedRequest.get<GetTradeInExpireResponse>(`/core/api/tradeIn/${id}/expire`);
}

export function getTradeInExpireQuotesRequest(id: string) {
  return authorizedRequest.get<GetTradeInExpireResponse>(`/core/api/tradeIn/quote/${id}/expire`);
}

export function patchTradeInActiveRequest(id: string) {
  return authorizedRequest.patch<PatchTradeInActiveResponse>(`/core/api/tradeIn/${id}/expire/active`);
}

export function patchReactivateQuoteRequest(id: string) {
  return authorizedRequest.patch<PatchTradeInActiveResponse>(`/core/api/tradeIn/${id}/expire/active`, null, {
    params: {
      isQuote: true,
    },
  });
}

export function postReactivateQuoteRequest(id: string) {
  return authorizedRequest.post<PatchTradeInActiveResponse>(`/core/api/tradeIn/quote/${id}/expire/active`);
}

export function patchTradeInCancelRequest(id: string) {
  return authorizedRequest.patch<PatchTradeInCancelResponse>(`/core/api/tradeIn/${id}/cancel`, null, {
    params: {
      isCancel: false,
    },
  });
}

export function getListReimbursement(query: GetListReimbursementPayload) {
  return authorizedRequest.get<ReimbursementSuccessPayload>('/core/api/purchaseOrder', {
    params: query,
  });
}

export function updateStatusQuotes(id: string | number, stage: string) {
  return authorizedRequest.patch<CreateNewTradeInResponse>(`/core/api/tradeIn/quote/${id}`, { stage });
}

export function saveAsQuote(body: CreateNewTradeInBody, params: CreateNewTradeInParams) {
  if (Router?.router?.query?.isQuote === 'true') {
    return authorizedRequest.patch<CreateNewTradeInResponse>(
      `/core/api/tradeIn/quote/${Router?.router?.query?.id}`,
      body,
      {
        params,
      },
    );
  }
  return authorizedRequest.post<CreateNewTradeInResponse>('/core/api/tradeIn/quote', body, {
    params,
  });
}

export function handleExportScorecardHistoryRequest(params: Partial<HandleExportScorecardHistoryExportParams>) {
  return authorizedRequest.get<HandleExportScorecardHistoryExportResponse>('/core/api/tradeIns/export', {
    params,
  });
}

export function getBarcodeInventoryRequest(id: string) {
  return authorizedRequest.get<GetBarcodeInventory>(`/core/api/inventory/scorecard/${id}`);
}

export function reportScorecardRequest(payload: ReportScorecardPayload) {
  return authorizedRequest.post<ReportScorecardResponse>(
    `/warehouse/api/inventory/report/trek-factory/scorecard-status`,
    {
      displayTypes: payload?.displayTypes,
      fromDate: payload?.fromDate,
      partnerIds: payload?.partnerIds,
      sortField: payload?.sortField,
      sortType: payload?.sortType,
      toDate: payload?.toDate,
    },
  );
}

export function updateQuoteStatusStageRequest(id: number, stageTradeIn: string) {
  return authorizedRequest.put<void>(`/core/api/tradeIn/quote/statusStage/${id}`, null, {
    params: {
      stageTradeIn,
    },
  });
}

export function updateTradeInStatusStageRequest(payload: UpdateTradeInPayload) {
  return authorizedRequest.put<void>(`/core/api/tradeIns/app/statusStage/`, null, {
    params: {
      id: payload.id,
      stage: payload.stage,
    },
  });
}

export function updateTradeInAppRequest(payload: UpdateTradeInAppPayload) {
  return authorizedRequest.put<void>(`/core/api/tradeIn/app/${payload?.id}`, payload);
}

export function uploadImageTradeInAppRequest(payload: UploadImageScorecardTradeInApp) {
  return authorizedRequest.put<void>(`/core/api/tradeIn/app/${payload?.scorecardId}/image`, payload?.newImages, {
    params: {
      oldImageIdsNewOrder: payload.oldImageIdsNewOrder,
    },
  });
}

export function handleCancelRedBarnRequest(id: string) {
  return authorizedRequest.post<void>(`core/api/scorecard/redbarn/${id}/cancel`, id);
}

export function getValueExpireRedBarnRequest(id: string) {
  return authorizedRequest.get<GetValueExpiredRedBarnResponse>(`/core/api/tradeIn/redbarn/${id}/expire`);
}

export function reactiveRedBarnRequest(id: string, tradeInRedBarnValue?: number) {
  return authorizedRequest.patch<GetValueExpiredRedBarnResponse>(`/core/api/tradeIn/redbarn/${id}/expire/reActivated`, {
    params: tradeInRedBarnValue,
  });
}

export function reNewRedBarnRequest(id: string) {
  return authorizedRequest.post<ReNewRedBarnResponse>(`/core/api/scorecard/redbarn/${id}/renew`);
}
