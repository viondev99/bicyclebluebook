import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import BikingAtNight from 'components/Articles/biking-at-night';
import Head from 'next/head';
import { DEFAULT_SEO_TWITTER_IMAGE_BBB, SEO_IMAGE_ARTICLE_LISTING } from 'helpers/constraint.helper';
import CONFIG from 'config';

const BikingAtNightPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>How to Stay Safe Biking at Night: Essential Tips </title>
        <meta name="og:title" content="How to Stay Safe Biking at Night: Essential Tips" />
        <meta
          name="keywords"
          content="biking at night, biking night, when riding at night, the biking night, when riding a bicycle at night, riding at night, riding bike at night, cycling at night, night bicycle rides, bike riding at night"
        />
        <meta
          name="description"
          content="Searching for tips on biking at night? Our guide includes the essential tips you need to follow to stay safe while cycling. ✓ Click here to learn more!"
        />
        <meta
          name="og:description"
          content="Searching for tips on biking at night? Our guide includes the essential tips you need to follow to stay safe while cycling. ✓ Click here to learn more!"
        />
        <meta name="author" content="" />
        <meta name="og:image" content={`${CONFIG.IMAGE_CDN_URL}/biking-at-night-tablet.webp`} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:url" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:title" content="Marketplace - Bicycles for sale - BicycleBlueBook.com" />
        <meta
          property="twitter:description"
          content="Whether you're looking to buy or sell, our Marketplace of bicycles for sale offers a safe, secure, and hassle-free experience that is unmatched."
        />
      </Head>
      <BikingAtNight />
    </>
  );
};

export default BikingAtNightPage;
BikingAtNightPage.renderLayout = renderMainLayout;
