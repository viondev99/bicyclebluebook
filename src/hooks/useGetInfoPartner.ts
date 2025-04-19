import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { isRolePartnerInstantPayout } from 'helpers/utilities.helper';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';

export function useGetInfoPartner() {
  const dispatch = useDispatch();
  const partner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);

  useEffect(() => {
    handleGetPartnerLocationDetail();
  }, []);

  const handleGetPartnerLocationDetail = useCallback(() => {
    if (userInfo?.partner && !partner) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, userInfo]);

  const isInstantPayout = useMemo(() => {
    return partner?.is_instant_payout && isRolePartnerInstantPayout(userInfo?.role);
  }, [partner, userInfo]);

  return { isInstantPayout };
}
