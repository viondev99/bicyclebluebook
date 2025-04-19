import React, { FC } from 'react';
import CustomQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/CustomQuote';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const CustomQuote: FC & ComponentStatic = () => {
  return <CustomQuoteContainer isCreateNewCustomQuote={true} />;
};

CustomQuote.renderLayout = null;

export default withInjectAllSaga(CustomQuote);
