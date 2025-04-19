import React, { FC } from 'react';
import TradeInRequestContainer from 'components/PartnerPortal/TradeInScoreCard/TradeInRequest';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

const TradeInRequest: FC & ComponentStatic = () => {
  return <TradeInRequestContainer />;
};

TradeInRequest.renderLayout = null;

export default withInjectAllSaga(TradeInRequest);
