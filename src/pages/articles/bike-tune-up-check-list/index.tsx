import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import Head from 'next/head';
import BikeTurnUpCheckList from 'components/Articles/bike-tune-up-check-list';
import CONFIG from 'config';

const BikeTurnUpCheckListPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <meta name="og:title" content="Bike Tune-Up Checklist: How to Tune Up Your Road or Mountain Bike" />
        <meta name="og:image" content={`${CONFIG.IMAGE_CDN_URL}/biking-at-night-tablet.webp`} />
        <title>Bike Tune-Up Checklist: How to Tune Up Your Road or Mountain Bike</title>
      </Head>
      <BikeTurnUpCheckList />
    </>
  );
};

export default BikeTurnUpCheckListPage;
BikeTurnUpCheckListPage.renderLayout = renderMainLayout;
