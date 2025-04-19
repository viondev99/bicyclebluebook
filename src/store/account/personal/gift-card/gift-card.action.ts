import { createActions } from 'redux-actions';
import { GetListGiftCardParams } from 'model/api/account/personal/gift-card.model';
import { GetListGiftCardResponse } from 'model/store/account/personal/gift-card.model';

export type GiftCardPayload = GetListGiftCardParams | GetListGiftCardResponse;

export const {
  getListGiftCardForUsers,
  getListGiftCardForUsersSucceeded,
  getListGiftCardForUsersFailed,
} = createActions<GiftCardPayload>(
  {
    GET_LIST_GIFT_CARD_FOR_USERS: (payload: GetListGiftCardParams) => payload,
    GET_LIST_GIFT_CARD_FOR_USERS_SUCCEEDED: (payload: GetListGiftCardResponse) => payload,
    GET_LIST_GIFT_CARD_FOR_USERS_FAILED: null,
  },
  {
    prefix: 'gift-card',
  },
);
