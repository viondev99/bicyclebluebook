import { Action, handleActions } from 'redux-actions';

import {
  PartnerAccountStoreModel,
  PartnerDetailModel,
  PartnerUserProfileModel,
  PartnerUserModel,
  GetListBlockedUsersModel,
  GetListPartnerUsersResponse,
  GetListPartnerLocationResponse,
  NewesteNotificationResponse,
  DataActionNewesteNotificationResponse,
} from 'model/store/partner/account.model';
import { FilterPartnerDetailResponse } from 'model/store/partner/filter-partner.model';
import { GetPartnerLocationDetailResponse } from 'model/store/partner/get-partner-detail.model';
import { GetTradeInScorecardReportsResponse } from 'model/store/partner/trade-in-scorecard-reports';
import { GetListLeadGenResponse } from 'model/store/partner/lead-gen.model';
import { GetListTradeInBicycleResponse } from 'model/store/partner/scorecard.model';
import { PartnerAccountPayload } from './account.action';

const INIT_STATE: PartnerAccountStoreModel = {
  detail: undefined,
  userProfile: undefined,
  users: [],
  loading: false,
  loadingAction: false,
  successAction: false,
  dataBlockedUsers: null,
  dataPartnerUsers: null,
  dataPartnerLocation: null,
  dataFilterPartnerDetail: null,
  detailPartnerLocation: null,
  dataTradeInScorecardReports: null,
  dataNotificationSetting: null,
  dataLeadGen: null,
  dataTradeInBicycle: null,
  dataNewesteNotification: null,
  dataActionNewesteNotification: null,
  status: false,
  notesQuote: '',
};

