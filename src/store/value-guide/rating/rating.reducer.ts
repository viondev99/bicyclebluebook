import { Action, handleActions } from 'redux-actions';
import {
  GetRatingFailedPayload,
  GetRatingSuccessPayload,
  ValueGuidePayload,
} from 'store/value-guide/value-guide.action';
import { RatingModel, RatingStoreModel } from 'model/store/value-guide.model';

const ratingInit: RatingModel = {
  bicycleImages: '',
  bicycleYear: '',
  bicycleBrand: '',
  bicycleModel: '',
  bicycleType: '',
  bicycleSize: '',
  avgRating: 0,
  totalRating: 0,
  ratingResponse: { data: [], page: 1, total_item: 0, page_size: 0, total_page: 0 },
  rateValueDetail: { oneStar: 0, twoStars: 0, threeStars: 0, fourStars: 0, fiveStars: 0 },
};

const INIT_STATE: RatingStoreModel = {
  rating: ratingInit,
  loading: false,
  error: '',
};

const reducer = handleActions<RatingStoreModel, ValueGuidePayload>(
  {
    GET_RATING: (state, action) => {
      return {
        ...state,
        rating: ratingInit,
        loading: true,
      };
    },
    GET_RATING_SUCCEEDED: (state, action: Action<GetRatingSuccessPayload>) => {
      return {
        ...state,
        rating: action.payload,
        loading: false,
      };
    },
    GET_RATING_FAILED: (state, action: Action<GetRatingFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
  },
  INIT_STATE,
  { prefix: 'valueGuide' },
);

export default reducer;
