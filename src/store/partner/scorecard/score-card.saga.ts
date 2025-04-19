/* eslint-disable no-nested-ternary */
/* eslint-disable require-yield */
/* eslint-disable import/named */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { constHistoryPartnerTradeInTabName } from 'components/PartnerPortal/CostCalculator/constraint';
import {
  DataScoreCardHistoryExport,
  GetStepSummaryStandardQuoteResponse,
  HandleExportScorecardHistoryExportParams,
  HandleExportScorecardHistoryExportResponse,
  HandleExportScorecardHistoryParams,
} from 'model/store/partner/scorecard-summary-standardquote.model';
import {
  GetBarcodeInventoryResponse,
  GetFeedBackByScoreCardResponse,
  GetStepDetailStandardQuoteResponse,
  GetStepShippingAndCompleteStandardQuoteResponse,
  RedBarnReportResponse,
  ReportScorecardResponse,
  ShippmentSuccessPayload,
} from 'model/store/partner/scorecard.model';
import {
  getDetailCustomQuoteRequest,
  getListReimbursement,
  getScorecard,
  getScorecardHistoryInstantPayoutRequest,
  getScorecardHistoryTradeInRequest,
  GetScorecardResponse,
  getShipment,
  getStepDetailStandardQuoteRequest,
  getStepShippingAndCompleteStandardQuoteRequest,
  getStepSummaryStandardQuoteRequest,
  handleExportScorecardHistoryRequest,
  getBarcodeInventoryRequest,
  partnerFeedbackByScorecardRequest,
  reportScorecardRequest,
  ReportScorecardPayload,
  getScorecardQuotes,
  getStepDetailRedBarnQuoteRequest,
  getStepSummaryRedBarnQuoteRequest,
  getScorecardHistoryRedBarnQuoteRequest,
  getDetailCustomRedBarnQuoteRequest,
  getRedBarnQuoteRequest,
} from 'api/partner/scorecard.api';
import { GetDetailCustomQuoteResponse } from 'model/store/partner/scorecard-custom-quote.model';
import { getReconciliationReportApi, ReconciliationReportPayload } from 'api/partner/reconciliation-report.api';
import { DataTradeInBicycleRequest } from 'model/store/partner/trade-in-request.model';
import { dataTradeInBicycleRequested, dataTradeInRequested } from 'api/partner/trade-in-request.api';
import { DataTradeInResonse } from 'api/partner/data-trade-in-request';
import { exportXlsxFile } from 'helpers/utilities.helper';
import { toastError } from 'helpers/utils.helper';
import { capitalizeFirstLetter, formatCurrency } from 'helpers/string.helper';
import {
  ListFilterStagesQuotes,
  QuotesFilterStatus,
} from 'components/PartnerPortal/TradeInScoreCard/History/Filter/filterContaints';
import { getDetailHistoryQuoteRequest, getDetailLeadGenRequest, getListLeadGenRequest } from 'api/partner/account.api';
import moment from 'moment';
import { getRedBarnReportRequest, RedBarnReportPayload } from 'api/partner/trade-in-account.api';
import scorecardAction, {
  GetBarcodeInventoryPayload,
  GetFeedBackByScoreCardPayload,
  GetListReimbursementPayload,
  GetScorecardPayload,
  ListReconciliationReportPayload,
  ReimbursementSuccessPayload,
  ScoreCardDetailLeadSuccessPayload,
} from './score-card.action';

