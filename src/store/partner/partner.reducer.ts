import { combineReducers } from 'redux';

import accountReducer from './account/account.reducer';
import scorecardReducer from './scorecard/score-card.reducer';
import trainingReducer from './training/training.reducer';

const partnerReducer = combineReducers({
  account: accountReducer,
  scorecard: scorecardReducer,
  training: trainingReducer,
});

export default partnerReducer;
