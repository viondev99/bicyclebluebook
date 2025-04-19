import React, { FC } from 'react';
import CoverSection from 'components/Articles';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import Head from 'next/head';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB } from 'helpers/constraint.helper';
import V3BannerComponent from 'components/V3BannerComponent';
import classes from './articles.module.scss';

const Articles: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Articles - Bicycle Blue Book - BicycleBlueBook.com</title>
        <meta name="og:title" content="Articles - Bicycle Blue Book - BicycleBlueBook.com" />
        <meta name="keywords" content="Articles - Bicycle Blue Book - BicycleBlueBook.com" />
        <meta
          name="description"
          content="Bicycle Blue Book articles are your source for cycling tips, bike reviews, and learning how to sell your bike "
        />
        <meta
          name="og:description"
          content="Bicycle Blue Book articles are your source for cycling tips, bike reviews, and learning how to sell your bike "
        />
        <meta name="author" content="" />
        <meta name="og:image" content={DEFAULT_SEO_IMAGE_BBB} />
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
      <V3BannerComponent customWrapBanner={classes.customWrapBanner} />
      <CoverSection />
    </>
  );
};

export default Articles;
Articles.renderLayout = renderMainLayout;
