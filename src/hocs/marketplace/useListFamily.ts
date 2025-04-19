import { useEffect, useState } from 'react';
import axios from 'axios';
import { FamilyResponse, getFamilyByBrands, getModelByBrandFamily } from '../../api/marketplace.api';
import { CANCEL_KEY } from '../../helpers/request/request';
import useSWR from 'swr';

const cachedEmptyArray: [] = [];

const fetcher = (url: string, listBrandIds: string) => {
  const brandIDs = listBrandIds ? listBrandIds.split(',') : [];
  return getFamilyByBrands(brandIDs);
};

export function useListFamily(listBrandIds: string[]) {
  // const [listFamily, setListFamily] = useState<FamilyResponse[]>([]);
  // // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   if (listBrandIds.length > 0) {
  //     const request = getFamilyByBrands(listBrandIds);
  //     request.then(setListFamily).catch((err) => {
  //       if (!axios.isCancel(err)) {
  //         console.log(err);
  //       }
  //     });
  //     return () => request[CANCEL_KEY]();
  //   }
  //   setListFamily(cachedEmptyArray);
  // }, [listBrandIds]);
  // return listFamily;
  const { data = cachedEmptyArray, error } = useSWR(['/family', `${listBrandIds.toString()}`], fetcher, {
    revalidateOnFocus: false,
  });
  return data;
}
