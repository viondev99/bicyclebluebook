/* eslint-disable import/named */
import {
  GetStandardQuoteResponse,
  GetStepSummaryStandardQuoteResponse,
  HandleExportScorecardHistoryParams,
  SetCreateScorecardQuantityParams,
} from 'model/store/partner/scorecard-summary-standardquote.model';
import { createActions } from 'redux-actions';
import {
  GetBarcodeInventoryResponse,
  GetFeedBackByScoreCardResponse,
  GetStepDetailStandardQuoteResponse,
  GetStepShippingAndCompleteStandardQuoteResponse,
  RedBarnReportResponse,
  ReimbursementItem,
  ReportScorecardResponse,
  ScoreCardItem,
  ShippmentSuccessPayload,
} from 'model/store/partner/scorecard.model';
import { GetDetailCustomQuoteResponse } from 'model/store/partner/scorecard-custom-quote.model';
import { DataList } from 'model/common';
import { ReconciliationReportObject } from 'api/partner/reconciliation-report.api';
import { ReportScorecardPayload } from 'api/partner/scorecard.api';
import { RedBarnReportPayload } from 'api/partner/trade-in-account.api';

export type GetScorecardPayload = {
  isArchived?: boolean;
  statuses: string;
  stages?: string;
  content: string;
  page: number;
  sort: string;
  typeSort: string;
  tabName?: string | string[];
  typeTradeIn?: string;
  startDate?: string;
  endDate?: string;
};

export type GetListReimbursementPayload = {
  fromDay?: string;
  page?: number;
  size?: number;
  sortField?: string;
  sortType?: string;
  status?: string;
  toDay?: string;
};

export type GetBarcodeInventoryPayload = {
  inventoryId: string;
};

export type GetFeedBackByScoreCardPayload = {
  scoreCardId: string;
};

export type ScoreCardSuccessPayload = DataList<ScoreCardItem>;

export type ReimbursementSuccessPayload = DataList<ReimbursementItem>;

export type ListReconciliationReportPayload = ReconciliationReportObject;

export type ScoreCardDetailLeadSuccessPayload = ScoreCardItem;

export type ScoreCardPayload =
  | ScoreCardSuccessPayload
  | GetScorecardPayload
  | GetStepSummaryStandardQuoteResponse
  | GetStepShippingAndCompleteStandardQuoteResponse
  | ShippmentSuccessPayload
  | GetDetailCustomQuoteResponse
  | ReimbursementSuccessPayload
  | GetListReimbursementPayload
  | ListReconciliationReportPayload
  | HandleExportScorecardHistoryParams
  | GetFeedBackByScoreCardResponse
  | ReportScorecardPayload
  | SetCreateScorecardQuantityParams
  | ScoreCardDetailLeadSuccessPayload
  | RedBarnReportPayload
  | number;

