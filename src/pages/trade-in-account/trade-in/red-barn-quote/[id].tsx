import React, { useEffect } from 'react';
import RedBarnQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/RedBarnQuote';
import { withInjectAllSaga } from 'hocs/withAllSagaInjected';
import { ComponentStatic } from 'model/common';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';
import scoreCardAction from 'store/partner/scorecard/score-card.action';

const RedBarnQuoteDetail: React.FC & ComponentStatic = () => {
  const { query } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (query?.id) {
      dispatch(scoreCardAction.getStepDetailRedBarnQuote(query?.id));
    }
  }, [dispatch, query]);

  return <RedBarnQuoteContainer />;
};

RedBarnQuoteDetail.renderLayout = null;

export default withInjectAllSaga(RedBarnQuoteDetail);
