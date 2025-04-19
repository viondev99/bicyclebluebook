import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import ScoreCardList from 'components/PartnerPortal/TradeInScoreCard/Leads/ScoreCardList';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, parseJwt } from 'helpers/utilities.helper';
import { withInjectAllSaga } from 'hocs/withAllSagaInjected';
import FilterLeads from 'components/PartnerPortal/TradeInScoreCard/Leads/Filter';

const Leads: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const token = useSelector((state: StoreState) => state.authenticate.token);
  const tokenPayload = useMemo(() => parseJwt(token), [token]);

  useEffect(() => {
    if (isLoggedIn && tokenPayload?.partner !== undefined) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
      dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    }
  }, [dispatch, isLoggedIn, token, tokenPayload, userInfo]);

  return (
    <PartnerPortalLayout titleMobile="Leads">
      <>
        <FilterLeads />
        <ScoreCardList />
      </>
    </PartnerPortalLayout>
  );
};

Leads.renderLayout = renderMainLayout;

export default withInjectAllSaga(Leads);