function* handleGetScorecard(action: Action<GetScorecardPayload>) {
  try {
    const { payload } = action;
    let response: GetScorecardResponse;

    if (payload?.tabName === constHistoryPartnerTradeInTabName.INSTANT_PAYOUT) {
      response = yield call(getScorecardHistoryInstantPayoutRequest, {
        isArchived: payload?.isArchived,
        isIncomplete: payload.statuses === 'INCOMPLETE' || undefined,
        isCancelled: payload.statuses === 'CANCEL' || undefined,
        isReturnedToShop: payload.statuses === 'RETURNED_TO_SHOP' || undefined,
        statuses:
          payload.statuses === 'INCOMPLETE' || payload.statuses === 'CANCEL' || payload.statuses === 'RETURNED_TO_SHOP'
            ? undefined
            : payload.statuses,
        content: payload.content,
        page: payload.page,
        size: 10,
        sort: payload.sort,
        typeSort: payload.typeSort,
      });
    } else if (payload?.tabName === constHistoryPartnerTradeInTabName.TRADE_IN_REQUEST) {
      response = yield call(getScorecardHistoryTradeInRequest, {
        content: payload.content,
        page: payload.page,
        size: 10,
        sort: payload.sort,
        typeSort: payload.typeSort,
        stageFilter: payload.stages,
        statuses:
          payload.statuses === 'INCOMPLETE' || payload.statuses === 'CANCEL' || payload.statuses === 'RETURNED_TO_SHOP'
            ? undefined
            : payload.statuses,
      });
    } else if (payload?.tabName === constHistoryPartnerTradeInTabName.QUOTES) {
      response = yield call(getScorecardQuotes, {
        isArchived: payload?.isArchived,
        isIncomplete: payload.statuses === 'INCOMPLETE' || undefined,
        isCancelled: payload.statuses === 'CANCEL' || undefined,
        isReturnedToShop: payload.statuses === 'RETURNED_TO_SHOP' || undefined,
        statuses:
          payload.statuses === 'INCOMPLETE' || payload.statuses === 'CANCEL' || payload.statuses === 'RETURNED_TO_SHOP'
            ? undefined
            : payload.statuses,
        stage: payload.stages,
        content: payload.content,
        page: payload.page,
        size: 10,
        sort: payload.sort,
        typeSort: payload.typeSort,
        typeTradeIn: payload?.typeTradeIn,
        startDate: payload?.startDate,
        endDate: payload?.endDate,
      });
    } else if (payload?.tabName === constHistoryPartnerTradeInTabName.LEAD) {
      response = yield call(getListLeadGenRequest, {
        status_view:
          payload.statuses === 'INCOMPLETE' || payload.statuses === 'CANCEL' || payload.statuses === 'RETURNED_TO_SHOP'
            ? undefined
            : payload.statuses,
        stage_view: payload?.stages,
        search_key: payload.content,
        page: payload.page,
        page_size: 10,
        sort: 'date_updated:-1',
        all_lead_sources: true,
        time_start: payload?.startDate,
        time_end: payload?.endDate,
      });
    } else if (payload?.tabName === constHistoryPartnerTradeInTabName.RED_BARN_QUOTE) {
      response = yield call(getScorecardHistoryRedBarnQuoteRequest, {
        statuses:
          payload.statuses === 'INCOMPLETE' || payload.statuses === 'CANCEL' || payload.statuses === 'RETURNED_TO_SHOP'
            ? undefined
            : payload.statuses,
        content: payload.content,
        page: payload.page,
        size: 10,
        sortField: payload.typeSort,
        sortType: payload.sort,
        startDate: payload?.startDate,
        endDate: payload?.endDate,
      });
    } else {
      response = yield call(getScorecard, {
        isArchived: payload?.isArchived,
        isIncomplete: payload.statuses === 'INCOMPLETE' || undefined,
        isCancelled: payload.statuses === 'CANCEL' || undefined,
        isReturnedToShop: payload.statuses === 'RETURNED_TO_SHOP' || undefined,
        statuses:
          payload.statuses === 'INCOMPLETE' || payload.statuses === 'CANCEL' || payload.statuses === 'RETURNED_TO_SHOP'
            ? undefined
            : payload.statuses,
        content: payload.content,
        page: payload.page,
        size: 10,
        sort: payload.sort,
        typeSort: payload.typeSort,
        typeTradeIn: payload?.typeTradeIn,
      });
    }

    yield put(scorecardAction.getScorecardSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getScorecardFailed());
  }
}

function* getStepSummaryStandardQuoteSaga(action: Action<string>) {
  try {
    const response: GetStepSummaryStandardQuoteResponse = yield call(
      getStepSummaryStandardQuoteRequest,
      action.payload,
    );
    yield put(scorecardAction.getStepSummaryStandardQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getStepSummaryStandardQuoteFailed());
  }
}

function* getStepShippingAndCompleteStandardQuoteSaga(action: Action<string>) {
  try {
    const response: GetStepShippingAndCompleteStandardQuoteResponse = yield call(
      getStepShippingAndCompleteStandardQuoteRequest,
      action.payload,
    );
    yield put(scorecardAction.getStepShippingAndCompleteStandardQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getStepShippingAndCompleteStandardQuoteFailed());
  }
}

function* getShipmentSaga(action: Action<string>) {
  try {
    const response: ShippmentSuccessPayload = yield call(getShipment, action.payload);

    yield put(scorecardAction.getShipmentSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getShipmentFailed());
  }
}

