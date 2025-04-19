/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB, getSeoHelmet } from 'helpers/constraint.helper';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import Search from 'components/Marketplace/Search/Search';
import MoneySafeModal from 'components/Marketplace/MoneySafeModal/MoneySafeModal';
import { MONEY_SAFE_KEY } from 'constants/common';
import ViewSalesContainer from 'components/Marketplace/ViewSales';
import { checkExistLocalStorage, isProduction } from 'helpers/utilities.helper';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const ViewSales: FC & ComponentStatic = () => {
  const { query } = useRouter();
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
        <title>Shop Sale Online - Bicycle Blue Book - BicycleBlueBook.com</title>
        <meta name="og:title" content="Shop Sale Online - Bicycle Blue Book" />
        <meta name="keywords" content="Shop Sale Online - Bicycle Blue Book" />
        <meta name="description" content="Shop bicycles and gear on sale before it's gone" />
        <meta name="og:description" content="Shop bicycles and gear on sale before it's gone" />
        <meta name="author" content="" />
        <meta name="og:image" content={DEFAULT_SEO_IMAGE_BBB} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:url" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:title" content="Shop Sale Online - Bicycle Blue Book - BicycleBlueBook.com" />
        <meta property="twitter:description" content="Shop bicycles and gear on sale before it's gone" />

        <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
      </Head>
      <ViewSalesContainer />
      <MoneySafeModal show={false} onClose={handleClose} />
    </div>
  );
};
ViewSales.renderLayout = renderMainLayout;

export default withInjectAllSaga(ViewSales);
