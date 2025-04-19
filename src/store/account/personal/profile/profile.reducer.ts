import { Action, handleActions } from 'redux-actions';
import { ProfilePersonalStoreModal } from '../../../../model/store/account/personal/profile.model';
import { ProfilePayload, ProfileResponse, GetProfileFailed, UpdateProfileFailed } from './profile.action';

const INIT_STATE: ProfilePersonalStoreModal = {
  personalAccountInfo: null,
  loadingProfile: false,
  error: '',
  updateFrom: '',
  isChangePassword: false,
};

const profilePersonalReducer = handleActions<ProfilePersonalStoreModal, ProfilePayload>(
  {
    GET_PROFILE_FOR_PERSONAL: (state: ProfilePersonalStoreModal) => {
      return {
        ...state,
        loadingProfile: true,
      };
    },
    GET_PROFILE_FOR_PERSONAL_SUCCEEDED: (state, action: Action<ProfileResponse>) => {
      return {
        ...state,
        personalAccountInfo: action.payload,
        loadingProfile: false,
      };
    },
    GET_PROFILE_FOR_PERSONAL_FAILED: (state, action: Action<GetProfileFailed>) => {
      return {
        ...state,
        loadingProfile: false,
      };
    },
    UPDATE_PERSONAL_PROFILE: (state) => {
      return {
        ...state,
        loadingProfile: true,
        error: '',
        updateFrom: '',
        isChangePassword: false,
      };
    },
    UPDATE_PERSONAL_PROFILE_SUCCEEDED: (state, action: Action<ProfileResponse>) => {
      return {
        ...state,
        personalAccountInfo: action.payload,
        loadingProfile: false,
      };
    },
    UPDATE_PERSONAL_PROFILE_FAILED: (state, action: Action<UpdateProfileFailed>) => {
      return {
        ...state,
        loadingProfile: false,
        error: action.payload.error,
        updateFrom: action.payload.from,
      };
    },
    CHANGE_PASSWORD_PERSONAL_PROFILE: (state) => {
      return {
        ...state,
        loadingProfile: true,
        isChangePassword: false,
      };
    },
    CHANGE_PASSWORD_PERSONAL_PROFILE_SUCCEEDED: (state) => {
      return {
        ...state,
        loadingProfile: false,
        isChangePassword: true,
      };
    },
    CHANGE_PASSWORD_PERSONAL_PROFILE_FAILED: (state) => {
      return {
        ...state,
        loadingProfile: false,
        isChangePassword: false,
      };
    },
    DELETE_PERSONAL_ACCOUNT: (state) => {
      return {
        ...state,
        loadingProfile: true,
      };
    },
    DELETE_PERSONAL_ACCOUNT_SUCCEEDED: (state) => {
      return {
        ...state,
        loadingProfile: false,
      };
    },
    DELETE_PERSONAL_ACCOUNT_FAILED: (state) => {
      return {
        ...state,
        loadingProfile: false,
      };
    },
    DEACTIVATE_PERSONAL_ACCOUNT: (state) => {
      return {
        ...state,
        loadingProfile: true,
      };
    },
    DEACTIVATE_PERSONAL_ACCOUNT_SUCCEEDED: (state) => {
      return {
        ...state,
        loadingProfile: false,
      };
    },
    DEACTIVATE_PERSONAL_ACCOUNT_FAILED: (state) => {
      return {
        ...state,
        loadingProfile: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'profilePersonal',
  },
);

export default profilePersonalReducer;
