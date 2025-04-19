import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import PartnerPortalLayout from 'layout/Account/Partner';
import FilterReimbursements from 'components/PartnerPortal/TradeInScoreCard/Reimbursements/Filter/Filter';
import ScoreCardList from 'components/PartnerPortal/TradeInScoreCard/Reimbursements/ScoreCardList/ScoreCardList';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { parseJwt } from 'helpers/utilities.helper';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const ReimbursementStatus: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [sortValue, setSortValue] = useState<string>('DATE_RECEIVED');
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const token = parseJwt(useSelector((state: StoreState) => state.authenticate.token));

  useEffect(() => {
    if (isLoggedIn && token?.partner !== undefined) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, isLoggedIn, token, userInfo]);

  return (
    <PartnerPortalLayout titleMobile={'Reimbursements'}>
      <>
        <FilterReimbursements sortValue={sortValue} setSortValue={setSortValue} />
        <ScoreCardList sortValue={sortValue} />
      </>
    </PartnerPortalLayout>
  );
};

ReimbursementStatus.renderLayout = renderMainLayout;

export default withInjectAllSaga(ReimbursementStatus);
