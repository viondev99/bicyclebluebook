import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import cx from 'classnames';
import SafeImage from 'components/Image/SafeImage';
import sortBy from 'lodash/sortBy';
import { Condition } from 'model/common';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getBicyclesBrandYearModel } from 'api/value-guide.api';
import { toastError } from 'helpers/utils.helper';
import { saveSelectedProductId } from 'store/value-guide/value-guide.action';
import ModalShareSocial from '@ui/Modal/ShareSocialModal';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import images from '@images';
import ReviewModal from '../ReviewModal/ReviewModal';
import PriceSection from './PriceSection/PriceSection';
import classes from './product.module.scss';
import Rating from './Rating/Rating';

const PopupNotEligibleModel = React.lazy(() => import('../PopupNotEligibleModel/PopupNotEligibleModel'));

const ProductDetail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const product = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.bicycle);
  const loading = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.loading);
  const rating = useSelector((state: StoreState) => state.valueGuide.rating.rating.avgRating);
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [shareSocialModalVisible, setShareSocialModalVisible] = useState<boolean>(false);
  const [popupSuccessVisible, setPopupSuccessVisible] = useState<boolean>(false);
  const [popupNotEligible, setPopupEligible] = useState<string>('');

  const currentCondition = useMemo(() => {
    if (query?.condition) {
      return product?.conditions?.filter((item) => item?.condition === query?.condition)[0];
    }
    return product?.conditions?.filter((item) => item?.condition === 'GOOD')[0];
  }, [product, query]);

  const years = useMemo(() => {
    if (!product?.additionalYears) {
      return null;
    }
    const yearArr = product?.additionalYears?.map((year) => ({
      yearId: year.yearId,
      yearName: year.yearName,
      bicycleId: year.bicycleId,
    }));
    yearArr.push({
      yearId: product.yearId,
      yearName: product.yearName,
      bicycleId: product.id,
    });
    return sortBy(yearArr, ['yearName']);
  }, [product]);

  useEffect(() => {
    let closeTimeout: NodeJS.Timeout = null;
    if (popupSuccessVisible) {
      closeTimeout = setTimeout(() => {
        setPopupSuccessVisible(false);
      }, 2500);
    }
    return () => {
      clearTimeout(closeTimeout);
    };
  }, [popupSuccessVisible]);

  const gotoNewYear = useCallback(
    async (yearId: number) => {
      try {
        const newQuery = {
          condition: router.query.condition || Condition.Good,
        };
        const getListDetailBike = await getBicyclesBrandYearModel({
          brandId: product?.brandId,
          modelId: product?.modelId,
          yearId,
        });
        if (getListDetailBike?.data?.length > 0) {
          const bikeInfo = getListDetailBike.data[0];
          dispatch(saveSelectedProductId(null));
          router.push({
            pathname: `/value-guide/${encodeURIComponent(bikeInfo?.name)}`,
            query: newQuery,
          });
        }
      } catch (error) {
        toastError(error);
      }
    },
    [dispatch, product, router],
  );
  const handleCloseWhenClickOut = useCallback(() => {
    setPopupSuccessVisible(false);
  }, []);
  const handleCloseModalShare = useCallback((isCopyMobile?: boolean) => {
    setShareSocialModalVisible(false);
    if (isCopyMobile) {
      setPopupSuccessVisible(true);
    }
  }, []);

  const renderLoading = useMemo(() => {
    return (
      <>
        <Row>
          <Col md={8} lg={9}>
            <Skeleton />
            <Skeleton />
          </Col>

          <Col md={4} lg={3} className={cx(classes.rating)}>
            <Skeleton />
            <Skeleton />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={6}>
            <Card className={classes.image}>
              <Skeleton height={250} />
            </Card>
          </Col>

          <Col md={6} className="mt-4 mt-md-0">
            <Card className={classes.image}>
              <Skeleton height={250} />
            </Card>
          </Col>
        </Row>
      </>
    );
  }, []);

  const renderBadgetByType = useMemo(() => {
    if (product?.typeName === 'Kids' || product?.typeName === 'E-Bike' || currentCondition?.tradeInValueMin < 400) {
      return (
        <div className={classes.customBadget}>
          <div className={classes.textBadget}>
            Not eligible for trade in.
            <div>
              <span className={classes.textPopup} onClick={() => setPopupEligible(product?.typeName)}>
                Learn more
              </span>
              <span className={classes.customDot}>.</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, [currentCondition, product]);

  const renderProductDetail = useMemo(() => {
    return (
      <>
        <Row>
          <Col md={8} lg={9}>
            <h2>{product?.name || ''}</h2>
            {Array.isArray(years) &&
              years.map((year) => {
                return (
                  <a key={year.yearId} onClick={() => gotoNewYear(year.yearId)}>
                    <Button
                      buttonType={product.yearId === year.yearId ? 'primary' : 'outline'}
                      buttonSize="s"
                      className={cx('mr-2 mt-4', classes.year)}>
                      {year.yearName}
                    </Button>
                  </a>
                );
              })}
          </Col>

          <Col md={4} lg={3} className={cx(classes.rating)}>
            <Rating initialRating={rating} readonly={true} />
            <Button
              buttonType="transparent"
              className={classes.navigator}
              onClick={() => {
                setReviewModalVisible(true);
              }}>
              View All Reviews
            </Button>
            <Button
              buttonType="transparent"
              className={classes.navigator}
              onClick={() => setShareSocialModalVisible(true)}>
              <img src={images.marketplace.iconShare} alt="Share Icon" />
              <span className={cx(classes.hideWhenMobile, 'ml-3')}>Share</span>
            </Button>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={7} md={6}>
            <Card className={classes.image}>
              {renderBadgetByType}
              <SafeImage src={product?.imageDefault} imgSize="l" />
            </Card>
          </Col>

          <Col lg={5} md={6} className="mt-4 mt-md-0">
            <PriceSection bicycle={product} />
          </Col>
        </Row>
      </>
    );
  }, [gotoNewYear, product, rating, years, renderBadgetByType]);

  return (
    <>
      {loading ? renderLoading : renderProductDetail}

      {reviewModalVisible && <ReviewModal isOpen={reviewModalVisible} onClose={() => setReviewModalVisible(false)} />}
      {shareSocialModalVisible && <ModalShareSocial open={shareSocialModalVisible} onClose={handleCloseModalShare} />}
      {popupSuccessVisible && (
        <InvisibleBackdrop onClick={handleCloseWhenClickOut}>
          <div className={classes.saveLinkSuccess}>
            <img src={images.tradeIn.icCircleTickBlue} alt="icon tick" className={classes.iconTick} />{' '}
            <span>URL copied to clipboard</span>
          </div>
        </InvisibleBackdrop>
      )}

      {popupNotEligible !== '' && (
        <Suspense fallback={null}>
          <PopupNotEligibleModel
            isOpen={popupNotEligible !== ''}
            onClose={() => setPopupEligible('')}
            typeBike={popupNotEligible}
            fairCondition={currentCondition?.tradeInValueMin}
          />
        </Suspense>
      )}
    </>
  );
};

export default ProductDetail;
