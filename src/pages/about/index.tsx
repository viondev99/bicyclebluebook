import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/About/BackgroundSection';
import TabSection from 'components/About/TabSection';
import Head from 'next/head';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function About() {
  return (
    <>
      <Head>
        <title>About Us - Used Bikes for Sale - BicycleBlueBook</title>
        <meta name="description" content="ABOUT US" />
      </Head>
      <CoverSection />
      <TabSection />
    </>
  );
}

export default withInjectAllSaga(About);
About.renderLayout = renderMainLayout;
