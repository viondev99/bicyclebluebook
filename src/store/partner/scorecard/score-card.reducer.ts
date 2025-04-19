import {
  GetStandardQuoteResponse,
  GetStepSummaryStandardQuoteResponse,
} from 'model/store/partner/scorecard-summary-standardquote.model';
import { Action, handleActions } from 'redux-actions';
import {
  GetBarcodeInventoryResponse,
  GetFeedBackByScoreCardResponse,
  GetStepDetailStandardQuoteResponse,
  GetStepShippingAndCompleteStandardQuoteResponse,
  RedBarnReportResponse,
  ReportScorecardResponse,
  ScorecardModel,
  ShippmentSuccessPayload,
} from 'model/store/partner/scorecard.model';
import { DataList } from 'model/common';
import { GetDetailCustomQuoteResponse } from 'model/store/partner/scorecard-custom-quote.model';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY } from 'helpers/utilities.helper';
import { cloneDeep } from 'lodash';
import {
  ListReconciliationReportPayload,
  ReimbursementSuccessPayload,
  ScoreCardDetailLeadSuccessPayload,
  // ScoreCardDetailLeadSuccessPayload,
  ScoreCardPayload,
  ScoreCardSuccessPayload,
} from './score-card.action';

const INIT_STATE: ScorecardModel = {
  scorecardList: new DataList(),
  reimbursementList: new DataList(),
  dataStepSummaryStandardQuote: null,
  dataDetailStandardQuote: null,
  dataStepShippingAndCompleteStandardQuote: null,
  dataDetailCustomQuote: null,
  visibleModalValueProvidedCustomQuote: false,
  dataStepDetailStandardQuote: null,
  loading: false,
  shipment: null,
  reconciliationReport: null,
  dataTradeInRequest: null,
  dataTradeInBicycleRequest: null,
  loadingButton: false,
  createScoreCardQuantityData: DATA_RESET_CREATE_SCORECARD_QUANTITY,
  dataBarcodeInventory: null,
  dataFeedbackByScoreCard: null,
  dataReportScorecard: null,
  checkDataExist: false,
  detaillHistoryLead: null,
  dataRedBarnReport: null,
  detaillHistoryQuote: null,
  loadingBarcode: false,
};

