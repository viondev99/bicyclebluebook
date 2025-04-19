import { createActions } from 'redux-actions';
import {
  PartnerDetailModel,
  PartnerUserProfileModel,
  PartnerUserModel,
  GetListBlockedUsersModel,
  GetListPartnerUsersParams,
  GetListPartnerUsersResponse,
  GetListPartnerLocationParams,
  GetListPartnerLocationResponse,
  AddPartnerLocationParams,
  GetTradeInScorecardReportsParams,
  GetListLeadGenParams,
  NewesteNotificationResponse,
  DataActionNewesteNotificationResponse,
} from 'model/store/partner/account.model';
import { FilterPartnerDetailResponse } from 'model/store/partner/filter-partner.model';
import { GetPartnerLocationDetailResponse } from 'model/store/partner/get-partner-detail.model';
import {
  GetNotificationSettingResponse,
  GetTradeInScorecardReportsResponse,
} from 'model/store/partner/trade-in-scorecard-reports';
import { GetListLeadGenResponse } from 'model/store/partner/lead-gen.model';
import { GetListTradeInBicycleParams, GetListTradeInBicycleResponse } from 'model/store/partner/scorecard.model';
import { ActionNewesteNotificationPayload, NewesteNotificationPayload } from 'api/partner/account.api';

export type GetListBlockedUsersPayload = {
  page: number;
  page_size: number;
  status: string;
  storefrontIds?: string;
};

export type UnblockUser = {
  id: string;
  getData?: () => void;
};

export type GetPartnerUserListPayload = {
  id: string;
  page: number;
  pageSize: number;
  searchKey: string;
  sort: string;
};

export type AddPartnerUserPayload = {
  email: string;
  first_name: string;
  last_name: string;
  partner: string;
  role: string;
};

export type UpdatePartnerUserPayload = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  partner: string;
  role: string;
};

export interface GetData {
  getData?: () => void;
}

export type PartnerAccountPayload =
  | string
  | PartnerDetailModel
  | Partial<PartnerDetailModel>
  | PartnerUserProfileModel
  | Partial<PartnerUserProfileModel>
  | GetPartnerUserListPayload
  | PartnerUserModel[]
  | PartnerUserModel
  | Partial<PartnerUserModel>
  | AddPartnerUserPayload
  | UpdatePartnerUserPayload
  | GetListBlockedUsersPayload
  | GetListBlockedUsersModel
  | UnblockUser
  | GetListPartnerUsersParams
  | GetListPartnerUsersResponse
  | GetListPartnerLocationParams
  | GetListPartnerLocationResponse
  | FilterPartnerDetailResponse
  | GetTradeInScorecardReportsParams
  | GetTradeInScorecardReportsResponse
  | GetNotificationSettingResponse
  | GetListLeadGenParams
  | GetListLeadGenResponse
  | GetListTradeInBicycleParams
  | GetListTradeInBicycleResponse
  | NewesteNotificationPayload
  | DataActionNewesteNotificationResponse
  | boolean;

