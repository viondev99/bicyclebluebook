import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Benefits from 'components/Sell/Benefits';
import DealerNearYou from 'components/DealerLocator/DealerNearYouSection';
import BecomePartnerSection from 'components/DealerLocator/BecomePartnerIntroSection';
import Head from 'next/head';
import CONFIG from 'config';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function DealerLocator() {
  return (
    <>
      <Head>
        <title>Trade-In Partner Directory - BicycleBlueBook.com</title>
        <meta property="og:url" content={`${CONFIG.WEB_URL}dealer-locator`} />
        <meta property="og:type" content="Bicycle" />
        <meta property="og:title" content="Trade-In Partner" />
        <meta
          property="og:description"
          content="Use the search feature or scroll through our nationwide network of Tradein Partners by state to find a participating bike shop near you."
        />
        <meta property="og:image" content={`${CONFIG.CDN_RESOURCE}_assets/bg-1.jpg`} />
        <meta name="keywords" content="BicycleBlueBook,Trade-In,Partner" />
        <meta
          name="description"
          content="Use the search feature or scroll through our nationwide network of Tradein Partners by state to find a participating bike shop near you."
        />
      </Head>
      <DealerNearYou />
      <Benefits />
      <BecomePartnerSection />
    </>
  );
}

DealerLocator.renderLayout = renderMainLayout;

export default withInjectAllSaga(DealerLocator);
