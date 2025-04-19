/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import cx from 'classnames';
import { useRouter } from 'next/router';
import useScreenDetect from 'hooks/useScreenDetect';
import Link from 'next/link';
import CONFIG from 'config';
import FilterRange from '../FilterRange/FilterRange';
import classes from './shop-bike-category-section.module.scss';

import icLeftArrowBlack from '../../../../assets/img/common/ic_left_arrow_black.svg';
import icRightArrowBlack from '../../../../assets/img/common/ic_right_arrow_black.svg';

const imgRoadShopBikeCategory = `${CONFIG.IMAGE_CDN_URL}/imgRoadShopBikeCategoryV2.png`;
const imgMountainShopBikeCategory = `${CONFIG.IMAGE_CDN_URL}/imgMountainShopBikeCategory.png`;
const imgKidBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/adobestock_287466502_1.png`;
const imgCyclopBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/tk21_checkpoint_gravel_colorado_33_1.png`;
const imgEbikeBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/tk21_my22_fx_austin_tx_dr17737_1.png`;
const imgHybridBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/imgHybridBikeMarketplaceLanding.png`;
const imgWomanShopBikeCategory = `${CONFIG.IMAGE_CDN_URL}/imgWomanShopBikeCategory.png`;

const listCategories = [
  {
    id: 1,
    title: 'Road Bikes',
    imageUrl: imgRoadShopBikeCategory,
    link: '/marketplace/buy-now/road-bikes',
  },
  {
    id: 2,
    title: 'Mountain Bikes',
    imageUrl: imgMountainShopBikeCategory,
    link: '/marketplace/buy-now/mountain-bikes',
  },
  {
    id: 4,
    title: 'Hybrid Bikes',
    imageUrl: imgHybridBikeMarketplaceLanding,
    link: '/marketplace/buy-now/hybrid-bikes',
  },
  {
    id: 7,
    title: 'Kids Bikes',
    imageUrl: imgKidBikeMarketplaceLanding,
    link: '/marketplace/buy-now/kids-bikes',
  },
  {
    id: 3,
    title: 'Womens Bikes',
    imageUrl: imgWomanShopBikeCategory,
    link: '/marketplace/buy-now?page=1&g=Womens',
  },
  {
    id: 5,
    title: 'Cyclocross Bikes',
    imageUrl: imgCyclopBikeMarketplaceLanding,
    link: '/marketplace/buy-now?t=Cyclocross',
  },
  {
    id: 6,
    title: 'E-Bikes',
    imageUrl: imgEbikeBikeMarketplaceLanding,
    link: '/marketplace/buy-now/e-bikes',
  },
];

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  passiveListeners: true,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  // init: false,
  breakpoints: {
    320: {
      slidesPerView: 1.2,
      spaceBetween: 27,
    },
    576: {
      slidesPerView: 1.2,
      spaceBetween: 27,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 27,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
};

const ShopBuyCategorySection: FC = () => {
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const swiper: any = useRef<SwiperInstance>(null);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultSlideLength = useMemo(() => {
    return currentWidthScreen > 767 ? listCategories.length - 3 : listCategories.length - 1;
  }, [currentWidthScreen]);

  useEffect(() => {
    if (swiper?.current) {
      const handler = () => {
        setActiveIndex(swiper?.current?.activeIndex);
        if (swiper?.current?.isBeginning) {
          setIsHaveNext(true);
          setIsHavePrev(false);
        } else if (swiper?.current?.isEnd) {
          setIsHaveNext(false);
          setIsHavePrev(true);
        } else {
          setIsHaveNext(true);
          setIsHavePrev(true);
        }
      };
      if (!swiper?.current?.destroyed) {
        swiper?.current?.on('slideChange', handler);
      }
      return () => swiper?.current?.off('slideChange', handler);
    }
  }, []);

  const goNext = useCallback(() => {
    if (swiper?.current) {
      setActiveIndex(swiper?.current?.activeIndex);
      swiper?.current?.slideNext();
      if (swiper?.current?.isEnd) {
        setIsHaveNext(false);
      }
      setIsHavePrev(true);
    }
  }, []);
  const goPrev = useCallback(() => {
    if (swiper?.current) {
      setActiveIndex(swiper?.current?.activeIndex);
      swiper?.current?.slidePrev();
      if (swiper?.current?.isBeginning) {
        setIsHavePrev(false);
      }
      setIsHaveNext(true);
    }
  }, []);

  const gotoPage = useCallback(
    (link: string) => {
      router.replace(link);
    },
    [router],
  );

  return (
    <section className={classes.section}>
      <Container>
        <div className={classes.wrapShopBuyCategorySection}>
          <div className={classes.wraplabel}>
            <label>Shop by category</label>
            <Link href={`/marketplace/buy-now`}>
              <a>Shop All</a>
            </Link>
          </div>

          <div className={classes.swiperWrapper}>
            <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />

            <Swiper
              {...slideOptions}
              key={2}
              getSwiper={(c) => {
                swiper.current = c;
              }}>
              {listCategories?.map((item: any, index) => (
                <div
                  onClick={() => gotoPage(item.link)}
                  className={cx(classes.itemSlider, 'custom-item-year')}
                  key={item.id}>
                  <img src={item.imageUrl} alt="" />
                  <span>{item.title}</span>
                </div>
              ))}
            </Swiper>

            <div className={classes.wrapArrowSwiper}>
              <div className={classes.progressBar}>
                <FilterRange
                  range={[0, defaultSlideLength]}
                  step={1}
                  value={[0, activeIndex]}
                  onChange={() => null}
                  disabled
                />
              </div>
              <div className={classes.wrapArrow}>
                <div className={cx(classes.wrapArrowLeft, classes.arrow)} onClick={goPrev}>
                  <img src={icLeftArrowBlack} alt="arrow-left" />
                </div>
                <div className={classes.arrow} onClick={goNext}>
                  <img src={icRightArrowBlack} alt={'Icon Next'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ShopBuyCategorySection;
