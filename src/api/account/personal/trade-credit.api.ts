import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { DataList } from '../../../model/common';
import {
  TradeCreditItemModal,
  GiftDetailCustomerModal,
} from '../../../model/store/account/personal/trade-credit.model';
import { GetListGiftHistory, GetGiftHistoryByCustomer } from '../../../model/api/account/personal/trade-credit.model';

export type ListTradeCreditResponse = DataList<TradeCreditItemModal>;

export function getListGiftHistory(payload: GetListGiftHistory): PromiseWithCancel<ListTradeCreditResponse> {
  return authorizedRequest.get<ListTradeCreditResponse>('billing/api/v1/gift-history', { params: payload });
}

export function getGiftDetailCustomer(payload: GetGiftHistoryByCustomer): PromiseWithCancel<GiftDetailCustomerModal> {
  return authorizedRequest.get<GiftDetailCustomerModal>('billing/api/v1/gift/detail/customer', {
    params: payload,
  });
}
