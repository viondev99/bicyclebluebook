import { useEffect, useState } from 'react';
import { compareStorage } from '../api/compare.api';

export function useListCompareId() {
  const [listCompareId, setListCompareId] = useState([]);
  useEffect(() => {
    setListCompareId(compareStorage.getCompareList());
  }, []);
  useEffect(() => {
    return compareStorage.onCompareListChange(setListCompareId);
  }, []);
  return listCompareId;
}
