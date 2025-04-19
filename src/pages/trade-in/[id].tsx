import React, { FC } from 'react';
import { NextPageContext } from 'next';
import { ComponentStatic } from 'model/common';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const TradeInDetail: FC & ComponentStatic = () => {
  return <div className="wrapper-with-header" />;
};

TradeInDetail.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/dealer-locator');
};

export default withInjectAllSaga(TradeInDetail);
