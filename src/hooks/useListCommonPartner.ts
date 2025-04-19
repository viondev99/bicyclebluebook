import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { getPartners } from 'store/common/common.action';

export function useListCommonPartner() {
  const partners = useSelector((store: StoreState) => store.common.partners);
  const dispatch = useDispatch();

  useEffect(() => {
    if (partners?.length === 0) {
      dispatch(getPartners());
    }
  }, [dispatch, partners]);

  return useMemo(
    () =>
      partners
        ? partners?.map((partner) => {
            return {
              value: partner.id,
              label: partner.name,
            };
          })
        : [],
    [partners],
  );
}
