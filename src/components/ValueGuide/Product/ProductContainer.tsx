import React, { useEffect, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import { getRating, getRecommended } from 'store/value-guide/value-guide.action';
import { RatingSortType } from 'constants/valueGuide';
import t from 'helpers/language';
import cx from 'classnames';
import classes from './product.module.scss';
import ProductDetail from './ProductSection/ProductDetail';
import ProductRecommended from './RecommendSection/ProductRecommend';
import InfoSection from './ProductSection/InfoSection/InfoSection';
import ServiceSection from './ServiceSection/ServiceSection';

const ProductContainer = () => {
  const error = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.error);
  const selectedProductId = useSelector((store: StoreState) => store.valueGuide.model.list.selectedProductId);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const [showErrorDelayed, setShowErrorDelayed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedProductId && selectedProductId !== '') {
      dispatch(
        getRecommended({
          bicycleId: selectedProductId,
        }),
      );
      return;
    }
    if (Number(query?.brandName) > 0) {
      dispatch(
        getRecommended({
          bicycleId: query?.brandName,
        }),
      );
    }
    dispatch(
      getRecommended({
        bicycleName: query?.brandName,
      }),
    );
  }, [dispatch, query, selectedProductId]);

  useEffect(() => {
    setTimeout(() => {
      setShowErrorDelayed(true);
    }, 3000);
  }, []);

  useEffect(() => {
    dispatch(
      getRating({
        bicycleId: selectedProductId || query?.brandName,
        page: query.page || 1,
        sortBy: query.sortBy || RatingSortType.DESC,
      }),
    );
  }, [dispatch, query, selectedProductId]);

  if (error) {
    return (
      <Container className={cx(classes.noBike, !showErrorDelayed && classes.noBikeNoOpacity)}>
        {t('valueGuide.noBike')}
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <ProductDetail />
      <InfoSection />
      <ServiceSection />
      <ProductRecommended />
    </Container>
  );
};

export default ProductContainer;