const scorecardReducer = handleActions<ScorecardModel, ScoreCardPayload>(
  {
    SET_STEP_SUMMARY_STANDARD_QUOTE: (state) => {
      return { ...state, dataStepSummaryStandardQuote: null };
    },
    SET_CREATE_SCORECARD_QUANTITY: (state, action: any) => {
      return { ...state, createScoreCardQuantityData: { ...state.createScoreCardQuantityData, ...action.payload } };
    },
    HANDLE_EXPORT_SCORECARD_HISTORY: (state) => {
      return { ...state, loadingButton: true };
    },
    HANDLE_EXPORT_SCORECARD_HISTORY_SUCCEEDED: (state) => {
      return { ...state, loadingButton: false };
    },
    HANDLE_EXPORT_SCORECARD_HISTORY_FAILED: (state) => {
      return { ...state, loadingButton: false };
    },
    GET_STEP_DETAIL_STANDARD_QUOTE: (state) => {
      return { ...state, loading: true };
    },
    GET_STEP_DETAIL_STANDARD_QUOTE_SUCCEEDED: (state, action: Action<GetStepDetailStandardQuoteResponse>) => {
      return { ...state, dataStepDetailStandardQuote: action.payload, loading: false };
    },
    GET_STEP_DETAIL_STANDARD_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },

    GET_STEP_DETAIL_REQUEST: (state) => {
      return { ...state, loading: true };
    },
    GET_STEP_DETAIL_REQUEST_SUCCEEDED: (state, action: any) => {
      return {
        ...state,
        loading: false,
        dataTradeInRequest: action.payload.dataTradeInRequest,
        dataTradeInBicycleRequest: action.payload.dataTradeInBicycleRequest,
      };
    },
    GET_STEP_DETAIL_REQUEST_FAILED: (state) => {
      return { ...state, loading: false };
    },

    GET_DETAIL_CUSTOM_QUOTE: (state) => {
      return { ...state, dataDetailCustomQuote: null, loading: true };
    },
    GET_DETAIL_CUSTOM_QUOTE_SUCCEEDED: (state, action: Action<GetDetailCustomQuoteResponse>) => {
      return { ...state, dataDetailCustomQuote: action.payload, loading: false };
    },
    GET_DETAIL_CUSTOM_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },
    SAVE_DETAIL_CUSTOM_QUOTE: (state, action: Action<GetDetailCustomQuoteResponse>) => {
      return { ...state, dataDetailCustomQuote: action.payload };
    },

    GET_STEP_SHIPPING_AND_COMPLETE_STANDARD_QUOTE: (state) => {
      return { ...state, dataStepShippingAndCompleteStandardQuote: null, loading: true };
    },
    GET_STEP_SHIPPING_AND_COMPLETE_STANDARD_QUOTE_SUCCEEDED: (
      state,
      action: Action<GetStepShippingAndCompleteStandardQuoteResponse>,
    ) => {
      return { ...state, dataStepShippingAndCompleteStandardQuote: action.payload, loading: false };
    },
    GET_STEP_SHIPPING_AND_COMPLETE_STANDARD_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },

    GET_STEP_SUMMARY_STANDARD_QUOTE: (state) => {
      return { ...state, loading: true };
    },
    GET_STEP_SUMMARY_STANDARD_QUOTE_SUCCEEDED: (state, action: Action<GetStepSummaryStandardQuoteResponse>) => {
      return { ...state, dataStepSummaryStandardQuote: action.payload, loading: false };
    },
    GET_STEP_SUMMARY_STANDARD_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },

    GET_SCORECARD: (state) => {
      return { ...state, loading: true };
    },
    GET_SCORECARD_SUCCEEDED: (state, action: Action<ScoreCardSuccessPayload>) => {
      return { ...state, scorecardList: action.payload, loading: false };
    },
    GET_SCORECARD_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_SHIPMENT: (state) => {
      return { ...state, loading: true };
    },
    GET_SHIPMENT_SUCCEEDED: (state, action: Action<ShippmentSuccessPayload>) => {
      return { ...state, shipment: action.payload, loading: false };
    },
    GET_SHIPMENT_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_LIST_REIMBURSEMENT: (state) => {
      return { ...state, loading: true };
    },
    GET_LIST_REIMBURSEMENT_SUCCEEDED: (state, action: Action<ReimbursementSuccessPayload>) => {
      return { ...state, reimbursementList: action.payload, loading: false };
    },
    GET_LIST_REIMBURSEMENT_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_LIST_RECONCILIATION_REPORT: (state) => {
      return { ...state, loading: true };
    },
    GET_LIST_RECONCILIATION_REPORT_SUCCEEDED: (state, action: Action<ListReconciliationReportPayload>) => {
      return { ...state, reconciliationReport: action.payload, loading: false };
    },
    GET_LIST_RECONCILIATION_REPORT_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_BARCODE_INVENTORY: (state) => {
      return { ...state, loadingBarcode: true };
    },
    GET_BARCODE_INVENTORY_SUCCEEDED: (state, action: Action<GetBarcodeInventoryResponse>) => {
      return { ...state, dataBarcodeInventory: action.payload, loadingBarcode: false };
    },
    GET_BARCODE_INVENTORY_FAILED: (state) => {
      return { ...state, dataBarcodeInventory: null, loadingBarcode: false };
    },
    GET_PARTNER_FEEDBACK_BY_SCORECARD: (state) => {
      return { ...state };
    },
    GET_PARTNER_FEEDBACK_BY_SCORECARD_SUCCEEDED: (state, action: Action<GetFeedBackByScoreCardResponse>) => {
      return { ...state, dataFeedbackByScoreCard: action.payload };
    },
    GET_PARTNER_FEEDBACK_BY_SCORECARD_FAILED: (state) => {
      return { ...state, dataFeedbackByScoreCard: null };
    },
    REPORT_SCORECARD: (state) => {
      return { ...state, checkData: false };
    },
    REPORT_SCORECARD_SUCCEEDED: (state, action: Action<ReportScorecardResponse>) => {
      return { ...state, dataReportScorecard: action.payload, checkDataExist: true };
    },
    REPORT_SCORECARD_FAILED: (state) => {
      return { ...state, dataReportScorecard: null, checkDataExist: true };
    },
    GET_DETAIL_SCORECARD_HISTORY_LEAD: (state) => {
      return { ...state, loading: true };
    },
    GET_DETAIL_SCORECARD_HISTORY_LEAD_SUCCEEDED: (state, action: Action<ScoreCardDetailLeadSuccessPayload>) => {
      return { ...state, detaillHistoryLead: action.payload, loading: false };
    },
    GET_DETAIL_SCORECARD_HISTORY_LEAD_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_RED_BARN_REPORT: (state) => {
      return { ...state, loading: true };
    },
    GET_RED_BARN_REPORT_SUCCEEDED: (state, action: Action<RedBarnReportResponse>) => {
      return { ...state, dataRedBarnReport: action.payload, loading: false };
    },
    GET_RED_BARN_REPORT_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_STEP_DETAIL_RED_BARN_QUOTE: (state) => {
      return { ...state, loading: true };
    },
    GET_STEP_DETAIL_RED_BARN_QUOTE_SUCCEEDED: (state, action: Action<GetStepDetailStandardQuoteResponse>) => {
      return { ...state, dataStepDetailStandardQuote: action.payload, loading: false };
    },
    GET_STEP_DETAIL_RED_BARN_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_STEP_SUMMARY_RED_BARN_QUOTE: (state) => {
      return { ...state, loading: true };
    },
    GET_STEP_SUMMARY_RED_BARN_QUOTE_SUCCEEDED: (state, action: Action<GetStepSummaryStandardQuoteResponse>) => {
      return { ...state, dataStepSummaryStandardQuote: action.payload, loading: false };
    },
    GET_STEP_SUMMARY_RED_BARN_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },
    SET_SUB_STEP_SCORE_CARD: (state, action: Action<number>) => {
      const { createScoreCardQuantityData } = state;
      const { listDataStepStandardQuote, indexScorecardSelected } = createScoreCardQuantityData;

      const cloneArr = cloneDeep(listDataStepStandardQuote);
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        subStep: action.payload,
      };
      return {
        ...state,
        createScoreCardQuantityData: { ...createScoreCardQuantityData, listDataStepStandardQuote: cloneArr },
      };
    },
    GET_DETAIL_CUSTOM_RED_BARN_QUOTE: (state) => {
      return { ...state, loading: true };
    },
    GET_DETAIL_CUSTOM_RED_BARN_QUOTE_SUCCEEDED: (state, action: Action<GetDetailCustomQuoteResponse>) => {
      return { ...state, dataDetailCustomQuote: action.payload, loading: false };
    },
    GET_DETAIL_CUSTOM_RED_BARN_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_DETAIL_RED_BARN_QUOTE: (state) => {
      return { ...state, loading: true };
    },
    GET_DETAIL_RED_BARN_QUOTE_SUCCEEDED: (state, action: Action<GetStandardQuoteResponse>) => {
      return { ...state, dataDetailStandardQuote: action.payload, loading: false };
    },
    GET_DETAIL_RED_BARN_QUOTE_FAILED: (state) => {
      return { ...state, loading: false };
    },
  },
  INIT_STATE,
  {
    prefix: 'scorecard',
  },
);

export default scorecardReducer;
