import React, { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'reactstrap/lib/Container';
import Head from 'next/head';
import { stringify } from 'querystring';
import cloneDeep from 'lodash/cloneDeep';
import lowerCase from 'lodash/lowerCase';
import omit from 'lodash/omit';
import t from 'helpers/language';
import classes from 'components/Marketplace/Detail/marketplace-detail.module.scss';
import { addTag } from 'helpers/common.helper';
import marketplaceActions from 'store/marketplace/marketplace.action';
import BBBDirectInfo from 'components/Marketplace/Detail/BBBDirectInfo/BBBDirectInfo';
import TitleSection from 'components/Marketplace/Detail/TitleSection/TitleSection';
import ProductBuyZone from 'components/Marketplace/Detail/ProductBuyZone/ProductBuyZone';
import ProductInfoZone from 'components/Marketplace/Detail/ProductInfoZone/ProductInfoZone';
import { getIdFromSlugified, slugifyId } from 'helpers/string.helper';
import StoreState from 'model/store';
import { StatusMarketListing } from 'constants/marketplace';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { ComponentStatic } from 'model/common';
import { BBBDirectId, isProduction } from 'helpers/utilities.helper';
import CONFIG from 'config';

interface CProps {}

const BuyNowDetailContainer: React.FC<CProps> & ComponentStatic = () => {
  const router = useRouter();
  const { query, replace, pathname } = router;
  const dispatch = useDispatch();
  const product = useSelector((state: StoreState) => state.marketplace.detail);
  const isOnlineStore = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const usersInfo = useSelector((store: StoreState) => store.authenticate?.user);

  const isShowBBBDirect = useMemo(() => {
    // eslint-disable-next-line no-nested-ternary
    const BBBId: string = BBBDirectId;

    if (product?.sellerIsBBB && product?.storefrontId === BBBId) {
      return true;
    }
    return false;
  }, [product]);

  const isSeller = useMemo(() => {
    return product?.sellerId === usersInfo?._id;
  }, [product, usersInfo]);

  const checkNoIndexHelmet = useMemo(() => {
    return (
      product?.status === 'EXPIRED' || product?.status === 'SOLD' || product?.delete || product?.status === 'DE_LISTED'
    );
  }, [product]);

  const checkProductSold = useMemo(() => {
    if (isOnlineStore) {
      return false;
    }
    return product?.status === 'SOLD' && !isSeller;
  }, [isOnlineStore, isSeller, product]);

  useEffect(() => {
    const isQueryHasSlugify = String(query.id).split('-').length > 1;
    if (!isQueryHasSlugify && product.title) {
      replace(
        '/marketplace/buy-now/[id]',
        `/marketplace/buy-now/${slugifyId(product.title, product.masterListingId)}`,
        { shallow: true },
      );
    }
  }, [query.id, product.title, product.masterListingId, replace]);

  useEffect(() => {
    addTag({
      event: 'productDetail',
      ecommerce: {
        detail: {
          products: [{ id: getIdFromSlugified(pathname) }],
        },
      },
    });
  }, [pathname]);

  useUpdateEffect(() => {
    if (!query.cart) {
      dispatch(marketplaceActions.getDetailProduct(getIdFromSlugified(String(query.id)), { silentLoad: true }));
    }
  }, [dispatch, query.cart, query.id]);

  const redirectToSearch = useCallback(() => {
    replace({
      pathname: '/marketplace/buy-now',
      search: stringify({
        content: `${product.bicycleYearName || ''} ${product.bicycleBrandName || ''} ${
          product.bicycleModelName || (product.bicycleName ? product.bicycleName : product.title) || ''
        }`,
      }),
    });
  }, [
    product.bicycleBrandName,
    product.bicycleModelName,
    product.bicycleName,
    product.bicycleYearName,
    product.title,
    replace,
  ]);

  const structuredData = useMemo(() => {
    let cloneProduct: any = cloneDeep(product);
    cloneProduct = {
      '@id': String(cloneProduct?.masterListingId),
      name: cloneProduct.bicycleName || cloneProduct.title || 'BicycleBlueBook',
      title: cloneProduct.title || 'BicycleBlueBook',
      description: cloneProduct?.inventoryDescription,
      image: cloneProduct?.imageDefault,
      url: `${CONFIG.WEB_URL}marketplace/buy-now/${slugifyId(cloneProduct?.title, cloneProduct?.masterListingId)}`,
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          name: 'BicycleBlueBook.com',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '1',
      },
      offers: {
        '@type': 'AggregateOffer',
        offerCount: '0',
        lowPrice: `${cloneProduct?.minimumOfferAutoAcceptPrice}`,
        highPrice: `${cloneProduct?.bestOfferAutoAcceptPrice}`,
        priceCurrency: 'USD',
      },
      ...cloneProduct,
    };
    return {
      '@context': 'http://schema.org',
      '@type': 'Product',
      ...omit(cloneProduct, ['error', 'loading', 'bicycleImages', 'components']),
    };
  }, [product]);

  const statusDescription = product.status === StatusMarketListing.LISTED ? 'for sale' : lowerCase(product.status);
  const description = `Looking for a ${statusDescription}? Look no further, the BicycleBlueBook.com Marketplace has a used ${product.bicycleYearName} one available for purchase.`;
  return (
    <div className="wrapper-with-header overflow-hidden">
      {!product.loading && (
        <Head>
          <title>{`${product?.title}`.slice(0, 38)} - BicycleBlueBook.com</title>
          <meta name="keywords" content={`${product?.title} + ' ' + ${statusDescription}`} />
          <meta
            name="description"
            content={`Looking for a ${statusDescription}? Look no further, the BicycleBlueBook.com Marketplace has a used 2017 one available for purchase.`}
          />
          <meta name="author" content="" />
          <meta name="og:title" content={product.title || 'BicycleBlueBook'} />
          <meta name="og:description" content={description} />
          <meta name="og:image" content={product.imageDefault} />
          <meta name="og:image:secure_url" content={product.imageDefault} />
          <meta name="og:image:type" content="image/jpeg" />
          <meta name="og:image:width" content="1200" />
          <meta name="og:image:height" content="630" />
          {checkNoIndexHelmet || !isProduction() ? (
            <meta name="robots" content="noindex, nofollow" />
          ) : (
            <meta name="robots" content="index, follow" />
          )}
          {isProduction() && product ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          ) : null}

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@handle" />
          <meta property="twitter:image" content={product.imageDefault} />
          <meta property="twitter:url" content={product.imageDefault} />
          <meta property="twitter:title" content={product.title || 'BicycleBlueBook'} />
          <meta property="twitter:description" content={description} />
        </Head>
      )}
      {product.error ? (
        <Container className={classes.noBike}>{t('marketplace.noBike')}</Container>
      ) : (
        <>
          <Container>
            <TitleSection />
            <ProductBuyZone />
            {isShowBBBDirect && <BBBDirectInfo />}
            <ProductInfoZone />
          </Container>
        </>
      )}
    </div>
  );
};

export default BuyNowDetailContainer;
