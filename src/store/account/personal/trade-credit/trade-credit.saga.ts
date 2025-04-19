import { takeLatest, call, put } from '@redux-saga/core/effects';
import { toastError } from 'helpers/utils.helper';
import { getMessageFromError } from 'helpers/common.helper';
import { Action } from 'redux-actions';
import { GiftDetailCustomerModal, TradeCreditItemModal } from 'model/store/account/personal/trade-credit.model';
import * as tradeCreditActions from './trade-credit.action';
import {
  GetListGiftHistory,
  GetGiftHistoryByCustomer,
} from '../../../../model/api/account/personal/trade-credit.model';
import { DataList } from '../../../../model/common';
import { getListGiftHistory, getGiftDetailCustomer } from '../../../../api/account/personal/trade-credit.api';

function* handleGetListTradeCredit(action: Action<GetListGiftHistory>) {
  try {
    const response: DataList<TradeCreditItemModal> = yield call(getListGiftHistory, action.payload);
    yield put(tradeCreditActions.getListTradeCreditSucceeded(response));
  } catch (error) {
    toastError(getMessageFromError(error));
  }
}

function* handleGetGiftByCustomer(action: Action<GetGiftHistoryByCustomer>) {
  try {
    const response: GiftDetailCustomerModal = yield call(getGiftDetailCustomer, { customer: action.payload.customer });
    if (response?._id) {
      const listTradeCredit: DataList<TradeCreditItemModal> = yield call(getListGiftHistory, {
        page: action.payload.page,
        page_size: action.payload.page_size,
        sort: action.payload.sort,
        where: `gift_id:${response._id}`,
      });
      yield put(tradeCreditActions.getListTradeCreditSucceeded(listTradeCredit));
    }
    yield put(tradeCreditActions.getGiftByCustomerSucceeded(response));
  } catch (error) {
    yield put(tradeCreditActions.getGiftByCustomerFailed());
    // toastError(getMessageFromError(error));
  }
}

export default function* tradeCregitSaga() {
  yield takeLatest(tradeCreditActions.getListTradeCredit, handleGetListTradeCredit);
  yield takeLatest(tradeCreditActions.getGiftByCustomer, handleGetGiftByCustomer);
}
