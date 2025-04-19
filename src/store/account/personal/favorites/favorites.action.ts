import { createActions } from 'redux-actions';
import { FavoriteItemModal } from 'model/store/account/personal/favorites.model';
import { DataList } from 'model/common';
import { GetFavoriteModal, SavedFavoriteModal } from 'model/api/account/personal/favorites.model';

export type FavoritesPayload = GetFavoriteModal | DataList<FavoriteItemModal> | SavedFavoriteModal;

export const {
  getListFavorites,
  getListFavoritesSucceeded,
  getListFavoritesFailed,
  savedFavorite,
  savedFavoriteSucceeded,
  savedFavoriteFailed,
} = createActions<FavoritesPayload>(
  {
    GET_LIST_FAVORITES: (payload: GetFavoriteModal) => payload,
    GET_LIST_FAVORITES_SUCCEEDED: (payload: DataList<FavoriteItemModal>) => payload,
    GET_LIST_FAVORITES_FAILED: null,
    SAVED_FAVORITE: (payload: SavedFavoriteModal) => payload,
    SAVED_FAVORITE_SUCCEEDED: null,
    SAVED_FAVORITE_FAILED: null,
  },
  {
    prefix: 'favorites',
  },
);
