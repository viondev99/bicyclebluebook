import { Action, handleActions } from 'redux-actions';
import { GetListGiftCardResponse, GiftCardStoreModel } from 'model/store/account/personal/gift-card.model';
import { GetListGiftCardParams } from 'model/api/account/personal/gift-card.model';
import { GiftCardPayload } from './gift-card.action';

const INIT_STATE: GiftCardStoreModel = {
  loading: false,
  dataGiftCard: null,
};

const giftCardReducer = handleActions<GiftCardStoreModel, GiftCardPayload>(
  {
    GET_LIST_GIFT_CARD_FOR_USERS: (state, action: Action<GetListGiftCardParams>) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_LIST_GIFT_CARD_FOR_USERS_SUCCEEDED: (state, action: Action<GetListGiftCardResponse>) => {
      return {
        ...state,
        dataGiftCard: action.payload,
        loading: false,
      };
    },
    GET_LIST_GIFT_CARD_FOR_USERS_FAILED: (state) => {
      return {
        ...state,
        loading: false,
        dataGiftCard: null,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'gift-card',
  },
);

export default giftCardReducer;
