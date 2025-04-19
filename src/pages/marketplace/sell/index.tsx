import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/Sell/CoverSection';
import Benefits from 'components/Sell/Benefits';
import ServiceSection from 'components/Sell/ServiceSection';
import Recommended from 'components/Sell/Recommended';
import Head from 'next/head';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

// import { universalRedirect } from '../../helpers/ssr.helper';

function Sell() {
  return (
    <>
      <Head>
        <title>Sell your bike - Bicyclebluebook.com</title>
        <meta name="description" content="Bicyclebluebook.com Online stores" />
      </Head>
      <CoverSection />
      <ServiceSection />
      <Benefits />
      <Recommended />
    </>
    // </Container>
  );
}

export default withInjectAllSaga(Sell);
Sell.renderLayout = renderMainLayout;
