import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import HistoryTab from 'components/PartnerPortal/TradeInScoreCard/History/HistoryTab/HistoryTab';
import FilterHistoryScc from 'components/PartnerPortal/TradeInScoreCard/History/Filter/Filter';
import ScoreCardList from 'components/PartnerPortal/TradeInScoreCard/History/ScoreCardList/ScoreCardList';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, parseJwt } from 'helpers/utilities.helper';
import { useRouter } from 'next/router';
import { constHistoryPartnerTradeInTabName } from 'components/PartnerPortal/CostCalculator/constraint';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const History: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const token = useSelector((state: StoreState) => state.authenticate.token);
  const activeTab = query.tab || constHistoryPartnerTradeInTabName.INBOX;
  const tokenPayload = useMemo(() => parseJwt(token), [token]);

  useEffect(() => {
    if (isLoggedIn && tokenPayload?.partner !== undefined) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
      dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    }
  }, [dispatch, isLoggedIn, token, tokenPayload, userInfo]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        tab: activeTab,
      },
    });
  }, []);

  return (
    <PartnerPortalLayout titleMobile={'Scorecard History'}>
      <>
        {/* <HistoryTab /> */}
        <FilterHistoryScc />
        <ScoreCardList />
      </>
    </PartnerPortalLayout>
  );
};

History.renderLayout = renderMainLayout;

export default withInjectAllSaga(History);
