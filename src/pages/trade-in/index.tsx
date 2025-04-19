import React, { FC } from 'react';
import Head from 'next/head';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/TradeIn/CoverSection';
import ServiceSection from 'components/TradeIn/ServiceSection';
import FeatureSection from 'components/TradeIn/FeatureSection';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const TradeIn: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Trade in your old bike for a new one - BicycleBlueBook.com</title>
        <meta
          name="description"
          content="Trade in your old bike for a new one, Get a quote for your current bike and see which of our partners has the bike you want next."
        />
      </Head>
      <CoverSection />
      <ServiceSection />
      <FeatureSection />
    </>
  );
};

TradeIn.getInitialProps = async ({ store }) => {
  return {};
};

TradeIn.renderLayout = renderMainLayout;

export default withInjectAllSaga(TradeIn);
