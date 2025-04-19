import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import BecomePartnerPage from 'components/BecomePartner';
import Head from 'next/head';

function BecomePartner() {
  return (
    <>
      <Head>
        <title>Become A Partner - Used Bikes for Sale - BicycleBlueBook</title>
        <meta name="description" content="Become A Partner" />
      </Head>
      <BecomePartnerPage />
    </>
  );
}

export default BecomePartner;
BecomePartner.renderLayout = renderMainLayout;
