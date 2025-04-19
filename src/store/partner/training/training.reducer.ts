import { Action, handleActions } from 'redux-actions';
import { GetListTrainingsResponse, TrainingModel } from '../../../model/store/partner/training.model';
import { TrainingPayload } from './training.action';

const INIT_STATE: TrainingModel = {
  listTraings: [],
  loading: false,
};

const trainingReducer = handleActions<TrainingModel, TrainingPayload>(
  {
    GET_LIST_TRAININGS: (state) => {
      return { ...state, loading: true };
    },
    GET_LIST_TRAININGS_SUCCEEDED: (state, action: any) => {
      return { ...state, listTraings: action.payload, loading: false };
    },
    GET_LIST_TRAININGS_FAILED: (state) => {
      return { ...state, loading: false };
    },
  },
  INIT_STATE,
  {
    prefix: 'training',
  },
);

export default trainingReducer;
