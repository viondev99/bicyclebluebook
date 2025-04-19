import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { getModelByBrandFamily, ModelResponse } from '../../api/marketplace.api';
import { CANCEL_KEY } from '../../helpers/request/request';

export interface FamilySelected {
  brandIds: number[];
  productFamily: string;
}

const cachedEmptyArray: [] = [];

const fetcher = (url: string, key: string) => {
  const brandIDs = key.split('-').shift().split(',');
  const familyNames = JSON.parse(key.split('-').slice(1).join('-'));
  if (familyNames?.length === 0) {
    return null;
  }
  return getModelByBrandFamily(brandIDs, familyNames);
};

export default function useListModel(listBrandIds: string[], listFamilyName: FamilySelected[]) {
  // const [listFamily, setListFamily] = useState<ModelResponse[]>([]);
  // // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   if (listFamilyName.length !== 0 || listBrandIds.length !== 0) {
  //     const request = getModelByBrandFamily(listBrandIds, listFamilyName);
  //     request.then(setListFamily).catch((err) => {
  //       if (!axios.isCancel(err)) {
  //         console.log(err);
  //       }
  //     });
  //     return () => request[CANCEL_KEY]();
  //   }
  //   setListFamily(cachedEmptyArray);
  // }, [listBrandIds, listFamilyName]);
  // return listFamily;

  // console.log(listFamilyName);
  const { data = cachedEmptyArray, error } = useSWR<ModelResponse[]>(
    ['/model', `${listBrandIds.toString()}-${JSON.stringify(listFamilyName)}`],
    fetcher,
    { revalidateOnFocus: false },
  );
  return data || [];
}
