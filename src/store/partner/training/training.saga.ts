import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { GetListTrainingsResponse } from 'model/store/partner/training.model';
import { getListTrainingsRequest } from 'api/partner/training.api';
import * as traningAction from './training.action';

function* getListTrainingsSaga(action: Action<string>) {
  try {
    const response: GetListTrainingsResponse[] = yield call(getListTrainingsRequest, action.payload);
    yield put(traningAction.getListTrainingsSucceeded(response));
  } catch (e) {
    yield put(traningAction.getListTrainingsFailed());
  }
}

export default function* scorecardSaga() {
  yield takeLatest(traningAction.getListTrainings, getListTrainingsSaga);
}
