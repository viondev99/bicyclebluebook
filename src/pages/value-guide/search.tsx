/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Head from 'next/head';
import SearchContainer from 'components/ValueGuide/Search/SearchContainer';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _get from 'lodash/get';
import { getSeoHelmet } from 'helpers/constraint.helper';
import StoreState from 'model/store';
import { stopAndAwaitSagaTask } from 'store';
import { ComponentStatic } from 'model/common';
import { getBicyclesByContent } from 'store/value-guide/value-guide.action';
import { getSeoMKP } from 'helpers/constraintSeoMKP';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const SearchPage: React.FC & ComponentStatic = () => {
  const router = useRouter();
  const { asPath } = useRouter();
  const detailBrand = useSelector((store: StoreState) => store.valueGuide.brand.detail.brand);
  const detailModel = useSelector((store: StoreState) => store.valueGuide.model.detail.model);

  const content = _get(router, 'query.content', '');
  const renderMeta = useMemo(() => {
    if (asPath === '/value-guide/Gary%20Fisher/') {
      return getSeoMKP().GARY_FISHER_BIKES_FOR_SALE;
    }
    return null;
  }, [asPath]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   dispatch(getLogoBrandValueGuide(query?.content));
  // }, [dispatch, query]);

  const renderHelmetInfo = (key: string) => {
    if (content.includes('Trek')) {
      return key === 'title'
        ? getSeoHelmet(content).VALUE_GUIDE.Trek.title
        : key === 'description'
        ? getSeoHelmet(content).VALUE_GUIDE.Trek.description
        : getSeoHelmet(content).VALUE_GUIDE.Trek.keyword;
    }
    if (content.includes('Gary Fisher')) {
      return key === 'title'
        ? getSeoHelmet(content).VALUE_GUIDE.Gary_Fisher.title
        : key === 'description'
        ? getSeoHelmet(content).VALUE_GUIDE.Gary_Fisher.description
        : getSeoHelmet(content).VALUE_GUIDE.Gary_Fisher.keyword;
    }
    if (content.includes('Schwinn')) {
      return key === 'title'
        ? getSeoHelmet(content).VALUE_GUIDE.Schwinn.title
        : key === 'description'
        ? getSeoHelmet(content).VALUE_GUIDE.Schwinn.description
        : getSeoHelmet(content).VALUE_GUIDE.Schwinn.keyword;
    }
    return key === 'title'
      ? getSeoHelmet(content).VALUE_GUIDE.default.title
      : key === 'description'
      ? getSeoHelmet(content).VALUE_GUIDE.default.description
      : getSeoHelmet(content).VALUE_GUIDE.default.keyword;
  };

  const renderHead = useCallback(() => {
    if (content) {
      return (
        <Head>
          <title>{renderMeta?.titlePage || renderHelmetInfo('title')}</title>
          <meta name="description" content={renderHelmetInfo('description')} />
          <meta name="author" />
          <meta id="MetaKeywords" name="keywords" content={renderHelmetInfo('keyword')} />
          {renderMeta && <meta name="description" content={renderMeta.meta} />}
          {renderMeta && <meta name="keywords:focus" content={renderMeta.keywordsFocus} />}
          {renderMeta && <meta name="keywords:secondary" content={renderMeta.secondaryKeywords} />}
          {renderMeta && <meta name="keywords:semantic" content={renderMeta.semanticKeywords} />}
        </Head>
      );
    }
    return (
      <Head>
        <title>{renderMeta?.titlePage || 'PageValue Guide - BicycleBlueBook.com'}</title>
        <meta
          name="description"
          content={`Find out how much a ${detailBrand?.name} ${detailModel?.name} bicycle is worth. Our Value Guide is constantly growing with pricing information and bicycle specs daily.`}
        />
        <meta
          property="og:description"
          content="Browse bikes to buy and sell, how to sell your bike, quote value, buy sell trade resell, bike, bmx, cruiser, hybrid, mountain bike, road bike"
        />
        <meta name="author" />
        <meta id="MetaKeywords" name="KEYWORDS" content={`${detailBrand?.name} ${detailModel?.name}`} />
        {renderMeta && <meta name="description" content={renderMeta.meta} />}
        {renderMeta && <meta name="keywords:focus" content={renderMeta.keywordsFocus} />}
        {renderMeta && <meta name="keywords:secondary" content={renderMeta.secondaryKeywords} />}
        {renderMeta && <meta name="keywords:semantic" content={renderMeta.semanticKeywords} />}
      </Head>
    );
  }, [content, detailBrand, detailModel, renderHelmetInfo]);

  return (
    <>
      {renderHead()}
      <SearchContainer />
    </>
  );
};

SearchPage.renderLayout = renderMainLayout;

SearchPage.getInitialProps = async ({ query, store, isServer }) => {
  const { content, yearId } = query;
  if (content || content === '') {
    store.dispatch(getBicyclesByContent({ content, page: query.page || 1, yearId }));
  }
  if (isServer) {
    await stopAndAwaitSagaTask(store);
  }
  return {};
};

export default withInjectAllSaga(SearchPage);