function* getDetailCustomQuoteSaga(action: Action<string>) {
  try {
    const response: GetDetailCustomQuoteResponse = yield call(getDetailCustomQuoteRequest, action.payload);
    yield put(scorecardAction.getDetailCustomQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getDetailCustomQuoteFailed());
  }
}

function* getDetailCustomRedBarnQuoteSaga(action: Action<string>) {
  try {
    const response: GetDetailCustomQuoteResponse = yield call(getDetailCustomRedBarnQuoteRequest, action.payload);
    yield put(scorecardAction.getDetailCustomRedBarnQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getDetailCustomRedBarnQuoteFailed());
  }
}

function* getStepDetailStandardQuoteSaga(action: Action<string>) {
  try {
    const response: GetStepDetailStandardQuoteResponse = yield call(getStepDetailStandardQuoteRequest, action.payload);
    yield put(scorecardAction.getStepDetailStandardQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getStepDetailStandardQuoteFailed());
  }
}

function* getStepDetailRedBarnQuoteSaga(action: Action<string>) {
  try {
    const response: GetStepDetailStandardQuoteResponse = yield call(getStepDetailRedBarnQuoteRequest, action.payload);
    yield put(scorecardAction.getStepDetailRedBarnQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getStepDetailRedBarnQuoteFailed());
  }
}
function* getStepSummaryRedBarnQuoteSaga(action: Action<string>) {
  try {
    const response: GetStepSummaryStandardQuoteResponse = yield call(getStepSummaryRedBarnQuoteRequest, action.payload);
    yield put(scorecardAction.getStepSummaryRedBarnQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getStepSummaryRedBarnQuoteFailed());
  }
}

function* getDetailRedBarnQuoteSaga(action: Action<string>) {
  try {
    const response: GetStepSummaryStandardQuoteResponse = yield call(getRedBarnQuoteRequest, action.payload);
    yield put(scorecardAction.getDetailRedBarnQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getDetailRedBarnQuoteFailed());
  }
}

function* getStepDetailRequestSaga(action: Action<string>) {
  try {
    const response1: DataTradeInResonse = yield call(dataTradeInRequested, action.payload);
    const params = {
      brandId: response1?.bicycleBaseInfo?.bicycleBrandId,
      modelId: response1?.bicycleBaseInfo?.bicycleModelId,
      yearId: response1?.bicycleBaseInfo?.bicycleYearId,
    };
    const response2: DataTradeInBicycleRequest = yield call(dataTradeInBicycleRequested, params);
    yield put(
      scorecardAction.getStepDetailRequestSucceeded({
        dataTradeInRequest: response1,
        dataTradeInBicycleRequest: response2,
      }),
    );
  } catch (e) {
    yield put(scorecardAction.getStepDetailRequestFaild());
  }
}

function transformFn(item: any) {
  if (item.lastModifyCancelBy === 'BY_ADMIN' && item.status.indexOf('CANCEL') > -1) {
    return 'Cancelled';
  }
  if (item.statusName.indexOf('Incomplete') > -1) {
    return item.statusName;
  }
  return item.statusName;
}

