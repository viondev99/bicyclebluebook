import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, parseJwt } from 'helpers/utilities.helper';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import FilterQuotes from 'components/PartnerPortal/TradeInScoreCard/Quotes/Filter';
import ScoreCardList from 'components/PartnerPortal/TradeInScoreCard/Quotes/ScoreCardList';
import { withInjectAllSaga } from 'hocs/withAllSagaInjected';

const Quotes: FC & ComponentStatic = () => {
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
    <PartnerPortalLayout titleMobile="Quotes">
      <>
        <FilterQuotes />
        <ScoreCardList />
      </>
    </PartnerPortalLayout>
  );
};

Quotes.renderLayout = renderMainLayout;

export default withInjectAllSaga(Quotes);