const partnerAccountReducer = handleActions<PartnerAccountStoreModel, PartnerAccountPayload>(
  {
    GET_LIST_TRADE_IN_BICYCLE: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_TRADE_IN_BICYCLE_SUCCEEDED: (state, action: Action<GetListTradeInBicycleResponse>) => {
      return {
        ...state,
        dataTradeInBicycle: { ...state.dataTradeInBicycle, ...action.payload },
        loading: false,
      };
    },
    GET_LIST_TRADE_IN_BICYCLE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    SAVE_LIST_LEAD_GEN: (state, action: Action<GetListLeadGenResponse>) => {
      return {
        ...state,
        dataLeadGen: { ...state.dataLeadGen, ...action.payload },
        loading: false,
      };
    },
    GET_LIST_LEAD_GEN: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_LEAD_GEN_SUCCEEDED: (state, action: Action<GetListLeadGenResponse>) => {
      return {
        ...state,
        dataLeadGen: { ...state.dataLeadGen, ...action.payload },
        loading: false,
      };
    },
    GET_LIST_LEAD_GEN_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_NOTIFICATION_SETTING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_NOTIFICATION_SETTING_SUCCEEDED: (state, action: Action<GetTradeInScorecardReportsResponse>) => {
      return {
        ...state,
        dataNotificationSetting: { ...state.dataNotificationSetting, ...action.payload },
        loading: false,
      };
    },
    GET_NOTIFICATION_SETTING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_TRADE_IN_SCORECARD_REPORTS: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_TRADE_IN_SCORECARD_REPORTS_SUCCEEDED: (state, action: Action<GetTradeInScorecardReportsResponse>) => {
      return {
        ...state,
        dataTradeInScorecardReports: { ...state.dataTradeInScorecardReports, ...action.payload },
        loading: false,
      };
    },
    GET_TRADE_IN_SCORECARD_REPORTS_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_PARTNER_LOCATION_DETAIL: (state) => {
      return {
        ...state,
      };
    },
    GET_PARTNER_LOCATION_DETAIL_SUCCEEDED: (state, action: Action<GetPartnerLocationDetailResponse>) => {
      return {
        ...state,
        detailPartnerLocation: { ...state.detailPartnerLocation, ...action.payload },
      };
    },
    GET_PARTNER_LOCATION_DETAIL_FAILED: (state) => {
      return {
        ...state,
      };
    },

    FILTER_PARTNER_DETAIL_SUCCEEDED: (state, action: Action<FilterPartnerDetailResponse>) => {
      return {
        ...state,
        dataFilterPartnerDetail: { ...state.dataFilterPartnerDetail, ...action.payload },
      };
    },
    GET_LIST_PARTNER_LOCATION: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_PARTNER_LOCATION_SUCCEEDED: (state, action: Action<GetListPartnerLocationResponse>) => {
      return {
        ...state,
        dataPartnerLocation: { ...state.dataPartnerLocation, ...action.payload },
        loading: false,
      };
    },
    GET_LIST_PARTNER_LOCATION_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },

    GET_LIST_PARTNER_USERS: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_PARTNER_USERS_SUCCEEDED: (state, action: Action<GetListPartnerUsersResponse>) => {
      return {
        ...state,
        dataPartnerUsers: { ...state.dataPartnerUsers, ...action.payload },
        loading: false,
      };
    },
    GET_LIST_PARTNER_USERS_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },

    GET_LIST_BLOCKED_USERS: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_BLOCKED_USERS_SUCCEEDED: (state, action: Action<GetListBlockedUsersModel>) => {
      return {
        ...state,
        dataBlockedUsers: action.payload,
        loading: false,
      };
    },
    GET_LIST_BLOCKED_USERS_FAILED: (state) => {
      return {
        ...state,
        dataBlockedUsers: null,
        loading: false,
      };
    },

    GET_PARTNER_DETAIL: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_PARTNER_DETAIL_SUCCEEDED: (state, action: Action<Partial<PartnerDetailModel>>) => {
      return {
        ...state,
        detail: { ...state.detail, ...action.payload },
        loading: false,
      };
    },
    GET_PARTNER_DETAIL_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_PARTNER_USER_PROFILE: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_PARTNER_USER_PROFILE_SUCCEEDED: (state, action: Action<Partial<PartnerUserProfileModel>>) => {
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
        loading: false,
      };
    },
    GET_PARTNER_USER_PROFILE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_PARTNER_USER_LIST: (state) => {
      return {
        ...state,
        users: [],
        loading: true,
      };
    },
    GET_PARTNER_USER_LIST_SUCCEEDED: (state, action: Action<PartnerUserModel[]>) => {
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    },
    GET_PARTNER_USER_LIST_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    ADD_PARTNER_USER: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    UPDATE_PARTNER_USER: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    DELETE_PARTNER_USER: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    DELETE_PARTNER_USER_SUCCEEDED: (state, action: Action<string>) => {
      return {
        ...state,
        users: state.users.filter((item) => item.account !== action.payload),
        loadingAction: false,
      };
    },
    DELETE_PARTNER_USER_FAILED: (state) => {
      return {
        ...state,
        loadingAction: false,
      };
    },
    GET_NEWESTE_NOTIFICATION: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_NEWESTE_NOTIFICATION_SUCCEEDED: (state, action: Action<NewesteNotificationResponse>) => {
      return {
        ...state,
        dataNewesteNotification: action.payload,
        loading: false,
      };
    },
    GET_NEWESTE_NOTIFICATION_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_ACTION_NEWESTE_NOTIFICATION: (state) => {
      return {
        ...state,
        loadingAction: true,
      };
    },
    GET_ACTION_NEWESTE_NOTIFICATION_SUCCEEDED: (state, action: Action<DataActionNewesteNotificationResponse>) => {
      return {
        ...state,
        dataActionNewesteNotification: action.payload,
        loadingAction: false,
      };
    },
    GET_ACTION_NEWESTE_NOTIFICATION_FAILED: (state) => {
      return {
        ...state,
        loadingAction: false,
      };
    },
    SAVE_STATUS_SHOW_PARTNER_TOUR: (state, action: Action<boolean>) => {
      return { ...state, status: action.payload };
    },
    SAVE_NOTES_QUOTE: (state, action: Action<string>) => {
      return { ...state, notesQuote: action.payload };
    },
  },
  INIT_STATE,
  {
    prefix: 'partner-account',
  },
);

export default partnerAccountReducer;
