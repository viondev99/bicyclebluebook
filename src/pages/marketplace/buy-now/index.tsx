/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB, getSeoHelmet } from 'helpers/constraint.helper';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import Search from 'components/Marketplace/Search/Search';
import MarketplaceContainer from 'components/Marketplace/List/MarketplaceContainer';
import MoneySafeModal from 'components/Marketplace/MoneySafeModal/MoneySafeModal';
import { MONEY_SAFE_KEY } from 'constants/common';
import V3BannerComponent from 'components/V3BannerComponent';
import { checkExistLocalStorage, isProduction } from 'helpers/utilities.helper';
import { withInjectAllSaga } from 'hocs/withAllSagaInjected';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getSeoMKP } from 'helpers/constraintSeoMKP';

const Marketplace: FC & ComponentStatic = () => {
  const { query, asPath } = useRouter();
  const bannerPublishingData = useSelector((store: StoreState) => store.common.bannerPublishing);
  const [show, setShow] = useState<boolean>(false);

  const renderHelmetInfo = useCallback(
    (key: string) => {
      const typeBicycleNames = query.t || '';

      if (typeBicycleNames.includes('Mountain')) {
        return key === 'title'
          ? getSeoHelmet().MARKETPLACE_BUYNOW.Mountain.title
          : key === 'description'
          ? getSeoHelmet().MARKETPLACE_BUYNOW.Mountain.description
          : getSeoHelmet().MARKETPLACE_BUYNOW.Mountain.keyword;
      }
      if (typeBicycleNames.includes('Road')) {
        return key === 'title'
          ? getSeoHelmet().MARKETPLACE_BUYNOW.Road.title
          : key === 'description'
          ? getSeoHelmet().MARKETPLACE_BUYNOW.Road.description
          : getSeoHelmet().MARKETPLACE_BUYNOW.Road.keyword;
      }
      return key === 'title'
        ? getSeoHelmet().MARKETPLACE_BUYNOW.default.title
        : key === 'description'
        ? getSeoHelmet().MARKETPLACE_BUYNOW.default.description
        : getSeoHelmet().MARKETPLACE_BUYNOW.default.keyword;
    },
    [query.t],
  );

  const renderMeta = useMemo(() => {
    const typeBikeNameT = query.t;
    const typeBikeNameB = query.b;
    if (typeBikeNameB === '683') {
      return getSeoMKP().GIANT_BIKES_FOR_SALE;
    }
    if (
      asPath === '/marketplace/buy-now/' ||
      asPath === '/marketplace/buy-now' ||
      asPath === '/marketplace/buy-now/?page=1' ||
      (query.sn === '' && query.fm === '' && query.m === '')
    ) {
      return getSeoMKP().USED_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '714') {
      return getSeoMKP().NORCO_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '685') {
      return getSeoMKP().GT_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '681') {
      return getSeoMKP().FUJI_BIKES_FOR_SALE;
    }
    if (typeBikeNameT === 'Road') {
      return getSeoMKP().ROAD_BIKES_FOR_SALE;
    }
    if (typeBikeNameT === 'Mountain') {
      return getSeoMKP().USED_MOUNTAIN_BIKES_FOR_SALE;
    }
    if (asPath === '/value-guide/Gary%20Fisher/') {
      return getSeoMKP().GARY_FISHER_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '750') {
      return getSeoMKP().TREK_BIKES_FOR_SALE;
    }
    if (!isProduction() && typeBikeNameB === '1312') {
      return getSeoMKP().TREK_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '694') {
      return getSeoMKP().KONA_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '679') {
      return getSeoMKP().DIAMONDBACK_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '723') {
      return getSeoMKP().RALEIGH_BIKES_FOR_SALE;
    }
    if (typeBikeNameT === 'Hybrid') {
      return getSeoMKP().HYBRID_BIKES_FOR_SALE;
    }
    return null;
  }, [query, asPath]);

  useEffect(() => {
    if (checkExistLocalStorage() && !localStorage?.getItem(MONEY_SAFE_KEY)) {
      setShow(true);
      // eslint-disable-next-line no-unused-expressions
      localStorage?.setItem(MONEY_SAFE_KEY, 'TRUE');
    }
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div className="wrapper-with-header">
      <Head>
        <title>{renderMeta?.titlePage || 'Used Bikes For Sale - Marketplace - BicycleBlueBook.com'}</title>
        <meta name="description" content={renderHelmetInfo('description')} />
        <meta name="keywords" content={renderHelmetInfo('keywords')} />
        <meta name="author" content="" />
        <meta name="og:title" content={renderHelmetInfo('title')} />
        <meta name="og:description" content={renderHelmetInfo('description')} />
        <meta name="og:image" content={DEFAULT_SEO_IMAGE_BBB} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />
        {renderMeta && <meta name="description" content={renderMeta.meta} />}
        {renderMeta && <meta name="keywords:focus" content={renderMeta.keywordsFocus} />}
        {renderMeta && <meta name="keywords:secondary" content={renderMeta.secondaryKeywords} />}
        {renderMeta && <meta name="keywords:semantic" content={renderMeta.semanticKeywords} />}

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:url" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:title" content={renderHelmetInfo('title')} />
        <meta property="twitter:description" content={renderHelmetInfo('description')} />
      </Head>

      <V3BannerComponent />
      {(bannerPublishingData || (Array.isArray(bannerPublishingData) && bannerPublishingData.length)) && (
        <div style={{ marginTop: -20 }} />
      )}
      <Search currentQuery={query} />
      <MarketplaceContainer />
      <MoneySafeModal show={false} onClose={handleClose} />
    </div>
  );
};

Marketplace.renderLayout = renderMainLayout;

export default withInjectAllSaga(Marketplace);
