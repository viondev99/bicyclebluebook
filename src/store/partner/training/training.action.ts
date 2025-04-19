import { GetListTrainingsResponse } from 'model/store/partner/training.model';
import { createActions } from 'redux-actions';

export type TrainingPayload = GetListTrainingsResponse;

export const { getListTrainings, getListTrainingsSucceeded, getListTrainingsFailed } = createActions(
  {
    GET_LIST_TRAININGS: (payload: string) => payload,
    GET_LIST_TRAININGS_SUCCEEDED: (payload: GetListTrainingsResponse[]) => payload,
    GET_LIST_TRAININGS_FAILED: null,
  },
  {
    prefix: 'training',
  },
);
