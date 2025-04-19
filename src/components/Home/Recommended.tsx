import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import { useDispatch, useSelector } from 'react-redux';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';

import Product, { ProductSkeleton } from '@ui/Product/Product';
import StoreState from '../../model/store';
import classes from './home.module.scss';

import icLeftArrow from '../../assets/img/home/ic_left_arrow.svg';
import * as homeActions from '../../store/home/home.action';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  passiveListeners: true,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  // init: false,
  breakpoints: {
    576: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

const Recommended: FC = () => {
  const recommended = useSelector((state: StoreState) => state.home.recommended);
  const { currentWidthScreen } = useScreenDetect();
  const loading = useSelector((state: StoreState) => state.home.loadingRecommended);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const swiper: any = useRef<SwiperInstance>(null);

  const dispatch = useDispatch();
  const token = useSelector((store: StoreState) => store.authenticate.token);

  useEffect(() => {
    const payload = {
      isGuest: !token,
    };
    dispatch(homeActions.getRecommended(payload));
  }, [token, dispatch]);

  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper.current?.slidePrev();
    }
  }, []);

  useEffect(() => {
    if (swiper?.current && !loading) {
      const handler = () => {
        const totalSlide = recommended.length;
        if (swiper?.current?.activeIndex <= 0) {
          setIsHavePrev(false);
        } else {
          setIsHavePrev(true);
        }
        if (swiper?.current?.activeIndex >= totalSlide - +swiper?.current?.params?.slidesPerView) {
          setIsHaveNext(false);
        } else {
          setIsHaveNext(true);
        }
      };
      if (!swiper?.current?.destroyed) {
        swiper?.current?.on('slideChange', handler);
      }
      return () => swiper?.current?.off('slideChange', handler);
    }
  }, [loading, recommended.length]);

  const showDragBtn = useMemo(() => {
    if (
      (recommended?.length > 4 && currentWidthScreen >= 1200) ||
      (recommended?.length > 3 && currentWidthScreen < 1200 && currentWidthScreen >= 768)
    ) {
      return (
        <span className={classes.dragRecommend} onClick={goPrev}>
          <img
            src={icLeftArrow}
            style={{
              display: 'inline-flex',
              marginRight: 10,
            }}
            alt={'arrow-left'}
            className="icon-button22"
          />
          Drag
        </span>
      );
    }
    return null;
  }, [recommended, currentWidthScreen, goPrev]);

  return (
    <section className={classes.section}>
      <Container>
        <div className={'d-flex justify-content-between align-items-center mb-3'}>
          <h2>Recommended</h2>
          {showDragBtn}
        </div>
        <div className={classes.swiperWrapper}>
          <div className={cx('d-xl-block d-none', classes.swiperSlideHintPrev, { [classes.hide]: !isHavePrev })} />
          <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />
          {loading ? (
            <Swiper {...slideOptions} key={1}>
              <div>
                <ProductSkeleton />
              </div>
              <div>
                <ProductSkeleton />
              </div>
              <div>
                <ProductSkeleton />
              </div>
              <div>
                <ProductSkeleton />
              </div>
            </Swiper>
          ) : (
            <Swiper
              {...slideOptions}
              key={2}
              getSwiper={(c) => {
                swiper.current = c;
              }}>
              {recommended.map((item, index) => (
                <div key={item.masterListingId}>
                  <Product
                    isSaved={item.favourite}
                    id={item.masterListingId}
                    bikeName={item.title}
                    currentListedPrice={item.currentListedPrice}
                    bikePrice={item.currentListedPrice}
                    bikeType={item.bicycleTypeName}
                    image={item.imageDefault}
                    altImage={item.title}
                    bbbDirect={item.sellerIsBBB}
                    assembled={item.isAvailableAssembled}
                    index={index}
                  />
                </div>
              ))}
            </Swiper>
          )}
        </div>
      </Container>
    </section>
  );
};
export default React.memo(Recommended);
