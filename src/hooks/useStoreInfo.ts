import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { UserBasicInfoModel } from 'model/store/info.model';
import { getStoresInfo } from 'store/info/info.action';

export function useStoreInfo(payload: String[]): UserBasicInfoModel[];

export function useStoreInfo(payload: string): UserBasicInfoModel;

export function useStoreInfo(payload: string | String[]) {
  const storeIds = useSelector((store: StoreState) => store.info.storeIds);
  const storesInfo = useSelector((store: StoreState) => store.info.storesInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    let ids: String[] = Array.isArray(payload) ? payload : [payload];
    ids = ids.filter((item) => !storeIds.includes(item) && item);
    if (ids.length) {
      dispatch(getStoresInfo(ids));
    }
  }, [payload, storeIds, dispatch]);

  return Array.isArray(payload)
    ? storesInfo.filter((item) => payload.includes(item.id))
    : storesInfo.find((item) => item.id === payload);
}
