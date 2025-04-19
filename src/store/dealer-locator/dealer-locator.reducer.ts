import { Action, handleActions } from 'redux-actions';
import { DealerLocatorStoreModel } from 'model/store/dealer-locator';
import { GetPartnerParams, ListPartnerResponse } from 'api/dealer-locator';
import { DealerLocatorPayload } from './dealer-locator.action';

const INIT_STATE: DealerLocatorStoreModel = {
  listPartner: null,
  loading: false,
  params: null,
};

const dealerLocatorReducer = handleActions<DealerLocatorStoreModel, DealerLocatorPayload>(
  {
    GET_LIST_PARTNER: (state, action: Action<GetPartnerParams>) => {
      return {
        ...state,
        loading: true,
        params: action.payload,
      };
    },
    GET_LIST_PARTNER_SUCCEEDED: (state, action: Action<ListPartnerResponse>) => {
      return {
        ...state,
        listPartner: action.payload,
        loading: false,
      };
    },
    GET_LIST_PARTNER_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'dealer-locator',
  },
);

export default dealerLocatorReducer;