const {
  getScorecard,
  getScorecardSucceeded,
  getScorecardFailed,
  getStepSummaryStandardQuote,
  getStepSummaryStandardQuoteSucceeded,
  getStepSummaryStandardQuoteFailed,
  getStepShippingAndCompleteStandardQuote,
  getStepShippingAndCompleteStandardQuoteSucceeded,
  getStepShippingAndCompleteStandardQuoteFailed,
  getShipment,
  getShipmentSucceeded,
  getShipmentFailed,
  getDetailCustomQuote,
  getDetailCustomQuoteSucceeded,
  getDetailCustomQuoteFailed,
  getStepDetailRequest,
  getStepDetailRequestSucceeded,
  getStepDetailRequestFaild,
  getStepDetailStandardQuote,
  getStepDetailStandardQuoteSucceeded,
  getStepDetailStandardQuoteFailed,
  getListReimbursement,
  getListReimbursementSucceeded,
  getListReimbursementFailed,
  getListReconciliationReport,
  getListReconciliationReportSucceeded,
  getListReconciliationReportFailed,
  saveDetailCustomQuote,
  handleExportScorecardHistory,
  handleExportScorecardHistorySucceeded,
  handleExportScorecardHistoryFailed,
  setCreateScorecardQuantity,
  setStepSummaryStandardQuote,
  getBarcodeInventory,
  getBarcodeInventorySucceeded,
  getBarcodeInventoryFailed,
  getPartnerFeedbackByScorecard,
  getPartnerFeedbackByScorecardSucceeded,
  getPartnerFeedbackByScorecardFailed,
  reportScorecard,
  reportScorecardSucceeded,
  reportScorecardFailed,
  getDetailScorecardHistoryLead,
  getDetailScorecardHistoryLeadSucceeded,
  getDetailScorecardHistoryLeadFailed,
  getRedBarnReport,
  getRedBarnReportSucceeded,
  getRedBarnReportFailed,
  getDetailScorecardHistoryQuote,
  getDetailScorecardHistoryQuoteSucceeded,
  getDetailScorecardHistoryQuoteFailed,
  getStepDetailRedBarnQuote,
  getStepDetailRedBarnQuoteSucceeded,
  getStepDetailRedBarnQuoteFailed,
  getStepSummaryRedBarnQuote,
  getStepSummaryRedBarnQuoteSucceeded,
  getStepSummaryRedBarnQuoteFailed,
  setSubStepScoreCard,
  getDetailCustomRedBarnQuote,
  getDetailCustomRedBarnQuoteSucceeded,
  getDetailCustomRedBarnQuoteFailed,
  getDetailRedBarnQuote,
  getDetailRedBarnQuoteSucceeded,
  getDetailRedBarnQuoteFailed,
} = createActions(
  {
    GET_SCORECARD: (payload: GetScorecardPayload) => payload,
    GET_SCORECARD_SUCCEEDED: (payload: ScoreCardSuccessPayload) => payload,
    GET_SCORECARD_FAILED: null,
    GET_STEP_SUMMARY_STANDARD_QUOTE: (payload: string) => payload,
    GET_STEP_SUMMARY_STANDARD_QUOTE_SUCCEEDED: (payload: GetStepSummaryStandardQuoteResponse) => payload,
    GET_STEP_SUMMARY_STANDARD_QUOTE_FAILED: null,
    SET_STEP_SUMMARY_STANDARD_QUOTE: null,
    GET_STEP_SHIPPING_AND_COMPLETE_STANDARD_QUOTE: (payload: string) => payload,
    GET_STEP_SHIPPING_AND_COMPLETE_STANDARD_QUOTE_SUCCEEDED: (
      payload: GetStepShippingAndCompleteStandardQuoteResponse,
    ) => payload,
    GET_STEP_SHIPPING_AND_COMPLETE_STANDARD_QUOTE_FAILED: null,
    GET_SHIPMENT: (payload: string) => payload,
    GET_SHIPMENT_SUCCEEDED: (payload: ShippmentSuccessPayload) => payload,
    GET_SHIPMENT_FAILED: null,
    GET_DETAIL_CUSTOM_QUOTE: (payload: string) => payload,
    GET_DETAIL_CUSTOM_QUOTE_SUCCEEDED: (payload: GetDetailCustomQuoteResponse) => payload,
    GET_DETAIL_CUSTOM_QUOTE_FAILED: null,
    GET_STEP_DETAIL_STANDARD_QUOTE: (payload: string) => payload,
    GET_STEP_DETAIL_STANDARD_QUOTE_SUCCEEDED: (payload: GetStepDetailStandardQuoteResponse) => payload,
    GET_STEP_DETAIL_STANDARD_QUOTE_FAILED: null,
    GET_LIST_REIMBURSEMENT: (payload: GetListReimbursementPayload) => payload,
    GET_LIST_REIMBURSEMENT_SUCCEEDED: (payload: ReimbursementSuccessPayload) => payload,
    GET_LIST_REIMBURSEMENT_FAILED: null,
    GET_LIST_RECONCILIATION_REPORT: (payload: ListReconciliationReportPayload) => payload,
    GET_LIST_RECONCILIATION_REPORT_SUCCEEDED: (payload: ListReconciliationReportPayload) => payload,
    GET_LIST_RECONCILIATION_REPORT_FAILED: (payload: any) => null,
    GET_STEP_DETAIL_REQUEST: (payload: string) => payload,
    GET_STEP_DETAIL_REQUEST_SUCCEEDED: (payload) => payload,
    GET_STEP_DETAIL_REQUEST_FAILED: null,
    SAVE_DETAIL_CUSTOM_QUOTE: (payload?: GetDetailCustomQuoteResponse) => payload,
    HANDLE_EXPORT_SCORECARD_HISTORY: (payload: HandleExportScorecardHistoryParams) => payload,
    HANDLE_EXPORT_SCORECARD_HISTORY_SUCCEEDED: null,
    HANDLE_EXPORT_SCORECARD_HISTORY_FAILED: null,
    SET_CREATE_SCORECARD_QUANTITY: (payload: SetCreateScorecardQuantityParams) => payload,
    GET_BARCODE_INVENTORY: (payload: GetBarcodeInventoryPayload) => payload,
    GET_BARCODE_INVENTORY_SUCCEEDED: (payload: GetBarcodeInventoryResponse) => payload,
    GET_BARCODE_INVENTORY_FAILED: null,
    GET_PARTNER_FEEDBACK_BY_SCORECARD: (payload: GetFeedBackByScoreCardPayload) => payload,
    GET_PARTNER_FEEDBACK_BY_SCORECARD_SUCCEEDED: (payload: GetFeedBackByScoreCardResponse) => payload,
    GET_PARTNER_FEEDBACK_BY_SCORECARD_FAILED: null,
    REPORT_SCORECARD: (payload: ReportScorecardPayload) => payload,
    REPORT_SCORECARD_SUCCEEDED: (payload: ReportScorecardResponse) => payload,
    REPORT_SCORECARD_FAILED: null,
    GET_DETAIL_SCORECARD_HISTORY_LEAD: (payload: string) => payload,
    GET_DETAIL_SCORECARD_HISTORY_LEAD_SUCCEEDED: (payload: ScoreCardDetailLeadSuccessPayload) => payload,
    GET_DETAIL_SCORECARD_HISTORY_LEAD_FAILED: null,
    GET_RED_BARN_REPORT: (payload: RedBarnReportPayload) => payload,
    GET_RED_BARN_REPORT_SUCCEEDED: (payload: RedBarnReportResponse) => payload,
    GET_RED_BARN_REPORT_FAILED: null,
    GET_DETAIL_SCORECARD_HISTORY_QUOTE: (payload: string) => payload,
    GET_DETAIL_SCORECARD_HISTORY_QUOTE_SUCCEEDED: (payload: ScoreCardDetailLeadSuccessPayload) => payload,
    GET_DETAIL_SCORECARD_HISTORY_QUOTE_FAILED: null,
    GET_STEP_DETAIL_RED_BARN_QUOTE: (payload: string) => payload,
    GET_STEP_DETAIL_RED_BARN_QUOTE_SUCCEEDED: (payload: GetStepDetailStandardQuoteResponse) => payload,
    GET_STEP_DETAIL_RED_BARN_QUOTE_FAILED: null,
    GET_STEP_SUMMARY_RED_BARN_QUOTE: (payload: string) => payload,
    GET_STEP_SUMMARY_RED_BARN_QUOTE_SUCCEEDED: (payload: GetStepSummaryStandardQuoteResponse) => payload,
    GET_STEP_SUMMARY_RED_BARN_QUOTE_FAILED: null,
    SET_SUB_STEP_SCORE_CARD: (payload: number) => payload,
    GET_DETAIL_CUSTOM_RED_BARN_QUOTE: (payload: string) => payload,
    GET_DETAIL_CUSTOM_RED_BARN_QUOTE_SUCCEEDED: (payload: GetDetailCustomQuoteResponse) => payload,
    GET_DETAIL_CUSTOM_RED_BARN_QUOTE_FAILED: null,
    GET_DETAIL_RED_BARN_QUOTE: (payload: string) => payload,
    GET_DETAIL_RED_BARN_QUOTE_SUCCEEDED: (payload: GetStandardQuoteResponse) => payload,
    GET_DETAIL_RED_BARN_QUOTE_FAILED: null,
  },
  {
    prefix: 'scorecard',
  },
);

