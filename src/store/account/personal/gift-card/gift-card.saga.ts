import { takeLatest, call, put } from '@redux-saga/core/effects';

import { toastError } from 'helpers/utils.helper';
import { getMessageFromError } from 'helpers/common.helper';
import { Action } from 'redux-actions';
import { GetListGiftCardResponse } from 'model/store/account/personal/gift-card.model';
import { getListGiftCardForUsersRequest } from 'api/account/personal/gift-card.api';
import { GetListGiftCardParams } from 'model/api/account/personal/gift-card.model';
import * as giftCardActions from './gift-card.action';

function* getListGiftCardForUsersSaga(action: Action<GetListGiftCardParams>) {
  try {
    const response: GetListGiftCardResponse[] = yield call(getListGiftCardForUsersRequest, action.payload);
    yield put(giftCardActions.getListGiftCardForUsersSucceeded(response));
  } catch (error) {
    toastError(getMessageFromError(error));
  }
}

export default function* giftCardSaga() {
  yield takeLatest(giftCardActions.getListGiftCardForUsers, getListGiftCardForUsersSaga);
}
