import React, { FC } from 'react';
import { ComponentStatic } from 'model/common';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const BikeFinder: FC & ComponentStatic = () => {
  // return <EBikeQuoteContainer />;
  return null;
};

BikeFinder.renderLayout = null;

BikeFinder.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/bike-finder/request');
};

export default withInjectAllSaga(BikeFinder);
