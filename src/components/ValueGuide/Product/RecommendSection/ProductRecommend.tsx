import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import Container from 'reactstrap/lib/Container';
import { useSelector } from 'react-redux';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import cx from 'classnames';
import Product, { ProductSkeleton } from '@ui/Product/Product';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import images from 'assets/images';
import classes from './productRecommended.module.scss';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  passiveListeners: true,
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

const ProductRecommended: FC = () => {
  const { currentWidthScreen } = useScreenDetect();
  const recommended = useSelector((state: StoreState) => state.valueGuide.recommend.recommended);
  const loading = useSelector((state: StoreState) => state.valueGuide.recommend.loading);
  const swiper = useRef<SwiperInstance>(null);

  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slidePrev();
    }
  }, []);

  const showDragBtn = useMemo(() => {
    if (
      (recommended?.length > 4 && currentWidthScreen >= 1200) ||
      (recommended?.length > 3 && currentWidthScreen < 1200 && currentWidthScreen >= 768)
    ) {
      return (
        <span className={classes.dragRecommend} onClick={goPrev}>
          <img
            src={images.icLeftArrow}
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
          <h3>Recommended</h3>
          {showDragBtn}
        </div>
        <div className={classes.swiperWrapper}>
          <div className={cx('d-xl-block d-none', classes.swiperSlideHint)} />
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
                    bikeName={item.inventoryTitle}
                    bikePrice={item.currentListedPrice}
                    currentListedPrice={item.currentListedPrice}
                    bikeType={item.bicycleTypeName}
                    image={item.imageDefault}
                    altImage={item.inventoryTitle}
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
export default ProductRecommended;
