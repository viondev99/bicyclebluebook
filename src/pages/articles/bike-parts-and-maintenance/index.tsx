import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import Head from 'next/head';
import { DEFAULT_SEO_TWITTER_IMAGE_BBB, SEO_IMAGE_ARTICLE_BIKE_AND_MAINTENANCE } from 'helpers/constraint.helper';
import BikePartsAndMaintenance from 'components/Articles/bike-parts-and-maintenance';

const BikePartsAndMaintenancePage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>How to Maintain a Bike: Essential Tips for Every Rider</title>
        <meta name="og:title" content="How to Maintain a Bike: Essential Tips for Every Rider" />
        <meta
          name="keywords"
          content="bike parts & maintenance, bicycle maintenance, road bike maintenance, basic bike maintenance, cycle maintenance, how to maintain a bike, basic road bicycle maintenance, bicycle repairs and maintenance, basic mountain bike maintenance, road bike repairs"
        />
        <meta
          name="description"
          content="A smooth ride on any bike requires TLC. Learning basic bike parts & maintenance skills will pay dividends. ✓ Learn how to maintain a bike with these tips!"
        />
        <meta
          name="og:description"
          content="A smooth ride on any bike requires TLC. Learning basic bike parts & maintenance skills will pay dividends. ✓ Learn how to maintain a bike with these tips!"
        />
        <meta name="author" content="" />
        <meta name="og:image" content={SEO_IMAGE_ARTICLE_BIKE_AND_MAINTENANCE} />
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
      <BikePartsAndMaintenance />
    </>
  );
};

export default BikePartsAndMaintenancePage;
BikePartsAndMaintenancePage.renderLayout = renderMainLayout;
