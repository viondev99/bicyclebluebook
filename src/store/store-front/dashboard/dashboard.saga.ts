import { call, put, select, takeLatest, all } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';

import StoreState from 'model/store';
import { StorefrontActivityModel } from 'model/store/store-front/dashboard.model';
import { toastError } from 'helpers/utils.helper';
import {
  getStorefrontSummary,
  getStorefrontTotalMessage,
  getStorefrontTotalUnreadMessage,
  getStorefrontChartByDay,
  getStorefrontChartByMonth,
  getStorefrontActivity,
  GetStorefrontSummaryResponse,
  GetStorefrontTotalMessageResponse,
  GetStorefrontTotalUnreadMessageResponse,
  StorefrontChartItem,
  GetStorefrontChartByMonthResponse,
  GetStorefrontActivityResponse,
  FromDateToDateUnix,
  GetStorefrontChartResponse,
} from 'api/store-front/dashboard.api';
import dayjs from 'dayjs';
import { CUSTOM_UNIX_DATE_VALUES } from 'helpers/date.helper';
import * as dashboardActions from './dashboard.action';

enum FilterOptions {
  ThisMonth = 'THIS_MONTH',
  LastMonth = 'LAST_MONTH',
}

function* getStorefrontSummarySaga(action: Action<FromDateToDateUnix>) {
  try {
    const responseSummary: GetStorefrontSummaryResponse = yield call(getStorefrontSummary, {
      storefrontIds: action?.payload?.storefrontIds,
    });
    const responseMessage: GetStorefrontTotalMessageResponse = yield call(getStorefrontTotalMessage, {
      storefrontIds: action?.payload?.storefrontIds,
    });
    const responseUnreadMessage: GetStorefrontTotalUnreadMessageResponse = yield call(getStorefrontTotalUnreadMessage, {
      storefrontIds: action?.payload?.storefrontIds,
    });
    const data: dashboardActions.GetStorefrontSummarySucceededPayload = {
      awaitingShipment: responseSummary?.listings?.sold?.awaitingShipment || 0,
      listings: {
        forSale: responseSummary?.listings?.forSale || 0,
        sold: responseSummary?.listings?.sold?.allSold || 0,
        expired: responseSummary?.listings?.expired || 0,
        draft: responseSummary?.listings?.draft || 0,
      },
      openOffers: responseSummary?.openOffers || 0,
      messages: {
        total: responseMessage.total_message,
        unread: responseUnreadMessage.unread_message,
      },
    };
    yield put(dashboardActions.getStorefrontSummarySucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(dashboardActions.getStorefrontSummaryFailed());
  }
}
function* getStorefrontTotalSalesSaga(action: Action<dashboardActions.GetStorefrontChartPayload>) {
  try {
    const response: GetStorefrontChartByMonthResponse | StorefrontChartItem[] =
      action.payload.type === 'month'
        ? yield call(getStorefrontChartByMonth, {
            month: action.payload.month || '',
            storefrontIds: action?.payload?.storefrontIds,
          })
        : yield call(getStorefrontChartByDay, {
            fromDay: action.payload.fromDay,
            toDay: action.payload.toDay,
            storefrontIds: action?.payload?.storefrontIds,
          });
    // const data =
    //   action.payload.type === 'month'
    //     ? (response as GetStorefrontChartByMonthResponse)?.days || []
    //     : (response as StorefrontChartItem[]);
    yield put(
      dashboardActions.getStorefrontTotalSalesSucceeded({
        totalSales:
          action.payload.type === 'month'
            ? (response as GetStorefrontChartByMonthResponse)?.totalSale || 0
            : (response as StorefrontChartItem[]).reduce(
                (accumulator, currentValue) => accumulator + currentValue.sale,
                0,
              ),
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(dashboardActions.getStorefrontTotalSalesFailed());
  }
}

function* getStorefrontChartSaga(action: Action<dashboardActions.GetStorefrontChartPayload>) {
  try {
    const response: GetStorefrontChartByMonthResponse | GetStorefrontChartResponse =
      action.payload.type === 'month'
        ? yield call(getStorefrontChartByMonth, {
            month: action.payload.month || '',
            storefrontIds: action?.payload?.storefrontIds,
          })
        : yield call(getStorefrontChartByDay, {
            fromDay: action.payload.fromDay,
            toDay: action.payload.toDay,
            storefrontIds: action?.payload?.storefrontIds,
          });
    const data =
      action.payload.type === 'month'
        ? (response as GetStorefrontChartByMonthResponse)?.days || []
        : (response as GetStorefrontChartResponse)?.days || [];
    yield put(
      dashboardActions.getStorefrontChartSucceeded({
        chart: data.map((item) => ({ date: item.date, sale: item.sale })),
        timelineRecommendation: response?.timelineRecommendation,
        totalSales:
          action.payload.type === 'month'
            ? (response as GetStorefrontChartByMonthResponse)?.totalSale || 0
            : (response as GetStorefrontChartResponse)?.days.reduce(
                (accumulator, currentValue) => accumulator + currentValue.sale,
                0,
              ),
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(dashboardActions.getStorefrontSummaryFailed());
  }
}

function* getStorefrontActivitiesSaga(action: Action<dashboardActions.GetStorefrontActivitiesPayload>) {
  try {
    const response: GetStorefrontActivityResponse = yield call(getStorefrontActivity, action.payload);
    const activity = yield select((store: StoreState) => store.storeFront.dashboard.activity);
    const temp: StorefrontActivityModel[] = response.data
      .filter((item) => !activity.data.find((i: StorefrontActivityModel) => i.id === item._id))
      .map((item) => ({
        id: item._id,
        agent: item.agent,
        action: item.action,
        createdBy: item.created_by,
        masterListing: item.master_listing,
        data: {
          name: item?.data?.name || '',
        },
        dateCreated: item.date_created,
        dateUpdated: item.date_updated,
      }));
    const data = {
      data: [...activity.data, ...temp],
      dataActivity: response?.data,
      totalItem: response.total_item,
      totalPage: response.total_page,
    };
    yield put(dashboardActions.getStorefrontActivitiesSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(dashboardActions.getStorefrontActivitiesFailed());
  }
}

function* getUnreadAndTotalMessageFilterSaga({
  payload,
}: Action<dashboardActions.GetUnreadAndTotalMessageFilterParams>) {
  try {
    const fromDay =
      payload.filter === FilterOptions.ThisMonth
        ? CUSTOM_UNIX_DATE_VALUES.month.fromDay
        : CUSTOM_UNIX_DATE_VALUES.lastMonth.fromDay;

    const toDay =
      payload.filter === FilterOptions.ThisMonth
        ? CUSTOM_UNIX_DATE_VALUES.month.toDay
        : CUSTOM_UNIX_DATE_VALUES.lastMonth.toDay;

    const paramsStartDateEndDateUnix = {
      startDate: fromDay,
      endDate: toDay,
      storefrontIds: payload?.storefrontIds,
    };
    const paramsFromDateToDateUnix = {
      fromDate: fromDay,
      toDate: toDay,
      storefrontIds: payload?.storefrontIds,
    };
    const paramsFilterByMonth =
      payload.filter === FilterOptions.ThisMonth
        ? dayjs().format('YYYY-MM')
        : dayjs().add(-1, 'months').format('YYYY-MM');

    let totalMessageResponse: GetStorefrontTotalMessageResponse;
    let unreadMessageResponse: GetStorefrontTotalUnreadMessageResponse;
    let totalSaleOnlineStore: GetStorefrontChartByMonthResponse;
    let totalListingAndAwaitShipment: GetStorefrontSummaryResponse;

    [totalMessageResponse, unreadMessageResponse, totalSaleOnlineStore, totalListingAndAwaitShipment] = yield all([
      call(getStorefrontTotalMessage, paramsStartDateEndDateUnix),
      call(getStorefrontTotalUnreadMessage, paramsStartDateEndDateUnix),
      call(getStorefrontChartByMonth, { month: paramsFilterByMonth, storefrontIds: payload.storefrontIds }),
      call(getStorefrontSummary, paramsFromDateToDateUnix),
    ]);

    yield put(
      dashboardActions.getUnreadAndTotalMessageFilterSucceeded({
        totalMessage:
          totalMessageResponse && totalMessageResponse.total_message ? totalMessageResponse.total_message : 0,
        unreadMessage:
          unreadMessageResponse && unreadMessageResponse.unread_message ? unreadMessageResponse.unread_message : 0,
        totalSaleOnlineStore: totalSaleOnlineStore.totalSale || 0,
        totalAwaitingShipment: totalListingAndAwaitShipment.listings
          ? totalListingAndAwaitShipment.listings.sold.awaitingShipment
          : 0,
        totalListingSold: totalListingAndAwaitShipment.listings
          ? totalListingAndAwaitShipment.listings.sold.allSold
          : 0,
        totalListingForSale: totalListingAndAwaitShipment.listings ? totalListingAndAwaitShipment.listings.forSale : 0,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(dashboardActions.getStorefrontActivitiesFailed());
  }
}

export default function* storefrontDashboardSaga() {
  yield takeLatest(dashboardActions.getStorefrontSummary, getStorefrontSummarySaga);
  yield takeLatest(dashboardActions.getStorefrontTotalSales, getStorefrontTotalSalesSaga);
  yield takeLatest(dashboardActions.getStorefrontChart, getStorefrontChartSaga);
  yield takeLatest(dashboardActions.getStorefrontActivities, getStorefrontActivitiesSaga);
  yield takeLatest(dashboardActions.getUnreadAndTotalMessageFilter, getUnreadAndTotalMessageFilterSaga);
}
