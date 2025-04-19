import { TwitterInfoResponse } from 'model/api/authenticate.model';
import { Action, ActionMeta, handleActions } from 'redux-actions';
import { AuthenticateModel, UserModel } from '../../model/store/authenticate.model';
import { AuthenticatePayload, InitSessionPayload, TourPayload } from './authenticate.action';

const INIT_STATE: AuthenticateModel = {
  user: null,
  loggingIn: false,
  redirect: false,
  token: '',
  twitterInfo: null,
  stepTour: 0,
  loading: false,
};

const authenticateReducer = handleActions<AuthenticateModel, AuthenticatePayload>(
  {
    LOGIN: (state) => {
      return {
        ...state,
        redirect: false,
        loggingIn: true,
        twitterInfo: null,
        loading: true,
      };
    },
    LOGIN_SUCCEEDED: (state: AuthenticateModel, action: ActionMeta<UserModel, boolean>) => {
      return {
        ...state,
        redirect: action.meta,
        loggingIn: false,
        token: action.payload.token,
        user: action.payload,
        loading: false,
      };
    },
    LOGIN_FAILED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
        loading: false,
      };
    },
    INIT_SESSION: (state: AuthenticateModel, action: Action<InitSessionPayload>) => {
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    },
    REGISTER_PERSONAL_SUCCEEDED: (state: AuthenticateModel, action: Action<UserModel>) => {
      return {
        ...state,
        loggingIn: false,
        token: action.payload.token,
        user: action.payload,
      };
    },
    REGISTER_PERSONAL: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
        twitterInfo: null,
      };
    },
    REGISTER_PERSONAL_BY_GOOGLE: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
      };
    },
    REGISTER_PERSONAL_BY_FACEBOOK: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
      };
    },
    REGISTER_PERSONAL_BY_TWITTER: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
      };
    },
    SAVE_INFO_TWITTER: (state: AuthenticateModel, action: Action<TwitterInfoResponse>) => {
      return {
        ...state,
        loggingIn: false,
        twitterInfo: action.payload,
      };
    },
    REGISTER_ONLINE_STORE: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
      };
    },
    REGISTER_ONLINE_PARTNER_STORE: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
      };
    },
    REGISTER_TRADE_IN_PARTNER: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: true,
      };
    },
    REGISTER_PERSONAL_BY_GOOGLE_SUCCEEDED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    REGISTER_PERSONAL_BY_FACEBOOK_SUCCEEDED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    REGISTER_PERSONAL_BY_TWITTER_SUCCEEDED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    REGISTER_ONLINE_STORE_SUCCEEDED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    REGISTER_ONLINE_PARTNER_STORE_SUCCEEDED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    REGISTER_TRADE_IN_PARTNER_SUCCEEDED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    REGISTER_FAILED: (state: AuthenticateModel) => {
      return {
        ...state,
        loggingIn: false,
      };
    },
    DO_LOGOUT: (state: AuthenticateModel) => {
      return {
        ...state,
        token: '',
        user: null,
      };
    },
    HANDLE_CHANGE_STEP_TOUR: (state: AuthenticateModel, action: Action<TourPayload>) => {
      return {
        ...state,
        stepTour: action?.payload?.steps,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'authenticate',
  },
);
export default authenticateReducer;
