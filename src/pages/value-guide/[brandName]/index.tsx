import BrandContainer from 'components/ValueGuide/BrandContainer';
import ProductContainer from 'components/ValueGuide/ProductContainer';
import { useRouter } from 'next/router';
import { ReduxWrapperAppContext } from 'next-redux-wrapper';
import React, { FC, useMemo } from 'react';
import StoreState from 'model/store';
import { getDetailBicycle, getFamiliesByBrand } from 'store/value-guide/value-guide.action';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';
import { ComponentStatic } from '../../../model/common';

const ValueGuideFamilyPage: FC & ComponentStatic = () => {
  const router = useRouter();
  const { query } = router;

  const isProductRouter = useMemo(() => {
    const first4Characters = query?.brandName?.slice(0, 4);
    return Number(first4Characters) > 0;
  }, [query]);

  return <>{isProductRouter ? <ProductContainer /> : <BrandContainer />}</>;
};

ValueGuideFamilyPage.getInitialProps = async ({
  store,
  query,
  isServer,
  res,
  req,
}: ReduxWrapperAppContext<StoreState>) => {
  const first4Characters = query?.brandName?.slice(0, 4);
  const isProductRouter = Number(first4Characters) > 0;

  console.log('value guide', 'ValueGuideFamilyPage log', query, first4Characters, isProductRouter);
  console.log('value guide', 'query?.brandNamequery?.brandName213123', query?.brandName);

  // brand router
  if (!isProductRouter) {
    const { brandIdSearchValueGuide } = store.getState().valueGuide.model.list;
    const { brandName } = query;
    if (brandIdSearchValueGuide && brandIdSearchValueGuide !== '') {
      store.dispatch(
        getFamiliesByBrand({
          brandId: brandIdSearchValueGuide,
          isVGService: true,
        }),
      );
    } else if (brandName && brandName !== '') {
      store.dispatch(
        getFamiliesByBrand({
          brandName,
          isVGService: true,
        }),
      );
    }
  }
  // product router
  else {
    const bicycleId = store.getState().valueGuide.model.list.selectedProductId;
    const params = {
      idOrName: bicycleId || query?.brandName,
      isVGService: true,
    };
    console.log('missing some info getDetailBicycleParams123', bicycleId, query?.brandName);
    console.log('value guide', 'getDetailBicycleParams', params);
    store.dispatch(getDetailBicycle(params));
  }

  // if (isServer) {
  //   await stopAndAwaitSagaTask(store);
  //   if (store.getState().valueGuide.bicycle.detail.error) {
  //     res.statusCode = 404;
  //   }
  // }
  // return {};
};

ValueGuideFamilyPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(ValueGuideFamilyPage);
