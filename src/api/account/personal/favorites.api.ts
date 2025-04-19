import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { DataList } from '../../../model/common';
import { FavoriteItemModal } from '../../../model/store/account/personal/favorites.model';
import { GetFavoriteModal, SavedFavoriteModal } from '../../../model/api/account/personal/favorites.model';

export type ListFavoriteResponse = DataList<FavoriteItemModal>;

export type SavedFavoriteResponse = DataList<FavoriteItemModal>;

export function getListFavorites(data: GetFavoriteModal): PromiseWithCancel<ListFavoriteResponse> {
  return authorizedRequest.get<ListFavoriteResponse>('core/api/favourite', { params: data });
}

export function savedFavoriteItem(data: SavedFavoriteModal): PromiseWithCancel<SavedFavoriteResponse> {
  return authorizedRequest.delete<SavedFavoriteResponse>('core/api/favourite/', { params: data });
}
