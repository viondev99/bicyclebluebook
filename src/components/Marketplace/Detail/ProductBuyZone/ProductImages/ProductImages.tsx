/* eslint-disable no-unused-expressions */
import React, { FC, useEffect, useState, useCallback, useRef, useMemo, Suspense } from 'react';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { SwiperOptions } from 'swiper';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';

import icLeftArrowPrimary from 'assets/img/listing/ic_left_arrow.svg';
import icRightArrowPrimary from 'assets/img/listing/ic_right_arrow.svg';
import ZoomImage from '@ui/ZoomImage/ZoomImage';
import { useSelector } from 'react-redux';
import { isStoreBike } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { StageInventory } from 'model/store/common.model';
import classes from './product-images.module.scss';
import SafeImage from '../../../../Image/SafeImage';
import useScreenDetect from '../../../../../hooks/useScreenDetect';

const ModalViewDetailImages = React.lazy(() => import('@ui/Modal/ModalViewDetailImages'));

interface Props {
  images: Array<string>;
  deleted: boolean;
  status: string;
  loading?: boolean;
  rightContentMeasure?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  isShowBannerBestDeal?: boolean;
}

const slideOptions: SwiperOptions = {
  // init: false,
  slidesPerView: 1.05,
  spaceBetween: 10,
  passiveListeners: true,

  breakpoints: {
    576: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
  },
};

function getBadgeTextByStatus(status?: string): string | null {
  if (!status) {
    return null;
  }
  if (status === 'DELETED') {
    return 'Deleted';
  }
  if (status === 'SOLD') {
    return 'Sold';
  }
  if (status === 'EXPIRED') {
    return 'EXPIRED';
  }
  if (status === 'SALE_PENDING') {
    return 'Sale Pending';
  }
  if (status === 'DE_LISTED') {
    return 'De-listed';
  }
  if (status === 'CLOSED_CART_EXPIRED') {
    return 'ENDED';
  }
  if (status === 'CLOSE') {
    return 'ENDED';
  }

  if (status === 'SOLD') {
    return 'Sold';
  }
  if (status === 'PENDING') {
    return 'Pending';
  }

  // return 'For sale';
  return null;
}

