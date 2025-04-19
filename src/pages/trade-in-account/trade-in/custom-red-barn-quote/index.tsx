import React, { FC } from 'react';
import CustomRedBarnQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/CustomRedBarnQuote';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const CustomRedBarnQuote: FC & ComponentStatic = () => {
  return <CustomRedBarnQuoteContainer isCreateNewCustomQuote={true} />;
};

CustomRedBarnQuote.renderLayout = null;

export default withInjectAllSaga(CustomRedBarnQuote);