function* handleMapDataExport(
  listScorecardHistories: DataScoreCardHistoryExport[],
  payload: HandleExportScorecardHistoryParams,
) {
  const isQuotes = payload.activeType === 'quotes';
  const isInboxOrArchived = payload.activeType === 'scorecards' || payload.activeType === 'archive';
  const isTradeInRequest = payload.activeType === 'trade-in-request';

  const dataTable: DataScoreCardHistoryExport[] = listScorecardHistories || [];
  const resultInbox: any = [];
  const labelExcelInbox = isQuotes
    ? ['Date', 'ID', 'Bicycle', 'Location', 'Customer', 'Status', 'Stage', 'Value']
    : isInboxOrArchived
    ? ['Date', 'ID', 'Bicycle', 'Location', 'Customer', 'Status', 'Value']
    : isTradeInRequest
    ? ['Date', 'ID', 'Bicycle', 'Value', 'Customer', 'Email', 'Status']
    : ['Date', 'ID', 'Bicycle', 'Location', 'Customer', 'Scorecard status', 'Reimbursement Status', 'Value'];
  const colInbox =
    isInboxOrArchived || isTradeInRequest || isQuotes
      ? [{ width: 30 }, { width: 20 }, { width: 60 }, { width: 30 }, { width: 50 }, { width: 50 }, { width: 30 }]
      : [
          { width: 30 },
          { width: 20 },
          { width: 60 },
          { width: 30 },
          { width: 50 },
          { width: 50 },
          { width: 30 },
          { width: 60 },
        ];

  dataTable.forEach((item: DataScoreCardHistoryExport) => {
    let listResult: string[] = [];

    if (isQuotes) {
      listResult = [
        moment(item.createdTime).format('MM/DD/YYYY'),
        item.tradeInId.toString() || '-',
        item.titleBicycle || '-',
        item.partnerName || '-',
        item.customerName || '-',
        QuotesFilterStatus.find((it) => it.value === item?.status)?.label,
        ListFilterStagesQuotes.find((it) => it.value === item?.stage)?.label,
        `${formatCurrency(item.tradeInValue || 0)}`,
      ];
    } else if (isInboxOrArchived) {
      listResult = [
        moment(item.createdTime).format('MM/DD/YYYY'),
        item.tradeInId || '-',
        item.titleBicycle || '-',
        item.partnerName || '-',
        item.customerName || '-',
        transformFn(item),
        `${formatCurrency(item.tradeInValue || 0)}`,
      ];
    } else if (isTradeInRequest) {
      listResult = [
        moment(item.createdTime).format('MM/DD/YYYY'),
        item.tradeInId || '-',
        item.titleBicycle || '-',
        `${formatCurrency(item.tradeInValue || 0)}`,
        item.customerName || '-',
        item.customerEmail || '-',
        transformFn(item),
      ];
    } else {
      listResult = [
        moment(item.createdTime).format('MM/DD/YYYY'),
        item.tradeInId || '-',
        item.titleBicycle || '-',
        item.partnerName || '-',
        item.customerName || '-',
        transformFn(item),
        item.reimbursementStatus ? item.reimbursementStatus.toLocaleLowerCase().replace(/_/g, ' ') : '-',
        `Trade-in: ${formatCurrency(item.tradeInValue || 0)} - Commission: ${formatCurrency(item.payoutValue || 0)}`,
      ];
    }
    resultInbox.push(listResult);
  });
  return {
    rowLabel: [labelExcelInbox],
    dataExport: resultInbox,
    listFormatCol: colInbox,
  };
}

function formatDateWithTime(date: any) {
  if (date) {
    return moment(date).local().format('MM/DD/YYYY, hh:mm A');
  }
  return '';
}

function handleFormatStatus(status: string, payload: HandleExportScorecardHistoryParams) {
  if (!status) {
    return 'All Status';
  }
  switch (payload.activeType) {
    case constHistoryPartnerTradeInTabName.QUOTES:
      return QuotesFilterStatus.find((it) => it.value === status)?.label;

    default:
      return status;
  }
}
function handleFormatStages(stage: string, payload: HandleExportScorecardHistoryParams) {
  if (!stage) {
    return 'All Stages';
  }
  switch (payload.activeType) {
    case constHistoryPartnerTradeInTabName.QUOTES:
      return ListFilterStagesQuotes.find((it) => it.value === stage)?.label;

    default:
      return stage;
  }
}

function* handleExportScorecardHistory(
  listScorecardHistories: DataScoreCardHistoryExport[],
  payload: HandleExportScorecardHistoryParams,
) {
  const isTradeInRequest = payload.activeType === 'trade-in-request';

  const formatStatus = handleFormatStatus(payload.statuses, payload);
  const formatStages = handleFormatStages(payload.stages, payload);

  const keywordFilter = `Keyword: ${payload.content || ''}`;
  const statusFilter = `Status: ${formatStatus}`;
  const stageFilter = `Stages: ${formatStages}`;
  const startDateFilter = `Start Date: ${
    payload.ranges?.startDate
      ? moment(moment(payload?.ranges?.startDate).clone().startOf('day')).format('MM/DD/YYYY, HH:mm:ss')
      : ''
  }`;
  const endDateFilter = `End Date: ${
    payload.ranges?.startDate
      ? moment(moment(payload?.ranges?.endDate).clone().endOf('day')).format('MM/DD/YYYY, HH:mm:ss')
      : ''
  }`;

  let labelExcel = [];

  if (payload.isExportAll) {
    labelExcel = [[`Scorecard History ${capitalizeFirstLetter(payload.activeType)} Report`]];
  } else {
    labelExcel = [
      [`Scorecard History ${capitalizeFirstLetter(payload.activeType)} Report`],
      [],
      ['Filtered By'],
      [keywordFilter],
      !isTradeInRequest ? [statusFilter] : null,
      !isTradeInRequest ? [stageFilter] : null,
    ].filter((it) => !!it);

    if (startDateFilter !== '') {
      labelExcel = [...labelExcel, [startDateFilter]];
    }
    if (endDateFilter !== '') {
      labelExcel = [...labelExcel, [endDateFilter]];
    }
  }

  labelExcel = [...labelExcel, []];

  const { rowLabel, dataExport, listFormatCol } = yield call(handleMapDataExport, listScorecardHistories, payload);
  const resultExport = [...labelExcel, ...rowLabel, ...dataExport];
  return exportXlsxFile(
    resultExport,
    `${formatDateWithTime(moment())}_Scorecard History ${capitalizeFirstLetter(payload.activeType)} Report`,
    listFormatCol,
  );
}

