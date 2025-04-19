import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import SellYourBikeContainer from 'components/SellYourBike/LandingPage/SellYourBikeLandingPage';
import Head from 'next/head';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB, getSeoHelmet } from 'helpers/constraint.helper';
import { isProduction } from 'helpers/utilities.helper';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function SellYourBike() {
  return (
    <>
      <Head>
        <title>{getSeoHelmet().SELL_TRADEIN.default.title}</title>
        <meta name="description" content={getSeoHelmet().SELL_TRADEIN.default.description} />
        <meta name="keywords" content={getSeoHelmet().SELL_TRADEIN.default.keyword} />
        <meta name="author" content="" />
        <meta name="og:title" content={getSeoHelmet().SELL_TRADEIN.default.title} />
        <meta name="og:description" content={getSeoHelmet().SELL_TRADEIN.default.description} />
        <meta name="og:image" content={DEFAULT_SEO_IMAGE_BBB} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:url" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:title" content={getSeoHelmet().SELL_TRADEIN.default.description} />
        <meta property="twitter:description" content={getSeoHelmet().SELL_TRADEIN.default.description} />
        <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
      </Head>
      <SellYourBikeContainer />
    </>
  );
}

SellYourBike.renderLayout = renderMainLayout;

export default withInjectAllSaga(SellYourBike);
