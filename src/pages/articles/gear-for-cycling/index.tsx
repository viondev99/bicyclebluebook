import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import GearForCycling from 'components/Articles/gear-for-cycling';
import Head from 'next/head';
import { DEFAULT_SEO_TWITTER_IMAGE_BBB, SEO_IMAGE_ARTICLE_CYCLING } from 'helpers/constraint.helper';

const GearForCyclingPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Cycling Must-Haves: Bike Essentials You Need to Stay Safe</title>
        <meta name="og:title" content="Cycling Must-Haves: Bike Essentials You Need to Stay Safe" />
        <meta
          name="keywords"
          content="gear for cycling,cyclist gear, cycling need, biking essentials, bike essentials, cycling essentials, must have road bike accessories, essential road bike accessories, biking equipment, cycling must haves "
        />
        <meta
          name="description"
          content="Following the advice in this gear for cycling guide will ensure that your next ride is equipped with everything you need, no matter the distance. ✓ Learn more! 
          "
        />
        <meta
          name="og:description"
          content="Following the advice in this gear for cycling guide will ensure that your next ride is equipped with everything you need, no matter the distance. ✓ Learn more! 
          "
        />
        <meta name="author" content="" />
        <meta name="og:image" content={SEO_IMAGE_ARTICLE_CYCLING} />
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
      <GearForCycling />
    </>
  );
};

export default GearForCyclingPage;
GearForCyclingPage.renderLayout = renderMainLayout;
