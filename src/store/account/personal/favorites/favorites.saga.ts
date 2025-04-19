import { takeLatest, call, put, select } from '@redux-saga/core/effects';

import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { getMessageFromError, isEndOfPage } from 'helpers/common.helper';
import { Action } from 'redux-actions';
import * as favoriteActions from './favorites.action';
import { GetFavoriteModal, SavedFavoriteModal } from '../../../../model/api/account/personal/favorites.model';
import { DataList } from '../../../../model/common';
import { FavoriteItemModal } from '../../../../model/store/account/personal/favorites.model';
import { getListFavorites, savedFavoriteItem } from '../../../../api/account/personal/favorites.api';
import StoreState from '../../../../model/store/index';

function* handleGetListFavorites(action: Action<GetFavoriteModal>) {
  try {
    const response: DataList<FavoriteItemModal> = yield call(getListFavorites, action.payload);
    yield put(favoriteActions.getListFavoritesSucceeded(response));
  } catch (error) {
    toastError(getMessageFromError(error));
  }
}

function* handleSavedFavorite(action: Action<SavedFavoriteModal>) {
  try {
    yield call(savedFavoriteItem, action.payload);
    yield put(favoriteActions.savedFavoriteSucceeded());
    const queryParams = yield select((store: StoreState) => store.account.personal.favorites.queryParams);
    let bodyParams = { ...queryParams };
    const listFavorites = yield select((store: StoreState) => store.account.personal.favorites.listFavorites);
    if (isEndOfPage(listFavorites.page_size, listFavorites.total_page, listFavorites.total_item, listFavorites.page)) {
      bodyParams = { ...queryParams, page: listFavorites.total_page - 1 };
    }
    yield put(favoriteActions.getListFavorites(bodyParams));
    toastSuccess(t('marketplace.removedFavorite'), t('seoTitle.success'));
  } catch (error) {
    yield put(favoriteActions.savedFavoriteFailed());
    toastError(getMessageFromError(error));
  }
}

export default function* favoritesSaga() {
  yield takeLatest(favoriteActions.getListFavorites, handleGetListFavorites);
  yield takeLatest(favoriteActions.savedFavorite, handleSavedFavorite);
}
