/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
import ClientSide from '@ui/Common/ClientSide';
import SearchFamilyContainer from 'components/ValueGuide/Search/SearchFamilyContainer';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB, getSeoHelmet } from 'helpers/constraint.helper';
import { getSeoMKP } from 'helpers/constraintSeoMKP';
import { isProduction } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Bling as GPT } from 'react-gpt';
import { useDispatch, useSelector } from 'react-redux';
import { getLogoBrandValueGuide } from 'store/value-guide/value-guide.action';
import classes from './brand-container.module.scss';

const BrandContainer = () => {
  const router = useRouter();
  const { query, asPath } = router;
  const dispatch = useDispatch();
  // const brand = useSelector((state: StoreState) => state.valueGuide.brand.detail.brand);
  const brandId = useSelector((store: StoreState) => store.valueGuide.model.list.brandIdSearchValueGuide);

  useEffect(() => {
    dispatch(getLogoBrandValueGuide(brandId || query?.brandName));
  }, [brandId, dispatch, query]);

  const brandName = useMemo(() => {
    return `${query?.brandName}` || '';
  }, [query]);

  const renderMeta = useMemo(() => {
    if (asPath === '/value-guide/Gary%20Fisher/') {
      return getSeoMKP().GARY_FISHER_BIKES_FOR_SALE;
    }
    return null;
  }, [asPath]);

  const renderHelmetInfo = useCallback(
    (key: string) => {
      switch (key) {
        case 'title':
          if (brandName === 'Trek') {
            return getSeoHelmet().VALUE_GUIDE.Trek.title;
          }
          if (brandName === 'Gary Fisher') {
            return getSeoHelmet().VALUE_GUIDE.Gary_Fisher.title;
          }
          if (brandName === 'Schwinn') {
            return getSeoHelmet().VALUE_GUIDE.Schwinn.title;
          }
          if (brandName === 'Raleigh') {
            return getSeoHelmet().VALUE_GUIDE.Raleigh.title;
          }
          if (brandName === 'Diamondback') {
            return getSeoHelmet().VALUE_GUIDE.Diamondback.title;
          }
          if (brandName === 'Fuji') {
            return getSeoHelmet().VALUE_GUIDE.Fuji.title;
          }
          if (brandName === 'GT') {
            return getSeoHelmet().VALUE_GUIDE.GT.title;
          }
          if (brandName === 'Norco') {
            return getSeoHelmet().VALUE_GUIDE.Norco.title;
          }
          if (brandName === 'Giant') {
            return getSeoHelmet().VALUE_GUIDE.Giant.title;
          }
          if (brandName === 'Kona') {
            return getSeoHelmet().VALUE_GUIDE.Kona.title;
          }
          return getSeoHelmet(String(query?.brandName)).VALUE_GUIDE.default.title;

        case 'description':
          if (brandName === 'Trek') {
            return getSeoHelmet().VALUE_GUIDE.Trek.description;
          }
          if (brandName === 'Gary Fisher') {
            return getSeoHelmet().VALUE_GUIDE.Gary_Fisher.description;
          }
          if (brandName === 'Schwinn') {
            return getSeoHelmet().VALUE_GUIDE.Schwinn.description;
          }
          if (brandName === 'Raleigh') {
            return getSeoHelmet().VALUE_GUIDE.Raleigh.description;
          }
          if (brandName === 'Diamondback') {
            return getSeoHelmet().VALUE_GUIDE.Diamondback.description;
          }
          if (brandName === 'Fuji') {
            return getSeoHelmet().VALUE_GUIDE.Fuji.description;
          }
          if (brandName === 'GT') {
            return getSeoHelmet().VALUE_GUIDE.GT.description;
          }
          if (brandName === 'Norco') {
            return getSeoHelmet().VALUE_GUIDE.Norco.description;
          }
          if (brandName === 'Giant') {
            return getSeoHelmet().VALUE_GUIDE.Giant.description;
          }
          if (brandName === 'Kona') {
            return getSeoHelmet().VALUE_GUIDE.Kona.description;
          }
          return getSeoHelmet().VALUE_GUIDE.default.description;

        case 'keywords':
          if (brandName === 'Trek') {
            return getSeoHelmet().VALUE_GUIDE.Trek.keyword;
          }
          if (brandName === 'Gary Fisher') {
            return getSeoHelmet().VALUE_GUIDE.Gary_Fisher.keyword;
          }
          if (brandName === 'Schwinn') {
            return getSeoHelmet().VALUE_GUIDE.Schwinn.keyword;
          }
          if (brandName === 'Raleigh') {
            return getSeoHelmet().VALUE_GUIDE.Raleigh.keyword;
          }
          if (brandName === 'Diamondback') {
            return getSeoHelmet().VALUE_GUIDE.Diamondback.keyword;
          }
          if (brandName === 'Fuji') {
            return getSeoHelmet().VALUE_GUIDE.Fuji.keyword;
          }
          if (brandName === 'GT') {
            return getSeoHelmet().VALUE_GUIDE.GT.keyword;
          }
          if (brandName === 'Norco') {
            return getSeoHelmet().VALUE_GUIDE.Norco.keyword;
          }
          if (brandName === 'Giant') {
            return getSeoHelmet().VALUE_GUIDE.Giant.keyword;
          }
          if (brandName === 'Kona') {
            return getSeoHelmet().VALUE_GUIDE.Kona.keyword;
          }
          return getSeoHelmet().VALUE_GUIDE.default.keyword;

        case 'h':
          if (brandName === 'Trek') {
            return getSeoHelmet().VALUE_GUIDE.Trek.h;
          }
          if (brandName === 'Gary Fisher') {
            return getSeoHelmet().VALUE_GUIDE.Gary_Fisher.h;
          }
          if (brandName === 'Schwinn') {
            return getSeoHelmet().VALUE_GUIDE.Schwinn.h;
          }
          if (brandName === 'Raleigh') {
            return getSeoHelmet().VALUE_GUIDE.Raleigh.h;
          }
          if (brandName === 'Diamondback') {
            return getSeoHelmet().VALUE_GUIDE.Diamondback.h;
          }
          if (brandName === 'Fuji') {
            return getSeoHelmet().VALUE_GUIDE.Fuji.h;
          }
          if (brandName === 'GT') {
            return getSeoHelmet().VALUE_GUIDE.GT.h;
          }
          if (brandName === 'Norco') {
            return getSeoHelmet().VALUE_GUIDE.Norco.h;
          }
          if (brandName === 'Giant') {
            return getSeoHelmet().VALUE_GUIDE.Giant.h;
          }
          if (brandName === 'Kona') {
            return getSeoHelmet().VALUE_GUIDE.Kona.h;
          }
          return null;

        default:
          break;
      }
    },
    [brandName, query],
  );

  return (
    <>
      {!!brandName && (
        <Head>
          <title>{renderMeta?.titlePage || renderHelmetInfo('title')}</title>
          <meta name="description" content={renderHelmetInfo('description')} />
          <meta name="author" />
          <meta id="MetaKeywords" name="keywords" content={renderHelmetInfo('keyword')} />
          <meta name="og:title" content={renderHelmetInfo('title')} />
          <meta name="og:description" content={renderHelmetInfo('description')} />
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
      )}
      <ClientSide>
        <div className={'bbb-ads'} style={{ marginTop: 84, marginBottom: -84 }}>
          <GPT
            adUnitPath="/172907264/brand_name_header"
            // adUnitPath="/4595/nfl.test.open"
            slotSize="fluid"
            sizeMapping={[
              {
                viewport: [990, 0],
                slot: [
                  [970, 90],
                  [970, 250],
                  [728, 90],
                ],
              },
              { viewport: [776, 0], slot: [728, 90] },
              { viewport: [0, 0], slot: [320, 50] },
            ]}
          />
        </div>
      </ClientSide>
      <SearchFamilyContainer />
      <ClientSide>
        <div className={'bbb-ads'}>
          <GPT
            adUnitPath="/172907264/brand_name_footer"
            // adUnitPath="/4595/nfl.test.open"
            slotSize="fluid"
            sizeMapping={[
              {
                viewport: [990, 0],
                slot: [
                  [970, 90],
                  [728, 90],
                ],
              },
              { viewport: [776, 0], slot: [728, 90] },
              {
                viewport: [0, 0],
                slot: [
                  [300, 600],
                  [300, 250],
                ],
              },
            ]}
          />
        </div>
      </ClientSide>
      <h1 className={classes.customSeoH1}>{renderHelmetInfo('h')}</h1>
    </>
  );
};

export default BrandContainer;
