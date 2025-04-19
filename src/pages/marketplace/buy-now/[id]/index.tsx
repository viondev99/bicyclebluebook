import BuyNowContainer from 'components/Marketplace/BuyNowContainer';
import BuyNowDetailContainer from 'components/Marketplace/BuyNowDetailContainer';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import marketplaceActions from 'store/marketplace/marketplace.action';
import { getIdFromSlugified } from 'helpers/string.helper';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { stopAndAwaitSagaTask } from 'store';
import cookies from 'next-cookies';
import { NextPageContext } from 'next';
import { V3_TOKEN_KEY } from 'constants/common';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import { triggerGA4ECommerceEvent, ViewItemGA, convertProductToItemGa } from 'helpers/ga4.helper';

interface CProps {}

const DetailProduct: React.FC<CProps> & ComponentStatic = () => {
  const router = useRouter();
  const { query } = router;
  const bicycleDetail = useSelector((state: StoreState) => state.marketplace.detail);

  const isHotBike = useMemo(() => {
    return (
      query?.id === 'road-bikes' ||
      query?.id === 'mountain-bikes' ||
      query?.id === 'hybrid-bikes' ||
      query?.id === 'kids-bikes' ||
      query?.id === 'e-bikes'
    );
  }, [query]);

  useEffect(() => {
    if (bicycleDetail?.marketListingId) {
      triggerGA4ECommerceEvent('view_item', {
        currency: 'USD',
        value: bicycleDetail.discountedPrice,
        items: [convertProductToItemGa({ prd: bicycleDetail, index: 0 })],
      } as ViewItemGA);
    }
  }, [bicycleDetail]);

  return <>{isHotBike ? <BuyNowContainer /> : <BuyNowDetailContainer />}</>;
};

DetailProduct.getInitialProps = async (ctx: NextPageContext) => {
  const { query, store, res, isServer } = ctx;
  // const task = (store as any).injectSaga(SAGA_KEY.Marketplace, marketplaceSaga);
  // (store as any).sagaAllTask.push(task);
  const tokenFromReq = cookies(ctx)[V3_TOKEN_KEY];
  if (
    query?.id !== 'road-bikes' &&
    query?.id !== 'mountain-bikes' &&
    query?.id !== 'hybrid-bikes' &&
    query?.id !== 'kids-bikes' &&
    query?.id !== 'e-bikes'
  ) {
    store.dispatch(
      marketplaceActions.getDetailProduct(getIdFromSlugified(String(query.id)), {
        silentLoad: false,
        isServer,
        tokenFromReq,
      }),
    );
    if (isServer) {
      await stopAndAwaitSagaTask(store);
      if (store.getState().marketplace.detail.error) {
        res.statusCode = 404;
      }
    }
  }

  return {};
};

DetailProduct.renderLayout = renderMainLayout;

export default DetailProduct;
