import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Bling as GPT } from 'react-gpt';
import { useDispatch, useSelector } from 'react-redux';
import Products from 'components/ValueGuide/Product/ProductContainer';
import StoreState from 'model/store';
import ClientSide from '@ui/Common/ClientSide';
import { useRouter } from 'next/router';
import { getDetailBicycle } from 'store/value-guide/value-guide.action';
import { isProduction } from 'helpers/utilities.helper';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import CONFIG from 'config';
import { formatNumberDecimal } from 'helpers/string.helper';

const ProductContainer = () => {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const product = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.bicycle);
  const bicycleId = useSelector((state: StoreState) => state.valueGuide.model.list.selectedProductId);
  const rating = useSelector((state: StoreState) => state.valueGuide.rating.rating);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);

  useEffect(() => {
    if (!bicycleId) {
      const params = {
        idOrName: query?.brandName,
        isVGService: true,
      };
      dispatch(getDetailBicycle(params));
    }
  }, [dispatch, query]);

  const renderAggregateRatingValue = useMemo(() => {
    if (!rating) {
      return 0;
    }
    return formatNumberDecimal(
      (rating?.rateValueDetail?.fiveStars +
        rating?.rateValueDetail?.fourStars +
        rating?.rateValueDetail?.threeStars +
        rating?.rateValueDetail?.twoStars +
        rating?.rateValueDetail?.oneStar) /
        rating?.totalRating,
    );
  }, [rating]);

  const renderReviewRatingValue = useMemo(() => {
    if (!rating || !userInfo) {
      return 0;
    }
    const findMySelfRated = rating?.ratingResponse?.data?.length
      ? rating?.ratingResponse?.data?.find((it: any) => it.userId === userInfo?._id || it.userId === userInfo?.account)
      : null;

    if (findMySelfRated) {
      return findMySelfRated?.rate;
    }
    return 0;
  }, [rating, userInfo]);

  const structuredData = useMemo(() => {
    let cloneProduct: any = cloneDeep(product);
    cloneProduct = {
      '@id': String(cloneProduct?.id),
      name: cloneProduct?.name || 'BicycleBlueBook',
      title: cloneProduct?.name || 'BicycleBlueBook',
      description: cloneProduct?.description,
      image: cloneProduct?.imageDefault,
      url: `${CONFIG.WEB_URL}value-guide/${encodeURIComponent(cloneProduct?.name)}?condition=${query?.condition || ''}`,
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: renderReviewRatingValue || 5,
          bestRating: '5',
        },
        author: userInfo
          ? {
              '@type': 'Person',
              name: userInfo?.display_name || 'BicycleBlueBook',
            }
          : {
              '@type': 'Person',
              name: 'BicycleBlueBook',
            },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: renderAggregateRatingValue || 5,
        reviewCount: `${rating?.totalRating || 1}`,
      },
      offers: {
        '@type': 'AggregateOffer',
        offerCount: '0',
        lowPrice: `0`,
        highPrice: `0`,
        priceCurrency: 'USD',
      },
      ...cloneProduct,
    };
    return {
      '@context': 'http://schema.org',
      '@type': 'Product',
      ...omit(cloneProduct, ['error', 'loading', 'bicycleImages', 'components']),
    };
  }, [product, query, rating, renderAggregateRatingValue, renderReviewRatingValue, userInfo]);

  return (
    <>
      {!!product && (
        <Head>
          <title>{`${product.name}`.slice(0, 20)} - Bicycle Details - BicycleBlueBook.com</title>
          <meta
            name="description"
            content={`Find out how much a ${product.name} bicycle is worth. Our Value Guide is constantly growing with pricing information and bicycle specs daily.`}
          />
          <meta
            property="og:description"
            content={`Find the value of a ${product.name} new or used bicycle in the BicycleBlueBook.com value guide.`}
          />
          <meta name="author" />
          <meta id="MetaKeywords" name="KEYWORDS" content={product.name} />
          <meta name="og:image" content={product?.imageDefault || ''} />
          <meta name="og:image:type" content="image/*" />
          <meta name="og:image:width" content="1200" />
          <meta name="og:image:height" content="630" />

          <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
          {isProduction() && <meta id="MetaKeywords" name="KEYWORDS" content="bicycle values" />}
          {isProduction() && product ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          ) : null}

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@handle" />
          <meta property="twitter:image" content={product?.imageDefault || ''} />
          <meta property="twitter:url" content={product?.imageDefault || ''} />
          <meta
            property="twitter:title"
            content={`${`${product.name}`.slice(0, 20)} - Bicycle Details - BicycleBlueBook.com`}
          />
          <meta
            property="twitter:description"
            content={`Find out how much a ${product.name} bicycle is worth. Our Value Guide is constantly growing with pricing information and bicycle specs daily.`}
          />
        </Head>
      )}
      <div className={'bbb-ads'} style={{ marginTop: 84, marginBottom: -84 }}>
        <ClientSide>
          <GPT
            adUnitPath="/172907264/value_guide_product_header"
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
        </ClientSide>
      </div>
      <Products />
      <ClientSide>
        <div className={'bbb-ads'}>
          <GPT
            adUnitPath="/172907264/value_guide_product_footer"
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
    </>
  );
};

export default ProductContainer;
