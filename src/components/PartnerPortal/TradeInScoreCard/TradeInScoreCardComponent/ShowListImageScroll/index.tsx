import React, { FC, useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import { ImageType } from 'model/store/partner/scorecard.model';
import classes from './show-list-image-scroll.module.scss';

interface Props {
  files: ImageType[];
}

const slideOptions: SwiperOptions = {
  slidesPerView: 1.6,
  spaceBetween: 20,
  passiveListeners: true,
  // init: false,
  breakpoints: {
    576: {
      slidesPerView: 1.8,
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

const ImageList: FC<Props> = ({ files }) => {
  const swiper: any = useRef<SwiperInstance>(null);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);

  const goNext = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slideNext();
      if (swiper?.current?.isEnd) {
        setIsHaveNext(false);
      }
      if (!isHavePrev) {
        setIsHavePrev(true);
      }
    }
  }, [isHavePrev]);
  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slidePrev();
      if (swiper?.current?.isBeginning) {
        setIsHavePrev(false);
      }
      if (!isHaveNext) {
        setIsHaveNext(true);
      }
    }
  }, [isHaveNext]);

  const listImageDisplay = useMemo(() => {
    return files;
  }, [files]);

  useEffect(() => {
    if (swiper?.current) {
      if (!listImageDisplay || listImageDisplay?.length === 0) {
        return;
      }
      const handler = () => {
        const totalSlide = listImageDisplay.length;
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
  }, [listImageDisplay, listImageDisplay.length]);

  return (
    <>
      <div className={classes.swiperWrapper}>
        {listImageDisplay.length > 0 && (
          <>
            <style>
              {`
              .swiper-wrapper {
                height: auto!important
              }

              `}
            </style>
            {isHavePrev && (
              <Button buttonType="clear" className={classes.btnPrev} onClick={goPrev}>
                <img
                  src={images.account.personal.iconNext}
                  style={{ transform: 'rotateY(180deg)' }}
                  alt={'Next Icon'}
                />
              </Button>
            )}
            <Swiper
              {...slideOptions}
              getSwiper={(c) => {
                swiper.current = c;
              }}
              containerClass={classes.containerSwiper}>
              {listImageDisplay?.length
                ? listImageDisplay.map((item: ImageType, index: number) => (
                    <div key={item.id || String(index)}>
                      <div className={classes.imageWrapper}>
                        <img src={item?.defaultImage} alt={'Product'} className={'img-fluid'} />
                      </div>
                      <div className={classes.description}>{item?.name || ''}</div>
                    </div>
                  ))
                : null}
            </Swiper>
            {isHaveNext && (
              <Button buttonType="clear" className={classes.btnNext} onClick={goNext}>
                <img src={images.account.personal.iconNext} alt={'Next Icon'} />
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ImageList;
