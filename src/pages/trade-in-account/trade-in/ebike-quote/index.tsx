import React, { FC } from 'react';
import EBikeQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/EBikeQuote';
import { ComponentStatic } from 'model/common';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const EBikeQuote: FC & ComponentStatic = () => {
  // return <EBikeQuoteContainer />;
  return null;
};

EBikeQuote.renderLayout = null;

EBikeQuote.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/trade-in-account/trade-in/new');
};

export default withInjectAllSaga(EBikeQuote);
