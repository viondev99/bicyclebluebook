/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { getBicycleNameByIdRequest } from 'api/value-guide.api';
import SearchByBrandAndFamilyContainer from 'components/ValueGuide/Search/SearchByBrandAndFamilyContainer';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB, getSeoHelmet } from 'helpers/constraint.helper';
import { getSeoMKP } from 'helpers/constraintSeoMKP';
import { universalRedirect } from 'helpers/ssr.helper';
import { isProduction } from 'helpers/utilities.helper';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import _get from 'lodash/get';
import { ComponentStatic } from 'model/common';
import StoreState from 'model/store';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stopAndAwaitSagaTask } from 'store';
import { getBrandYearModelV2, getLogoBrandValueGuide } from 'store/value-guide/value-guide.action';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const FamilyName: React.FC & ComponentStatic = () => {
  const router = useRouter();
  const { query, asPath } = router;
  const dispatch = useDispatch();
  const detailBrand = useSelector((store: StoreState) => store.valueGuide.brand.detail.brand);
  const detailModel = useSelector((store: StoreState) => store.valueGuide.model.detail.model);
  const brandId = useSelector((store: StoreState) => store.valueGuide.model.list.brandIdSearchValueGuide);

  const content = _get(router, 'query.content', '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getLogoBrandValueGuide(brandId || query?.brandName));
  }, [brandId, dispatch, query]);

  const renderMeta = useMemo(() => {
    if (asPath === '/value-guide/Gary%20Fisher/') {
      return getSeoMKP().GARY_FISHER_BIKES_FOR_SALE;
    }
    return null;
  }, [asPath]);

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
          <meta name="og:image" content={DEFAULT_SEO_IMAGE_BBB} />
          <meta name="og:image:type" content="image/*" />
          <meta name="og:image:width" content="1200" />
          <meta name="og:image:height" content="630" />
          {renderMeta && <meta name="description" content={renderMeta.meta} />}
          {renderMeta && <meta name="keywords:focus" content={renderMeta.keywordsFocus} />}
          {renderMeta && <meta name="keywords:secondary" content={renderMeta.secondaryKeywords} />}
          {renderMeta && <meta name="keywords:semantic" content={renderMeta.semanticKeywords} />}

          <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
          {isProduction() && <meta id="MetaKeywords" name="KEYWORDS" content="bicycle values" />}

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@handle" />
          <meta property="twitter:image" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
          <meta property="twitter:url" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
          <meta property="twitter:title" content={renderHelmetInfo('title')} />
          <meta property="twitter:description" content={renderHelmetInfo('description')} />
        </Head>
      );
    }
    return (
      <Head>
        <title>{renderMeta?.titlePage || 'Value Guide - BicycleBlueBook.com'}</title>
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
      <SearchByBrandAndFamilyContainer />
    </>
  );
};

FamilyName.renderLayout = renderMainLayout;

FamilyName.getInitialProps = async (ctx: NextPageContext) => {
  const { familyName, brandName } = ctx?.query;
  if (brandName === 'product') {
    if (Number(familyName) > 0) {
      try {
        const response: { data: string } = await getBicycleNameByIdRequest(Number(familyName));
        return universalRedirect(ctx)(`/value-guide/${response?.data}`);
      } catch (error) {
        return universalRedirect(ctx)(`/value-guide`);
      }
    }
    return universalRedirect(ctx)(`/value-guide`);
  }
  const { brandIdSearchValueGuide } = ctx.store.getState().valueGuide.model.list;

  if (brandIdSearchValueGuide && brandIdSearchValueGuide !== '') {
    ctx.store.dispatch(
      getBrandYearModelV2({
        brandId: brandIdSearchValueGuide,
        familyName,
        isVGService: true,
      }),
    );
  } else if (brandName && brandName !== '') {
    ctx.store.dispatch(
      getBrandYearModelV2({
        brandName,
        familyName,
        isVGService: true,
      }),
    );
  }

  if (ctx.isServer) {
    await stopAndAwaitSagaTask(ctx.store);
  }
  return {};
};

export default withInjectAllSaga(FamilyName);
