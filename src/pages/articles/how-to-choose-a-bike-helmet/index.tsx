import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import HowToChooseABikeHelmet from 'components/Articles/how-to-choose-a-bike-helmet';
import Head from 'next/head';
import { DEFAULT_SEO_TWITTER_IMAGE_BBB, SEO_IMAGE_ARTICLE_LISTING } from 'helpers/constraint.helper';
import CONFIG from 'config';

const BikingAtNightPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Types of Bike Helmets - How to Choose the Right One</title>
        <meta name="og:title" content="Types of Bike Helmets - How to Choose the Right One" />
        <meta
          name="keywords"
          content="how to choose a bike helmet, how to measure head for bike helmet, bike helmet sizes, types of bike helmets, bike helmet measurements, how to buy a bike helmet, bike helmet styles, bike helmet types, what to look for in a bike helmet, choosing a bike helmet"
        />
        <meta
          name="description"
          content="Wondering what to look for in a bike helmet? We explain how to choose a bike helmet that suits your cycling needs while also keeping you safe. ✓ Get started! 
          "
        />
        <meta
          name="og:description"
          content="Wondering what to look for in a bike helmet? We explain how to choose a bike helmet that suits your cycling needs while also keeping you safe. ✓ Get started! 
          "
        />
        <meta name="author" content="" />
        <meta name="og:image" content={`${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_tablet.webp`} />
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
      <HowToChooseABikeHelmet />
    </>
  );
};

export default BikingAtNightPage;
BikingAtNightPage.renderLayout = renderMainLayout;
