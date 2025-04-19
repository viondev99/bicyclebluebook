/* eslint-disable no-plusplus */
import React, { FC, useMemo, useEffect, useState, useRef, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { useRouter } from 'next/router';
import useScreenDetect from 'hooks/useScreenDetect';
import cx from 'classnames';
import StoreState from 'model/store';
import Product, { ProductSkeleton } from '@ui/Product/Product';
import { addProductRecentView } from 'store/recent-view/product/product.action';
import { getIdFromSlugified } from 'helpers/string.helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import icLeftArrow from 'assets/img/home/ic_left_arrow.svg';

import classes from './recently-viewed.module.scss';

dayjs.extend(utc);

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
    1200: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

const RecentView: FC = () => {
  const dispatch = useDispatch();
  const {
    query: { id },
  } = useRouter();
  const { productDetailRecentViews } = useSelector((state: StoreState) => state.recentView.product);
  const loading = useSelector((state: StoreState) => state.recentView.product.loading);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const swiper: any = useRef<SwiperInstance>(null);
  const { currentWidthScreen } = useScreenDetect();

  const products = useMemo(() => {
    return productDetailRecentViews?.filter((item) => item.masterListingId !== getIdFromSlugified(String(id)));
  }, [productDetailRecentViews, id]);

  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slidePrev();
    }
  }, []);

  const showDragBtn = useMemo(() => {
    if (
      (products?.length > 4 && currentWidthScreen >= 1200) ||
      (products?.length > 3 && currentWidthScreen < 1200 && currentWidthScreen >= 768)
    ) {
      return (
        <span className={classes.dragRecent} onClick={goPrev}>
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
  }, [products, currentWidthScreen, goPrev]);

  useEffect(() => {
    if (swiper?.current && !loading) {
      const handler = () => {
        const totalSlide = products.length;
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
  }, [loading, products.length]);
  useEffect(() => {
    const masterId = getIdFromSlugified(String(id));
    if (id) {
      const payload = {
        id: masterId,
        marketType: 'BBB',
        timeViewed: dayjs.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      };
      dispatch(addProductRecentView(payload));
    }
  }, [id, dispatch]);

  return (
    products &&
    products.length > 0 && (
      <section className={classes.section}>
        <div className={'d-flex justify-content-between align-items-center mb-3'}>
          <h2>Recently Viewed</h2>
          {showDragBtn}
        </div>
        <div className={classes.swiperWrapper}>
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
              {products.map((item, index) => (
                <div key={item.masterListingId}>
                  <Product
                    isSaved={item.favourite}
                    id={item.masterListingId}
                    bikeName={item.inventoryName}
                    bikePrice={item.currentListedPrice}
                    currentListedPrice={item.currentListedPrice}
                    bikeType={item.bicycleTypeName}
                    bbbDirect={item.sellerIsBBB}
                    image={item.imageDefault}
                    altImage={item.title}
                    index={index}
                  />
                </div>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    )
  );
};
export default RecentView;
