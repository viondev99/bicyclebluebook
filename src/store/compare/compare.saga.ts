import { call, takeLeading, put, takeLatest, select } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import compareAction from './compare.action';
import { addToCompareList, CompareList, getCompareList, removeFromCompare } from '../../api/compare.api';
import { toastError, toastSuccess } from '../../helpers/utils.helper';
import { getMessageFromError } from '../../helpers/common.helper';
import StoreState from '../../model/store';
import { Product } from '../../model/common';
import t from '../../helpers/language';

function* handleGetListCompare() {
  try {
    const response: CompareList = yield call(getCompareList);
    yield put(compareAction.getListCompareSuccess(response));
  } catch (e) {
    toastError(e);
    yield put(compareAction.getListCompareFail(getMessageFromError(e)));
  }
}

function* handleAddToCompare(action: Action<number>) {
  try {
    const response: CompareList = yield call(addToCompareList, action.payload);
    yield put(compareAction.addToListCompareSuccess(response));
    toastSuccess(t('compare.added'));
  } catch (e) {
    toastError(e);
    yield put(compareAction.addToListCompareFail(getMessageFromError(e)));
  }
}

function* handleRemoveCompare(action: Action<number>) {
  try {
    const currentCompare: Partial<Product>[] = yield select((store: StoreState) => store.compare.listCompare);
    yield call(removeFromCompare, action.payload);
    const newCompare = currentCompare.filter((i) => i.masterListingId !== action.payload);
    yield put(compareAction.removeFromListCompareSuccess(newCompare));
    toastSuccess(t('compare.removed'));
  } catch (e) {
    toastError(e);
    yield put(compareAction.removeFromListCompareFail(getMessageFromError(e)));
  }
}

export default function* compareSaga() {
  yield takeLatest(compareAction.getListCompare, handleGetListCompare);
  yield takeLeading(compareAction.addToListCompare, handleAddToCompare);
  yield takeLeading(compareAction.removeFromListCompare, handleRemoveCompare);
}
