import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import PartnerPortalLayout from 'layout/Account/Partner';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import FilterReconciliationReport from 'components/PartnerPortal/TradeInScoreCard/ReconciliationReport/Filter/Filter';
import { parseJwt } from 'helpers/utilities.helper';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const ReconciliationReport: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const token = parseJwt(useSelector((state: StoreState) => state.authenticate.token));

  useEffect(() => {
    if (isLoggedIn && token?.partner !== undefined) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, isLoggedIn, token, userInfo]);

  return (
    <PartnerPortalLayout titleMobile={'Reconciliation Report'}>
      <FilterReconciliationReport />
    </PartnerPortalLayout>
  );
};

ReconciliationReport.renderLayout = renderMainLayout;

export default withInjectAllSaga(ReconciliationReport);
