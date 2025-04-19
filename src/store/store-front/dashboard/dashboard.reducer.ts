import { Action, handleActions } from 'redux-actions';

import { StorefrontDashboardStoreModel } from 'model/store/store-front/dashboard.model';
import {
  StorefrontDashboardPayload,
  GetStorefrontSummarySucceededPayload,
  GetStorefrontTotalSalesSucceededPayload,
  GetStorefrontChartSucceededPayload,
  GetStorefrontActivitiesSucceededPayload,
  GetUnreadAndTotalMessageFilterResponse,
} from './dashboard.action';

const INIT_STATE: StorefrontDashboardStoreModel = {
  summary: undefined,
  chart: [],
  timelineRecommendation: null,
  totalSales: 0,
  activity: {
    data: [],
    dataActivity: [],
    totalItem: 0,
    totalPage: 0,
    loading: false,
  },
  dataUnreadAndTotalMessageCardDashboard: null,
  loading: false,
};

const storefrontDashboardReducer = handleActions<StorefrontDashboardStoreModel, StorefrontDashboardPayload>(
  {
    GET_UNREAD_AND_TOTAL_MESSAGE_FILTER: (state) => {
      return {
        ...state,
        loading: true,
        dataUnreadAndTotalMessageCardDashboard: null,
      };
    },
    GET_UNREAD_AND_TOTAL_MESSAGE_FILTER_SUCCEEDED: (state, action: Action<GetUnreadAndTotalMessageFilterResponse>) => {
      return {
        ...state,
        dataUnreadAndTotalMessageCardDashboard: action.payload,
        loading: false,
      };
    },
    GET_UNREAD_AND_TOTAL_MESSAGE_FILTER_FAILED: (state) => {
      return {
        ...state,
        dataUnreadAndTotalMessageCardDashboard: null,
        loading: false,
      };
    },
    GET_STOREFRONT_SUMMARY: (state) => {
      return {
        ...state,
        loading: true,
        summary: undefined,
      };
    },
    GET_STOREFRONT_SUMMARY_SUCCEEDED: (state, action: Action<GetStorefrontSummarySucceededPayload>) => {
      return {
        ...state,
        summary: { ...state.summary, ...action.payload },
        loading: false,
      };
    },
    GET_STOREFRONT_SUMMARY_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_STOREFRONT_TOTAL_SALES: (state) => {
      return {
        ...state,
        summary: { ...state.summary, totalSales: 0 },
        loading: true,
      };
    },
    GET_STOREFRONT_TOTAL_SALES_SUCCEEDED: (state, action: Action<GetStorefrontTotalSalesSucceededPayload>) => {
      return { ...state, summary: { ...state.summary, totalSales: action.payload.totalSales }, loading: false };
    },
    GET_STOREFRONT_TOTAL_SALES_FAILED: (state) => {
      return { ...state, loading: false };
    },
    GET_STOREFRONT_CHART: (state) => {
      return {
        ...state,
        chart: [],
        totalSales: 0,
        // timelineRecommendation: null,
        loading: true,
      };
    },
    GET_STOREFRONT_CHART_SUCCEEDED: (state, action: Action<GetStorefrontChartSucceededPayload>) => {
      return {
        ...state,
        chart: action.payload.chart,
        totalSales: action.payload.totalSales,
        timelineRecommendation: action?.payload?.timelineRecommendation,
        loading: false,
      };
    },
    GET_STOREFRONT_CHART_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_STOREFRONT_ACTIVITIES: (state) => {
      return {
        ...state,
        activity: { ...state.activity, loading: true },
      };
    },
    GET_STOREFRONT_ACTIVITIES_SUCCEEDED: (state, action: Action<GetStorefrontActivitiesSucceededPayload>) => {
      return {
        ...state,
        activity: {
          data: action.payload.data,
          dataActivity: action.payload.dataActivity,
          totalItem: action.payload.totalItem || state.activity.totalItem,
          totalPage: action.payload.totalPage || state.activity.totalPage,
          loading: false,
        },
      };
    },
    GET_STOREFRONT_ACTIVITIES_FAILED: (state) => {
      return {
        ...state,
        activity: { ...state.activity, loading: false },
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'storefront-dashboard',
  },
);

export default storefrontDashboardReducer;