function* handleExportScorecardHistorySaga(action: Action<HandleExportScorecardHistoryParams>) {
  const { payload } = action;
  try {
    const params: Partial<HandleExportScorecardHistoryExportParams> = {
      sort: 'DESC',
      typeSort: 'DATE',
      content: payload.content,
      statuses: payload.statuses,
      stageFilter: payload?.stages,
      startDateFilter: payload?.startDate,
      endDateFilter: payload?.endDate,
    };
    switch (payload.activeType) {
      case constHistoryPartnerTradeInTabName.INBOX: {
        params.scoreCardHistoryType = 'INBOX';
        params.isArchived = false;
        params.tradeInType = 'SCORECARD';
        break;
      }
      case constHistoryPartnerTradeInTabName.QUOTES: {
        params.tradeInType = 'QUOTE';
        break;
      }
      case constHistoryPartnerTradeInTabName.ARCHIVE: {
        params.scoreCardHistoryType = 'ARCHIVED';
        params.isArchived = true;
        break;
      }
      case constHistoryPartnerTradeInTabName.TRADE_IN_REQUEST: {
        params.tradeInType = 'TRADE_IN_REQUEST';
        delete params.statuses;
        params.statusFilter = payload?.statuses;
        params.stageFilter = payload?.statuses === 'NEW_LEAD' ? '' : payload?.stages;
        break;
      }
      case constHistoryPartnerTradeInTabName.INSTANT_PAYOUT: {
        params.scoreCardHistoryType = 'INSTANT_PAYOUT';
        break;
      }
      default:
        break;
    }
    switch (payload.statuses) {
      case 'INCOMPLETE': {
        delete params.statuses;
        params.isIncomplete = true;
        break;
      }
      case 'RETURNED_TO_SHOP': {
        delete params.statuses;
        params.isReturnedToShop = true;
        break;
      }
      case 'CANCELLED': {
        delete params.statuses;
        params.isCancelled = true;
        break;
      }
      default:
        break;
    }
    if (payload.isExportAll) {
      delete params.content;
      delete params.statuses;
      delete params.stageFilter;
      delete params.startDateFilter;
      delete params.endDateFilter;
      delete params.isIncomplete;
      delete params.isReturnedToShop;
      delete params.isCancelled;
    }
    const responseScorecardHistories: HandleExportScorecardHistoryExportResponse = yield call(
      handleExportScorecardHistoryRequest,
      params,
    );
    yield call(handleExportScorecardHistory, responseScorecardHistories.data, payload);
    yield put(scorecardAction.handleExportScorecardHistorySucceeded());
  } catch (error) {
    toastError(error);
    yield put(scorecardAction.handleExportScorecardHistoryFailed());
  }
}

function* getListReimbursementSaga(action: Action<GetListReimbursementPayload>) {
  try {
    const response: ReimbursementSuccessPayload = yield call(getListReimbursement, action.payload);
    if (response) {
      yield put(scorecardAction.getListReimbursementSucceeded(response));
    }
  } catch (e) {
    yield put(scorecardAction.getListReimbursementFailed());
  }
}

function* getListReconciliationReportSaga(action: Action<ReconciliationReportPayload>) {
  try {
    const response: ListReconciliationReportPayload = yield call(getReconciliationReportApi, action.payload);
    if (response) {
      yield put(scorecardAction.getListReconciliationReportSucceeded(response));
    }
  } catch (e) {
    yield put(scorecardAction.getListReconciliationReportFailed());
  }
}

