import { PartnerRole } from 'constants/roles';
import { FilterPartnerDetailResponse } from './filter-partner.model';
import { GetPartnerLocationDetailResponse } from './get-partner-detail.model';
import { GetListLeadGenResponse } from './lead-gen.model';
import { GetListTradeInBicycleResponse } from './scorecard.model';
import { GetNotificationSettingResponse, GetTradeInScorecardReportsResponse } from './trade-in-scorecard-reports';

export interface AddressDetailModel {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PartnerDetailModel {
  id: string;
  partnerParent?: string;
  name: string;
  phone: string;
  website: string;
  smartEtailing: boolean;
  logo: string;
  description: string;
  brands: Array<{ id: string; name: string }>;
  mailingAddress: AddressDetailModel;
  shopAddress: AddressDetailModel;
  overrideBBB: boolean;
  enableLeadGen: boolean;
  leadGenEmail: string;
  enableWidget: boolean;
  widgetUrl: string;
  dateCreated: string;
  dateUpdated: string;
  bikeDonation?: boolean;
}

export interface PartnerUserProfileModel {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  role: PartnerRole | '';
  location: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface PartnerUserModel {
  id: string;
  account: string;
  partner: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  role: PartnerRole;
  location: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface GetListBlockedUsersModel {
  total_item: number;
  data: {
    user: {
      _id: string;
      display_name: string;
      user_name: string;
      email: string;
    };
    storefront_reported: {
      _id: string;
      name: string;
    };
    user_reported?: {
      _id?: string;
      display_name: string;
    };
    _id: string;
    status: string;
    date_created: Date;
    date_updated: Date;
  }[];
  page: number;
  page_size: number;
  total_page: number;
}

export interface PartnerAccountStoreModel {
  detail?: PartnerDetailModel;
  userProfile?: PartnerUserProfileModel;
  users: PartnerUserModel[];
  loading: boolean;
  loadingAction: boolean;
  successAction: boolean;
  dataBlockedUsers?: GetListBlockedUsersModel;
  dataPartnerUsers: GetListPartnerUsersResponse;
  dataPartnerLocation: GetListPartnerLocationResponse;
  dataFilterPartnerDetail: FilterPartnerDetailResponse;
  detailPartnerLocation: GetPartnerLocationDetailResponse;
  dataTradeInScorecardReports: GetTradeInScorecardReportsResponse;
  dataNotificationSetting: GetNotificationSettingResponse;
  dataLeadGen: GetListLeadGenResponse;
  dataTradeInBicycle: GetListTradeInBicycleResponse;
  dataNewesteNotification: NewesteNotificationResponse;
  dataActionNewesteNotification: DataActionNewesteNotificationResponse;
  status?: boolean;
  notesQuote?: string;
}

export interface GetListPartnerUsersParams {
  page: number;
  sort: string;
}

export interface GetListPartnerLocationParams {
  page: number;
  sort?: string;
  page_size?: number;
}

export interface Restrict {
  last_ip: string;
  is_block: boolean;
}

export interface MailConfig {
  status: string;
  mail_key: any[];
}

export interface PushConfig {
  status: string;
  push_key: any[];
}

export interface SmsConfig {
  status: string;
  sms_key: any[];
}

export interface Setting {
  mail_config: MailConfig;
  push_config: PushConfig;
  sms_config: SmsConfig;
}

export interface Partner {
  _id: string;
  name: string;
}

export interface ShippingAddress {
  country: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface BindingAddress {
  country: string;
}

export interface Account {
  shipping_address: ShippingAddress;
  binding_address: BindingAddress;
  _id: string;
  first_name: string;
  last_name: string;
  display_name: string;
}

export interface ItemPartnerUsers {
  restrict: Restrict;
  setting: Setting;
  provider: string;
  is_setting: boolean;
  receive_message: any[];
  blocked: boolean;
  stripe_accounts: any[];
  is_validate_address: boolean;
  storefronts: any[];
  _id: string;
  email: string;
  role: string;
  partner: Partner;
  display_name: string;
  last_login: Date;
  date_created: Date;
  date_updated: Date;
  account: Account;
  salesforce_id: string;
  salt: string;
  storefront: string;
  user_name: string;
  gravatar: string;
}

export interface GetListPartnerUsersResponse {
  total_item: number;
  data: ItemPartnerUsers[];
  page: number;
  page_size: number;
  total_page: number;
}

export interface ScoreCard {
  shipping?: number;
  handling?: number;
}

export interface Status {
  is_active: boolean;
  is_lock: boolean;
  is_deleted: boolean;
}

export interface InstantPayoutLimit {
  daily_limit: number;
  weekly_limit: number;
  monthly_limit: number;
  time_limit: number;
  time_stamp_limit: number;
}

export interface BrandsCarried {
  id: string;
  name: string;
}

export interface AdminManager {
  phones: string[];
  _id: string;
  email: string;
  name: string;
  phone: string;
}

export interface AddressMailing {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface ItemPartnerLocationResponse {
  score_card: ScoreCard;
  status: Status;
  instant_payout_limit: InstantPayoutLimit;
  is_smart_tailing_primary: boolean;
  smart_tailing: boolean;
  mailing_address: boolean;
  brands_carried: BrandsCarried[];
  api_key_v1: string[];
  widget_enable: boolean;
  widget_url_dev: any[];
  is_trek_widget: boolean;
  is_send_mail_widget: boolean;
  count_widget_opens: number;
  is_enable_adjustment: boolean;
  is_active_by_created: boolean;
  drop_off_enabled: boolean;
  hide_components: boolean;
  is_trek: boolean;
  is_donation: boolean;
  is_show_donate: boolean;
  is_override_bbb: boolean;
  is_primary: boolean;
  is_bbb_rack: boolean;
  show_in_map: boolean;
  is_setting: boolean;
  is_instant_payout: boolean;
  partner_type: string;
  is_validate_address: boolean;
  _id: string;
  v1_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  email: string;
  website: string;
  lat: string;
  lng: string;
  avatar: string;
  widget_url: string;
  tell_about: string;
  number_identity: number;
  date_created: Date;
  date_updated: Date;
  partner_parent: string;
  lead_email: string;
  partner_type_id: string;
  location: number[];
  partner_parent_v1?: number;
  sparc_id: string;
  guid: string;
  account_number: string;
  salesforce_id: string;
  phone: string;
  admin_manager: AdminManager;
  partner_group_v1?: number;
  api_key: string;
  address_mailing: AddressMailing;
  staffs: string[];
  partner_childs: any[];
}

export interface GetListPartnerLocationResponse {
  total_item: number;
  data: ItemPartnerLocationResponse[];
  page: number;
  page_size: number;
  total_page: number;
}

export interface AddPartnerLocationParams {
  partner_parent: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website: string;
  tell_about: string;
  smart_tailing: boolean;
  avatar: File | string;
  brands_carried: object[];
  os_type: string;
  id?: string;
}

export interface GetTradeInScorecardReportsParams {
  fromDate: string;
  toDate: string;
  partnerIds: string[];
}

export interface GetListLeadGenParams {
  page: number;
  page_size: number;
  sort: string;
  start_date?: string;
  end_date?: string;
  search_key: string;
  status_view?: string;
  stage_view?: string;
  all_lead_sources?: boolean;
  time_end?: string;
  time_start?: string;
}

export interface UserCreated {
  _id: string;
  email: string;
  name: string;
}

export interface Datum {
  user_created: UserCreated;
  users_subscriber_read: string[];
  users_un_subscriber: string[];
  status: string;
  _id: string;
  type: string;
  title: string;
  content: string;
  date_created: Date;
  date_updated: Date;
  date_published: Date;
}

export interface NewesteNotificationResponse {
  data: Datum[];
  total_item: number;
  page: number;
  page_size: number;
  total_page: number;
}

export interface UserCreatedForActionNotification {
  _id: string;
  email: string;
  name: string;
}

export interface DataActionNewesteNotificationResponse {
  user_created: UserCreatedForActionNotification;
  users_subscriber_read: any[];
  users_un_subscriber: any[];
  status: string;
  is_read_bool: boolean;
  is_dismiss: boolean;
  _id: string;
  partner_id: string;
  type: string;
  title: string;
  content: string;
  scorecard: number;
  value: number;
  date_published: Date;
  date_created: Date;
  date_updated: Date;
}
