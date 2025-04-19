import { Action, handleActions } from 'redux-actions';
import { FavoritesPayload } from './favorites.action';
import { FavoriteItemModal, FavoritesStoreModel } from '../../../../model/store/account/personal/favorites.model';
import { DataList } from '../../../../model/common';
import { GetFavoriteModal } from '../../../../model/api/account/personal/favorites.model';

const INIT_STATE: FavoritesStoreModel = {
  queryParams: {
    page: 1,
    size: 10,
  },
  listFavorites: null,
  loading: false,
};

const favoritesReducer = handleActions<FavoritesStoreModel, FavoritesPayload>(
  {
    GET_LIST_FAVORITES: (state, action: Action<GetFavoriteModal>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LIST_FAVORITES_SUCCEEDED: (state, action: Action<DataList<FavoriteItemModal>>) => {
      return {
        ...state,
        listFavorites: action.payload,
        loading: false,
      };
    },
    GET_LIST_FAVORITES_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    SAVED_FAVORITE: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    SAVED_FAVORITE_SUCCEEDED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    SAVED_FAVORITE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'favorites',
  },
);

export default favoritesReducer;
