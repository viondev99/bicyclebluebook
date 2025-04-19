import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import BicycleSizingBasic from 'components/Articles/bicycle-sizing-basic';
import Head from 'next/head';
import { DEFAULT_SEO_TWITTER_IMAGE_BBB } from 'helpers/constraint.helper';
import CONFIG from 'config';

const BicycleSizingBasicPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Bicycle Sizing Basics</title>
        <meta name="og:title" content="Bicycle Sizing Basics" />
        {/* <meta
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
        /> */}
        <meta name="author" content="" />
        <meta name="og:image" content={`${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_tablet.webp`} />
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
      <BicycleSizingBasic />
    </>
  );
};

export default BicycleSizingBasicPage;
BicycleSizingBasicPage.renderLayout = renderMainLayout;
