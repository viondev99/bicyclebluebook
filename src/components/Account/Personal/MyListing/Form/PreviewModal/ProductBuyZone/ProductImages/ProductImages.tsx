import React, { FC, useEffect, useState } from 'react';
import Swiper from 'react-id-swiper';
import { SwiperOptions } from 'swiper';
import cx from 'classnames';
import SafeImage from 'components/Image/SafeImage';
import classes from 'components/Marketplace/Detail/ProductBuyZone/ProductImages/product-images.module.scss';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import ZoomImage from '@ui/ZoomImage/ZoomImage';
import ZoomModal from '@ui/ZoomImage/Zoom/ZoomModal';

interface Props {
  images: Array<ImageUpload>;
}

const slideOptions: SwiperOptions = {
  // init: false,
  slidesPerView: 1.05,
  spaceBetween: 10,

  breakpoints: {
    576: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
  },
};

const ProductImages: FC<Props> = ({ images = [] }) => {
  const [mainPicture, setMainPicture] = useState(images[0]);
  const [show, setShow] = useState(false);
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
  return (
    <>
      <div className={classes.bikeImageWrapper}>
        <div className={classes.bigPictureWrapper}>
          <ZoomImage
            src={mainPicture?.url || URL.createObjectURL(mainPicture?.file)}
            rightContentId={'preview-product-summary'}>
            <SafeImage
              imgSize={'o'}
              src={mainPicture?.url || URL.createObjectURL(mainPicture?.file)}
              alt={'main-picture'}
              key={mainPicture?.url || URL.createObjectURL(mainPicture?.file)}
              className={classes.mainPicture}
              prerenderWhileLoading={true}
              renderLoading={
                <SafeImage
                  imgSize={'s'}
                  key={`${mainPicture}_small`}
                  src={mainPicture?.url || URL.createObjectURL(mainPicture?.file)}
                  alt={'main-picture'}
                  className={classes.mainPicture}
                />
              }
            />
          </ZoomImage>
        </div>
        <div className={classes.imageSlide}>
          <Swiper {...slideOptions} containerClass={cx('swiper-container h-100', classes.swiperContainer)}>
            {images.map((item, index) => (
              <div key={String(index)}>
                <button
                  type={'button'}
                  onClick={() => {
                    setMainPicture(item);
                    // if (window.innerWidth < 576) {
                    //   setShow(true);
                    // }
                  }}
                  className={classes.thumbImages}
                  aria-label={'Bike Pictures'}>
                  <SafeImage
                    src={item?.url || URL.createObjectURL(item?.file)}
                    imgSize={'s'}
                    className={classes.subImage}
                    alt={'bike-pictures'}
                  />
                </button>
              </div>
            ))}
          </Swiper>
        </div>
      </div>
      <ZoomModal src={mainPicture.url} show={show} onClose={() => setShow(false)} />
    </>
  );
};

export default ProductImages;
