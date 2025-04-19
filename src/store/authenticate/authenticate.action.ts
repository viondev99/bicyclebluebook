import { createActions } from 'redux-actions';
import {
  UserModel,
  RegisterPersonalModel,
  RegisterOnlineStoreModel,
  RegisterTradeInModel,
  LoginModel,
  GenerateTokenOnlineStoreParams,
  cleclearStoreFrontTokenPayload,
} from 'model/store/authenticate.model';
import { TwitterInfoResponse } from 'model/api/authenticate.model';

type Token = string;

export interface InitSessionPayload {
  token: string;
  user: UserModel;
}

export interface TourPayload {
  steps: string | number;
}

export type AuthenticatePayload =
  | UserModel
  | LoginModel
  | InitSessionPayload
  | RegisterPersonalModel
  | RegisterOnlineStoreModel
  | RegisterTradeInModel
  | TwitterInfoResponse
  | Token
  | GenerateTokenOnlineStoreParams
  | cleclearStoreFrontTokenPayload
  | TourPayload;

export const {
  login,
  logout,
  doLogout,
  impersonate,
  impersonateSucceeded,
  impersonateFailed,
  loginSucceeded,
  loginByFacebook,
  loginByGoogle,
  loginByTwitter,
  saveInfoTwitter,
  loginFailed,
  initSession,
  initSessionComplete,
  registerPersonal,
  registerPersonalSucceeded,
  registerPersonalByGoogle,
  registerPersonalByGoogleSucceeded,
  registerPersonalByFacebook,
  registerPersonalByFacebookSucceeded,
  registerPersonalByTwitter,
  registerPersonalByTwitterSucceeded,
  registerOnlineStore,
  registerOnlineStoreSucceeded,
  registerOnlinePartnerStore,
  registerOnlinePartnerStoreSucceeded,
  registerTradeInPartner,
  registerTradeInPartnerSucceeded,
  registerFailed,
  generateTokenOnlineStore,
  clearStoreFrontToken,
  handleChangeStepTour,
  checkUserBlocked,
} = createActions<AuthenticatePayload>(
  {
    LOGIN: (payload: LoginModel) => payload,
    LOGOUT: null,
    DO_LOGOUT: null,
    IMPERSONATE: (payload: Token) => payload,
    IMPERSONATE_SUCCEEDED: (payload) => payload,
    IMPERSONATE_FAILED: null,
    LOGIN_SUCCEEDED: [(payload) => payload, (payload: number, meta: boolean) => meta],
    LOGIN_BY_FACEBOOK: (payload: Token) => payload,
    LOGIN_BY_GOOGLE: (payload: Token) => payload,
    LOGIN_BY_TWITTER: (payload: any) => payload,
    SAVE_INFO_TWITTER: (payload: TwitterInfoResponse) => payload,
    LOGIN_FAILED: null,
    INIT_SESSION: (session: InitSessionPayload) => session,
    INIT_SESSION_COMPLETE: null,
    REGISTER_PERSONAL: (payload: RegisterPersonalModel) => payload,
    REGISTER_PERSONAL_SUCCEEDED: (payload) => payload,
    REGISTER_PERSONAL_BY_GOOGLE: (payload) => payload,
    REGISTER_PERSONAL_BY_GOOGLE_SUCCEEDED: (payload) => payload,
    REGISTER_PERSONAL_BY_FACEBOOK: (payload) => payload,
    REGISTER_PERSONAL_BY_FACEBOOK_SUCCEEDED: (payload) => payload,
    REGISTER_PERSONAL_BY_TWITTER: (payload) => payload,
    REGISTER_PERSONAL_BY_TWITTER_SUCCEEDED: (payload) => payload,
    REGISTER_ONLINE_STORE: (payload: RegisterOnlineStoreModel) => payload,
    REGISTER_ONLINE_STORE_SUCCEEDED: (payload) => payload,
    REGISTER_ONLINE_PARTNER_STORE: (payload) => payload,
    REGISTER_ONLINE_PARTNER_STORE_SUCCEEDED: (payload) => payload,
    REGISTER_TRADE_IN_PARTNER: (payload) => payload,
    REGISTER_TRADE_IN_PARTNER_SUCCEEDED: (payload) => payload,
    REGISTER_FAILED: (payload) => payload,
    GENERATE_TOKEN_ONLINE_STORE: (payload: GenerateTokenOnlineStoreParams) => payload,
    CLEAR_STORE_FRONT_TOKEN: (payload: cleclearStoreFrontTokenPayload) => payload,
    HANDLE_CHANGE_STEP_TOUR: (payload: TourPayload) => payload,
    CHECK_USER_BLOCKED: (payload: string) => payload,
  },
  {
    prefix: 'authenticate',
  },
);
