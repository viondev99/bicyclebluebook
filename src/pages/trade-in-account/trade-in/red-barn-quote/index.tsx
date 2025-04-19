import React, { FC } from 'react';
import RedBarnQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/RedBarnQuote';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const RedBarnQuote: FC & ComponentStatic = () => {
  return <RedBarnQuoteContainer />;
};

RedBarnQuote.renderLayout = null;

export default withInjectAllSaga(RedBarnQuote);