export default {
  getScorecard,
  getScorecardSucceeded,
  getScorecardFailed,
  getStepSummaryStandardQuote,
  getStepSummaryStandardQuoteSucceeded,
  getStepSummaryStandardQuoteFailed,
  getStepShippingAndCompleteStandardQuote,
  getStepShippingAndCompleteStandardQuoteSucceeded,
  getStepShippingAndCompleteStandardQuoteFailed,
  getShipment,
  getShipmentSucceeded,
  getShipmentFailed,
  getDetailCustomQuote,
  getDetailCustomQuoteSucceeded,
  getDetailCustomQuoteFailed,
  getStepDetailStandardQuote,
  getStepDetailStandardQuoteSucceeded,
  getStepDetailStandardQuoteFailed,
  getListReimbursement,
  getListReimbursementSucceeded,
  getListReimbursementFailed,
  getListReconciliationReport,
  getListReconciliationReportSucceeded,
  getListReconciliationReportFailed,
  getStepDetailRequest,
  getStepDetailRequestSucceeded,
  getStepDetailRequestFaild,
  saveDetailCustomQuote,
  handleExportScorecardHistory,
  handleExportScorecardHistorySucceeded,
  handleExportScorecardHistoryFailed,
  setCreateScorecardQuantity,
  setStepSummaryStandardQuote,
  getBarcodeInventory,
  getBarcodeInventorySucceeded,
  getBarcodeInventoryFailed,
  getPartnerFeedbackByScorecard,
  getPartnerFeedbackByScorecardSucceeded,
  getPartnerFeedbackByScorecardFailed,
  reportScorecard,
  reportScorecardSucceeded,
  reportScorecardFailed,
  getDetailScorecardHistoryLead,
  getDetailScorecardHistoryLeadSucceeded,
  getDetailScorecardHistoryLeadFailed,
  getRedBarnReport,
  getRedBarnReportSucceeded,
  getRedBarnReportFailed,
  getDetailScorecardHistoryQuote,
  getDetailScorecardHistoryQuoteSucceeded,
  getDetailScorecardHistoryQuoteFailed,
  getStepDetailRedBarnQuote,
  getStepDetailRedBarnQuoteSucceeded,
  getStepDetailRedBarnQuoteFailed,
  getStepSummaryRedBarnQuote,
  getStepSummaryRedBarnQuoteSucceeded,
  getStepSummaryRedBarnQuoteFailed,
  setSubStepScoreCard,
  getDetailCustomRedBarnQuote,
  getDetailCustomRedBarnQuoteSucceeded,
  getDetailCustomRedBarnQuoteFailed,
  getDetailRedBarnQuote,
  getDetailRedBarnQuoteSucceeded,
  getDetailRedBarnQuoteFailed,
};
