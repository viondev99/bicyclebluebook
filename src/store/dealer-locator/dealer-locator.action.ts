import { createActions } from 'redux-actions';
import { ListPartnerResponse, GetPartnerParams } from 'api/dealer-locator';

export type DealerLocatorPayload = GetPartnerParams | ListPartnerResponse;

export const { getListPartner, getListPartnerSucceeded, getListPartnerFailed, cancelGetListPartner } = createActions<
  DealerLocatorPayload
>(
  {
    GET_LIST_PARTNER: (payload: GetPartnerParams) => payload,
    GET_LIST_PARTNER_SUCCEEDED: (payload: ListPartnerResponse) => payload,
    GET_LIST_PARTNER_FAILED: null,
    CANCEL_GET_LIST_PARTNER: null,
  },
  {
    prefix: 'dealer-locator',
  },
);
