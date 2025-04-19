import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/Help/SectionListCard';
import TabSection from 'components/Help/FAQ/FAQ';
import Head from 'next/head';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function FAQs() {
  return (
    <>
      <Head>
        <title>FAQs - Used Bikes for Sale - BicycleBlueBook</title>
        <meta name="keywords" content="used bicycles for sale" />
        <meta
          name="description"
          content="Not sure about our services? This page provides info on our major offerings: finding a bicycles value, trade-ins, selling, and buying used bicycles for sale."
        />
        <meta name="author" content="" />
      </Head>
      <CoverSection />
      <TabSection />
    </>
  );
}

FAQs.renderLayout = renderMainLayout;
export default withInjectAllSaga(FAQs);
