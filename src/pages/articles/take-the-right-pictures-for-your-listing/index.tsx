import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import TakeTheRightPictures from 'components/Articles/take-the-right-pictures';
import Head from 'next/head';
import { DEFAULT_SEO_TWITTER_IMAGE_BBB, SEO_IMAGE_ARTICLE_LISTING } from 'helpers/constraint.helper';

const GearForCyclingPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Take The Right Pictures For Your Listing</title>
        <meta name="og:title" content="Take The Right Pictures For Your Listing" />
        <meta name="keywords" content="Take The Right Pictures For Your Listing          " />
        {/* <meta
          name="description"
          content="Following the advice in this gear for cycling guide will ensure that your next ride is equipped with everything you need, no matter the distance. ✓ Learn more! 
          "
        />
        <meta
          name="og:description"
          content="Following the advice in this gear for cycling guide will ensure that your next ride is equipped with everything you need, no matter the distance. ✓ Learn more! 
          "
        /> */}
        <meta name="author" content="" />
        <meta name="og:image" content={SEO_IMAGE_ARTICLE_LISTING} />
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
      <TakeTheRightPictures />
    </>
  );
};

export default GearForCyclingPage;
GearForCyclingPage.renderLayout = renderMainLayout;
