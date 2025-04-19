import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { getListStoreFront } from 'store/common/common.action';

export function useListStoreFronts(checkConditionGetListStoreFront: boolean, page_size?: number) {
  const dispatch = useDispatch();
  const listStoreFronts = useSelector((store: StoreState) => store.common.listStoreFronts);

  useEffect(() => {
    if (listStoreFronts?.length === 0 && checkConditionGetListStoreFront) {
      dispatch(getListStoreFront({ page_size: page_size || -1 }));
    }
  }, [dispatch, checkConditionGetListStoreFront]);

  return listStoreFronts;
}
