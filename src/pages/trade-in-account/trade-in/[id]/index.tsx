import React, { FC, useEffect } from 'react';
import StandardQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/StandardQuote';
import { ComponentStatic } from 'model/common';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { withInjectAllSaga } from 'hocs/withAllSagaInjected';

const StandardQuote: FC & ComponentStatic = () => {
  const { query } = useRouter();
  const dispatch = useDispatch();
  // const dataStepDetailStandardQuote = useSelector(
  //   (state: StoreState) => state.partner.scorecard.dataStepDetailStandardQuote,
  // );

  useEffect(() => {
    dispatch(scoreCardAction.getStepDetailStandardQuote(query?.id));
  }, [dispatch, query]);
  return <StandardQuoteContainer />;
  // return <>{dataStepDetailStandardQuote?.isEbike ? <EBikeQuoteContainer /> : <StandardQuoteContainer />}</>;
};

StandardQuote.renderLayout = null;

export default withInjectAllSaga(StandardQuote);
