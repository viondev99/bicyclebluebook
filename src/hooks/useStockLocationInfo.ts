import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { StockLocationInfoModel } from 'model/store/info.model';
import { getStockLocationsInfo } from 'store/info/info.action';

export function useStockLocationInfo(payload: String[]): StockLocationInfoModel[];

export function useStockLocationInfo(payload: string): StockLocationInfoModel;

export function useStockLocationInfo(payload: string | String[]) {
  const stockLocationIds = useSelector((store: StoreState) => store.info.stockLocationIds);
  const stockLocationsInfo = useSelector((store: StoreState) => store.info.stockLocationsInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    let ids: String[] = Array.isArray(payload) ? payload : [payload];
    ids = ids.filter((item) => !stockLocationIds.includes(item) && item);
    if (ids.length) {
      dispatch(getStockLocationsInfo(ids));
    }
  }, [payload, stockLocationIds, dispatch]);

  return useMemo(() => {
    return Array.isArray(payload)
      ? stockLocationsInfo.filter((item) => payload.includes(item.id))
      : stockLocationsInfo.find((item) => item.id === payload);
  }, [payload, stockLocationsInfo]);
}
