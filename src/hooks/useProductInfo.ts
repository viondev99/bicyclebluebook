import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { Product } from 'model/common';
import { getProductsInfo } from 'store/info/info.action';

export function useProductInfo(payload: Number[]): Partial<Product>[];

export function useProductInfo(payload: number): Partial<Product>;

export function useProductInfo(payload: number | Number[]) {
  const productIds = useSelector((store: StoreState) => store.info.productIds);
  const productsInfo = useSelector((store: StoreState) => store.info.productsInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    let ids: Number[] = Array.isArray(payload) ? payload : [payload];
    ids = ids.filter((item) => !productIds.includes(item) && item);
    if (ids.length) {
      dispatch(getProductsInfo(ids));
    }
  }, [payload, productIds, dispatch]);

  return Array.isArray(payload)
    ? productsInfo.filter((item) => payload.includes(item.masterListingId))
    : productsInfo.find((item) => item.masterListingId === payload);
}
