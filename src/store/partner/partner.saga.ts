import { fork } from '@redux-saga/core/effects';

import accountSaga from './account/account.saga';
import scorecardSaga from './scorecard/score-card.saga';
import trainingSaga from './training/training.saga';

export default function* partnerSaga() {
  try {
    yield fork(accountSaga);
    yield fork(scorecardSaga);
    yield fork(trainingSaga);
  } catch (e) {
    console.log(e);
  }
}
