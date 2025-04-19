/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CONFIG from 'config';
import FilterRange from '../FilterRange/FilterRange';
import classes from './shop-bike-brand-section.module.scss';

import icLeftArrowBlack from '../../../../assets/img/common/ic_left_arrow_black.svg';
import icRightArrowBlack from '../../../../assets/img/common/ic_right_arrow_black.svg';

const imgGiantShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgGiantShopBikeBrand.png`;
const imgTrekShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgTrekShopBikeBrand.png`;
const imgCannondeBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/cannondale-supersix-evo-hi-mod-dura-ace-di2-406214-1.png`;
const imgSantaBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/santa_cruz_1.png`;
const imgSpecShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgSpecShopBikeBrand.png`;

const listCategories = [
  { id: 1, title: 'Trek', imageUrl: imgTrekShopBikeBrand },
  { id: 2, title: 'Specialized', imageUrl: imgSpecShopBikeBrand },
  { id: 3, title: 'Giant', imageUrl: imgGiantShopBikeBrand },
  { id: 4, title: 'Cannondale', imageUrl: imgCannondeBikeMarketplaceLanding },
  { id: 5, title: 'Santa Cruz', imageUrl: imgSantaBikeMarketplaceLanding },
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

const ShopBuyBrandSection: FC = () => {
  const { currentWidthScreen } = useScreenDetect();
  const { brandList } = useMarketplaceFilter();
  const router = useRouter();
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
    (index: number) => {
      let nameOfBrand = '';
      switch (index) {
        case 0: {
          nameOfBrand = 'Trek';
          break;
        }
        case 1: {
          nameOfBrand = 'Specialized';
          break;
        }
        case 2: {
          nameOfBrand = 'Giant';
          break;
        }
        case 3: {
          nameOfBrand = 'Cannondale';
          break;
        }
        case 4: {
          nameOfBrand = 'Santa Cruz';
          break;
        }
        default:
          break;
      }

      if (nameOfBrand !== '' && brandList?.length) {
        router.replace(`/marketplace/buy-now?page=1&b=${brandList?.filter((i) => i?.name === nameOfBrand)[0]?.id}`);
      }
    },
    [brandList, router],
  );

  return (
    <section className={classes.section}>
      <Container>
        <div className={classes.wrapShopBuyBrandSection}>
          <div className={classes.wraplabel}>
            <label>Shop by Brand</label>
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
                  onClick={() => gotoPage(index)}
                  className={cx(classes.itemSlider, 'custom-item-year')}
                  key={item.id}>
                  <div className={classes.title}>{item.title}</div>
                  <img className={`item_${index}`} src={item.imageUrl} alt="" />
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

export default ShopBuyBrandSection;