const ProductImages: FC<Props> = ({ images = [], status, deleted, loading, isShowBannerBestDeal }) => {
  const { isMediumScreen, currentWidthScreen } = useScreenDetect(1024);
  const [mainPicture, setMainPicture] = useState(images[0]);
  const [show, setShow] = useState(false);
  const swiper = useRef<SwiperInstance>(null);
  const product = useSelector((state: StoreState) => state.marketplace.detail);
  const [visibleModalViewDetailMainImage, setVisibleModalViewDetailMainImage] = useState(null);

  useEffect(() => {
    if (images) {
      setMainPicture(images[0]);
    }
  }, [images]);
  useEffect(() => {
    // Effect for detect resize to mobile should change viewType to grid
    const onResize = () => {
      if (window.innerWidth >= 576) {
        setShow(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [images]);
  const onChangeImage = useCallback(
    (type: 'prev' | 'next') => {
      let current = images.findIndex((item) => item === mainPicture);
      if (type === 'prev') {
        current = current >= 1 ? current - 1 : images.length - 1;
      } else {
        current = current < images.length - 1 ? current + 1 : 0;
      }
      if (swiper?.current) {
        swiper?.current?.slideTo(current);
      }
      setMainPicture(images[current]);
    },
    [images, mainPicture],
  );
  const statusName = deleted ? 'Deleted' : getBadgeTextByStatus(status);

  const isBicycleOutlet: boolean = product?.storefrontId === isStoreBike();
  const isBestDeal: boolean = product?.bestDeal;

  const renderSoldAsIsAndBestdeal = useMemo(() => {
    if (product?.stageInventory === StageInventory.ComingSoon) {
      return <div className={classes.tagCommingSoon}>Coming Soon</div>;
    }

    if (isBestDeal) {
      if (isBicycleOutlet) {
        return (
          <>
            <div className={currentWidthScreen > 1024 ? classes._imgBestDealCardViewDes : classes._imgBestDealCardView}>
              On Sale
            </div>
            <div
              className={currentWidthScreen > 1024 ? classes._imgSoldAsIsAndOnsaleDes : classes._imgSoldAsIsCardView}
              style={{ marginTop: currentWidthScreen <= 1024 && '50px' }}>
              Sold as-is
            </div>
          </>
        );
      }
      return (
        <div className={currentWidthScreen > 1024 ? classes._imgBestDealCardOnlyViewDes : classes._imgBestDealCardView}>
          On Sale
        </div>
      );
    }

    if (isBicycleOutlet) {
      return (
        <div className={currentWidthScreen > 1024 ? classes._imgSoldAsIsAndOnsaleDes : classes._imgSoldAsIsCardView}>
          Sold as-is
        </div>
      );
    }
    return null;
  }, [isBestDeal, isBicycleOutlet, currentWidthScreen, product]);

  const handleZoomInMainImage = useCallback(() => {
    const indexMainImage = images?.findIndex((it) => it === mainPicture);
    if (indexMainImage !== -1) {
      setVisibleModalViewDetailMainImage({
        currentIndex: indexMainImage,
        listImages: images,
      });
    }
  }, [images, mainPicture]);

  return (
    <>
      <div className={classes.bikeImageWrapper}>
        <div className={classes.bigPictureWrapper} onClick={handleZoomInMainImage}>
          {/* {statusName && <div className={classes.statusBadge}>{statusName}</div>} */}
          {loading ? (
            <Skeleton width="100%" height="100%" />
          ) : (
            <>
              {images.length > 1 && (
                <>
                  <button
                    type={'button'}
                    className={classes.buttonPrev}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChangeImage('prev');
                    }}>
                    <img src={icLeftArrowPrimary} alt={'error'} />
                  </button>
                  <button
                    type={'button'}
                    className={classes.buttonNext}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChangeImage('next');
                    }}>
                    <img src={icRightArrowPrimary} alt={'error'} />
                  </button>
                </>
              )}
              {renderSoldAsIsAndBestdeal}
              <ZoomImage src={mainPicture} rightContentId={'product-summary'}>
                <SafeImage
                  imgSize={'o'}
                  showProgress={true}
                  src={mainPicture}
                  alt={'main-picture'}
                  key={mainPicture}
                  className={classes.mainPicture}
                  prerenderWhileLoading={true}
                  renderLoading={
                    <SafeImage
                      imgSize={'s'}
                      key={`${mainPicture}_small`}
                      src={mainPicture}
                      alt={'main-picture'}
                      className={classes.mainPicture}
                    />
                  }
                />
              </ZoomImage>
            </>
          )}
        </div>
        <div className={classes.imageSlide}>
          {/* {statusName && <div className={classes.statusBadge}>{statusName}</div>} */}
          <Swiper
            {...slideOptions}
            containerClass={cx('swiper-container h-100', classes.swiperContainer)}
            getSwiper={(c) => {
              swiper.current = c;
            }}>
            {images.map((item) => (
              <div key={item}>
                <div className="embed-responsive embed-bike-ratio">
                  <div className="embed-responsive-item">
                    <button
                      type={'button'}
                      onClick={() => {
                        setMainPicture(item);
                        if (window.innerWidth < 576) {
                          handleZoomInMainImage();
                        }
                      }}
                      className={cx(classes.thumbImages, {
                        [classes.active]: mainPicture === item,
                      })}
                      aria-label={'Bike Pictures'}>
                      {currentWidthScreen <= 575 && renderSoldAsIsAndBestdeal}
                      <SafeImage
                        src={item}
                        imgSize={isMediumScreen() ? 'o' : 's'}
                        style={{ width: '100%', height: '100%' }}
                        alt={'bike-pictures'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Swiper>
        </div>
      </div>

      {!!visibleModalViewDetailMainImage && (
        <Suspense fallback={null}>
          <ModalViewDetailImages
            isOpen={!!visibleModalViewDetailMainImage}
            onClose={() => setVisibleModalViewDetailMainImage(null)}
            dataImages={visibleModalViewDetailMainImage}
          />
        </Suspense>
      )}
    </>
  );
};

export default ProductImages;