export const {
  getPartnerDetail,
  getPartnerDetailSucceeded,
  getPartnerDetailFailed,
  getPartnerUserProfile,
  getPartnerUserProfileSucceeded,
  getPartnerUserProfileFailed,
  getPartnerUserList,
  getPartnerUserListSucceeded,
  getPartnerUserListFailed,
  addPartnerUser,
  addPartnerUserSucceeded,
  addPartnerUserFailed,
  updatePartnerUser,
  updatePartnerUserSucceeded,
  updatePartnerUserFailed,
  deletePartnerUser,
  deletePartnerUserSucceeded,
  deletePartnerUserFailed,
  getListBlockedUsers,
  getListBlockedUsersSucceeded,
  getListBlockedUsersFailed,
  unblockUser,
  getListPartnerUsers,
  getListPartnerUsersSucceeded,
  getListPartnerUsersFailed,
  getListPartnerLocation,
  getListPartnerLocationSucceeded,
  getListPartnerLocationFailed,
  filterPartnerDetail,
  filterPartnerDetailSucceeded,
  filterPartnerDetailFailed,
  addPartnerLocation,
  editPartnerLocation,
  getPartnerLocationDetail,
  getPartnerLocationDetailSucceeded,
  getPartnerLocationDetailFailed,
  getTradeInScorecardReports,
  getTradeInScorecardReportsSucceeded,
  getTradeInScorecardReportsFailed,
  getNotificationSetting,
  getNotificationSettingSucceeded,
  getNotificationSettingFailed,
  getListLeadGen,
  getListLeadGenSucceeded,
  getListLeadGenFailed,
  saveListLeadGen,
  getListTradeInBicycle,
  getListTradeInBicycleSucceeded,
  getListTradeInBicycleFailed,
  getNewesteNotification,
  getNewesteNotificationSucceeded,
  getNewesteNotificationFailed,
  getActionNewesteNotification,
  getActionNewesteNotificationSucceeded,
  getActionNewesteNotificationFailed,
  saveStatusShowPartnerTour,
  saveNotesQuote,
} = createActions<PartnerAccountPayload>(
  {
    GET_PARTNER_DETAIL: (payload: string) => payload,
    GET_PARTNER_DETAIL_SUCCEEDED: (payload: Partial<PartnerDetailModel>) => payload,
    GET_PARTNER_DETAIL_FAILED: null,
    GET_PARTNER_USER_PROFILE: (payload: string) => payload,
    GET_PARTNER_USER_PROFILE_SUCCEEDED: (payload: Partial<PartnerUserProfileModel>) => payload,
    GET_PARTNER_USER_PROFILE_FAILED: null,
    GET_PARTNER_USER_LIST: (payload: GetPartnerUserListPayload) => payload,
    GET_PARTNER_USER_LIST_SUCCEEDED: (payload: PartnerUserModel[]) => payload,
    GET_PARTNER_USER_LIST_FAILED: null,
    ADD_PARTNER_USER: (payload: AddPartnerUserPayload) => payload,
    UPDATE_PARTNER_USER: (payload: UpdatePartnerUserPayload) => payload,
    DELETE_PARTNER_USER: (id: string, getData?: () => void) => {
      return {
        id,
        getData,
      };
    },
    DELETE_PARTNER_USER_SUCCEEDED: (payload: string) => payload,
    DELETE_PARTNER_USER_FAILED: null,
    GET_LIST_BLOCKED_USERS: (payload: GetListBlockedUsersPayload) => payload,
    GET_LIST_BLOCKED_USERS_SUCCEEDED: (payload: GetListBlockedUsersModel) => payload,
    GET_LIST_BLOCKED_USERS_FAILED: null,
    UNBLOCK_USER: (id: string, getData?: () => void) => {
      return {
        id,
        getData,
      };
    },
    GET_LIST_PARTNER_USERS: (payload: GetListPartnerUsersParams) => payload,
    GET_LIST_PARTNER_USERS_SUCCEEDED: (payload: GetListPartnerUsersResponse) => payload,
    GET_LIST_PARTNER_USERS_FAILED: null,
    GET_LIST_PARTNER_LOCATION: (payload: GetListPartnerLocationParams) => payload,
    GET_LIST_PARTNER_LOCATION_SUCCEEDED: (payload: GetListPartnerLocationResponse) => payload,
    GET_LIST_PARTNER_LOCATION_FAILED: null,
    FILTER_PARTNER_DETAIL: (id: string) => id,
    FILTER_PARTNER_DETAIL_SUCCEEDED: (payload: FilterPartnerDetailResponse) => payload,
    FILTER_PARTNER_DETAIL_FAILED: null,
    ADD_PARTNER_LOCATION: (payload: AddPartnerLocationParams) => payload,
    EDIT_PARTNER_LOCATION: (payload: AddPartnerLocationParams) => payload,
    GET_PARTNER_LOCATION_DETAIL: (id: string) => id,
    GET_PARTNER_LOCATION_DETAIL_SUCCEEDED: (payload: GetPartnerLocationDetailResponse) => payload,
    GET_PARTNER_LOCATION_DETAIL_FAILED: null,
    GET_TRADE_IN_SCORECARD_REPORTS: (payload: GetTradeInScorecardReportsParams) => payload,
    GET_TRADE_IN_SCORECARD_REPORTS_SUCCEEDED: (payload: GetTradeInScorecardReportsResponse) => payload,
    GET_TRADE_IN_SCORECARD_REPORTS_FAILED: null,
    GET_NOTIFICATION_SETTING: null,
    GET_NOTIFICATION_SETTING_SUCCEEDED: (payload: GetNotificationSettingResponse) => payload,
    GET_NOTIFICATION_SETTING_FAILED: null,
    GET_LIST_LEAD_GEN: (payload: GetListLeadGenParams) => payload,
    GET_LIST_LEAD_GEN_SUCCEEDED: (payload: GetListLeadGenResponse) => payload,
    GET_LIST_LEAD_GEN_FAILED: null,
    SAVE_LIST_LEAD_GEN: (payload: GetListLeadGenResponse) => payload,
    GET_LIST_TRADE_IN_BICYCLE: (payload: GetListTradeInBicycleParams) => payload,
    GET_LIST_TRADE_IN_BICYCLE_SUCCEEDED: (payload: GetListTradeInBicycleResponse) => payload,
    GET_LIST_TRADE_IN_BICYCLE_FAILED: null,
    GET_NEWESTE_NOTIFICATION: (payload: NewesteNotificationPayload) => payload,
    GET_NEWESTE_NOTIFICATION_SUCCEEDED: (payload: NewesteNotificationResponse) => payload,
    GET_NEWESTE_NOTIFICATION_FAILED: null,
    GET_ACTION_NEWESTE_NOTIFICATION: (payload: ActionNewesteNotificationPayload) => payload,
    GET_ACTION_NEWESTE_NOTIFICATION_SUCCEEDED: (payload: DataActionNewesteNotificationResponse) => payload,
    GET_ACTION_NEWESTE_NOTIFICATION_FAILED: null,
    SAVE_STATUS_SHOW_PARTNER_TOUR: (status: boolean) => status,
    SAVE_NOTES_QUOTE: (notesQuote: string) => notesQuote,
  },
  {
    prefix: 'partner-account',
  },
);