function* getBarcodeInventorySaga(action: Action<GetBarcodeInventoryPayload>) {
  try {
    const response: GetBarcodeInventoryResponse = yield call(getBarcodeInventoryRequest, action.payload?.inventoryId);
    yield put(scorecardAction.getBarcodeInventorySucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getBarcodeInventoryFailed());
  }
}

function* getPartnerFeedbackByScorecardSaga(action: Action<GetFeedBackByScoreCardPayload>) {
  try {
    const response: GetFeedBackByScoreCardResponse = yield call(
      partnerFeedbackByScorecardRequest,
      action.payload.scoreCardId,
    );
    yield put(scorecardAction.getPartnerFeedbackByScorecardSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getPartnerFeedbackByScorecardFailed());
  }
}

function* reportScorecardSaga(action: Action<ReportScorecardPayload>) {
  try {
    const response: ReportScorecardResponse = yield call(reportScorecardRequest, action.payload);
    yield put(scorecardAction.reportScorecardSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(scorecardAction.reportScorecardFailed());
  }
}

function* getDetailScoreCardHistoryLead(action: Action<string>) {
  try {
    const response: ScoreCardDetailLeadSuccessPayload = yield call(getDetailLeadGenRequest, action.payload);
    yield put(scorecardAction.getDetailScorecardHistoryLeadSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getDetailScorecardHistoryLeadFailed());
  }
}

function* getRedBarnReportSaga(action: Action<RedBarnReportPayload>) {
  try {
    const response: RedBarnReportResponse = yield call(getRedBarnReportRequest, action.payload);
    yield put(scorecardAction.getRedBarnReportSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getRedBarnReportFailed());
  }
}

function* getDetailScoreCardHistoryQuote(action: Action<string>) {
  try {
    const response: ScoreCardDetailLeadSuccessPayload = yield call(getDetailHistoryQuoteRequest, action.payload);
    yield put(scorecardAction.getDetailScorecardHistoryQuoteSucceeded(response));
  } catch (e) {
    yield put(scorecardAction.getDetailScorecardHistoryQuoteFailed());
  }
}

export default function* scorecardSaga() {
  yield takeLatest(scorecardAction.getScorecard, handleGetScorecard);
  yield takeLatest(scorecardAction.getStepSummaryStandardQuote, getStepSummaryStandardQuoteSaga);
  yield takeLatest(
    scorecardAction.getStepShippingAndCompleteStandardQuote,
    getStepShippingAndCompleteStandardQuoteSaga,
  );
  yield takeLatest(scorecardAction.getShipment, getShipmentSaga);
  yield takeLatest(scorecardAction.getDetailCustomQuote, getDetailCustomQuoteSaga);
  yield takeLatest(scorecardAction.getDetailCustomRedBarnQuote, getDetailCustomRedBarnQuoteSaga);
  yield takeLatest(scorecardAction.getStepDetailStandardQuote, getStepDetailStandardQuoteSaga);
  yield takeLatest(scorecardAction.getListReimbursement, getListReimbursementSaga);
  yield takeLatest(scorecardAction.getListReconciliationReport, getListReconciliationReportSaga);
  yield takeLatest(scorecardAction.getStepDetailRequest, getStepDetailRequestSaga);
  yield takeLatest(scorecardAction.handleExportScorecardHistory, handleExportScorecardHistorySaga);
  yield takeLatest(scorecardAction.getBarcodeInventory, getBarcodeInventorySaga);
  yield takeLatest(scorecardAction.getPartnerFeedbackByScorecard, getPartnerFeedbackByScorecardSaga);
  yield takeLatest(scorecardAction.reportScorecard, reportScorecardSaga);
  yield takeLatest(scorecardAction.getDetailScorecardHistoryLead, getDetailScoreCardHistoryLead);
  yield takeLatest(scorecardAction.getRedBarnReport, getRedBarnReportSaga);
  yield takeLatest(scorecardAction.getDetailScorecardHistoryQuote, getDetailScoreCardHistoryQuote);
  yield takeLatest(scorecardAction.getStepDetailRedBarnQuote, getStepDetailRedBarnQuoteSaga);
  yield takeLatest(scorecardAction.getStepSummaryRedBarnQuote, getStepSummaryRedBarnQuoteSaga);
  yield takeLatest(scorecardAction.getDetailRedBarnQuote, getDetailRedBarnQuoteSaga);
}
