import { takeLatest, put, call, select } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import t from 'helpers/language';
import { WishListResponse, SubscriptionResponse } from 'model/api/account/personal/wishlist.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { getMessageFromError, isEndOfPage } from '../../../../helpers/common.helper';
import * as wishlistActions from './wishlist.action';
import {
  getListSearchSubscriber,
  deleteSubscriberWishlist,
  getListSubscription,
} from '../../../../api/account/personal/wishlist.api';
import { WishListModel } from '../../../../model/store/account/personal/wishlist.model';
import StoreState from '../../../../model/store/index';

function* handleGetListSaveSearch(action: Action<WishListModel>) {
  try {
    const response: WishListResponse = yield call(getListSearchSubscriber, action.payload);
    yield put(wishlistActions.getListSearchSubscriberSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(wishlistActions.getListSearchSubscriberFailed(getMessageFromError(error)));
  }
}

function* deleteSubscriber(action: Action<string>) {
  try {
    yield call(deleteSubscriberWishlist, action.payload);
    yield put(wishlistActions.deleteSubscriberWishlistSucceeded());
    const queryParams = yield select((store: StoreState) => store.account.personal.wishlist.queryParams);
    let bodyParams = { ...queryParams };
    const listSubscribers = yield select((store: StoreState) => store.account.personal.wishlist.listSubscribers);
    if (
      isEndOfPage(
        listSubscribers.page_size,
        listSubscribers.total_page,
        listSubscribers.total_item,
        listSubscribers.page,
      )
    ) {
      bodyParams = { ...queryParams, page: listSubscribers.total_page - 1 };
    }
    yield put(wishlistActions.getListSearchSubscriber(bodyParams));
    toastSuccess(t('myAccount.wishlist.removed'), t('seoTitle.success'));
  } catch (error) {
    toastError(error);
    yield put(wishlistActions.deleteSubscriberWishlistFailed(getMessageFromError(error)));
  }
}

function* handleGetListSubscription(action: Action<WishListModel>) {
  try {
    const response: SubscriptionResponse = yield call(getListSubscription, action.payload);
    yield put(wishlistActions.getListSubscriptionSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(wishlistActions.getListSubscriptionFailed(getMessageFromError(error)));
  }
}

export default function* wishlistSaga() {
  yield takeLatest(wishlistActions.getListSearchSubscriber, handleGetListSaveSearch);
  yield takeLatest(wishlistActions.deleteSubscriberWishlist, deleteSubscriber);
  yield takeLatest(wishlistActions.getListSubscription, handleGetListSubscription);
}
