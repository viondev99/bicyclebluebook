/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-expressions */
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import Modal from '@ui/Modal/Modal';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { SwiperOptions } from 'swiper';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import ScrollContainer from 'react-indiana-drag-scroll';

import icCloseWhite from 'assets/img/common/icCloseWhite.svg';
import icLeftArrowWhite from 'assets/img/trade-in/ic_left_arrow_white.svg';
import icLeftArrowPrimary from 'assets/img/listing/ic_left_arrow.svg';
import icRightArrowPrimary from 'assets/img/listing/ic_right_arrow.svg';
import classes from './modal-view-detail-image.module.scss';
import icZoomIn from '../../../../assets/img/marketplace/icZoomIn.svg';
import icZoomOut from '../../../../assets/img/marketplace/icZoomOut.svg';

const slideOptions: SwiperOptions = {
  // init: false,
  slidesPerView: 1,
  spaceBetween: 0,
  passiveListeners: true,

  breakpoints: {
    576: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
  },
};

export interface DataViewDetailImage {
  currentIndex: number;
  listImages: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataImages: DataViewDetailImage;
}

const ModalViewDetailImages: FC<Props> = ({ isOpen, onClose, dataImages }) => {
  const swiper: any = useRef<SwiperInstance>(null);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const { currentWidthScreen } = useScreenDetect();
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [selectedImageScale, setSlectedImageScale] = useState('');

  const goNext = useCallback(() => {
    if (swiper?.current) {
      swiper.current?.slideNext();
      if (swiper?.current?.isEnd) {
        setIsHaveNext(false);
        return;
      }
      setIsHavePrev(true);
    }
  }, []);
  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper.current?.slidePrev();
      if (swiper?.current?.isBeginning) {
        setIsHavePrev(false);
        return;
      }
      setIsHaveNext(true);
    }
  }, []);

  useEffect(() => {
    if (swiper?.current) {
      const handler = () => {
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

  useEffect(() => {
    const getElementsByClassNameCustomItemYear: any = document.getElementsByClassName('swiperContainer1');
    if (
      getElementsByClassNameCustomItemYear &&
      Array.isArray(getElementsByClassNameCustomItemYear) &&
      getElementsByClassNameCustomItemYear?.length &&
      currentWidthScreen < 768
    ) {
      getElementsByClassNameCustomItemYear[0].style.width = '20px';
    }
  }, [currentWidthScreen]);

  useEffect(() => {
    const img: any = document.querySelector('#zoomInImage');
    if (img) {
      const width = 920;

      if (isZoomIn) {
        img.style.transformOrigin = `center`;
        img.style.width = `${width * 2}px`;
      } else {
        img.style.transformOrigin = `center`;
        img.style.width = `${width}px`;
      }
    }
  }, [isZoomIn]);

  const handleSetZoomIn = useCallback(
    (data: string) => {
      if (isZoomIn) {
        return;
      }
      setIsZoomIn(true);
      setSlectedImageScale(data);
    },
    [isZoomIn],
  );
  const handleZoomInByButton = useCallback(() => {
    if (isZoomIn) {
      return;
    }
    if (dataImages?.listImages?.length) {
      setIsZoomIn(true);
      setSlectedImageScale(dataImages?.listImages[swiper?.current?.activeIndex]);
    }
  }, [dataImages, isZoomIn]);
  return (
    <Modal
      isOpen={isOpen}
      hideToggle={true}
      onClose={onClose}
      centered={true}
      contentClassName={classes.contentClassName}
      titleClassName={classes.titleClassName}
      className={classes.customModalViewDetailImages}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      isHeader={true}
      bodyProps={{
        className: classes.customModalBody,
      }}
      title={``}>
      <div className={cx(classes.wrapImages, !isZoomIn ? classes.zoomIn : classes.zoomOut)}>
        {currentWidthScreen > 767 ? (
          <div className={classes.btnCloses}>
            <img onClick={onClose} src={icCloseWhite} className={classes.icClose} alt="icon close" />
          </div>
        ) : (
          <img onClick={onClose} src={icLeftArrowWhite} className={classes.icCloseMobile} alt="icon close" />
        )}

        {!isZoomIn ? (
          <Swiper
            {...slideOptions}
            initialSlide={dataImages?.currentIndex}
            containerClass={cx('swiper-container h-100', classes.swiperContainer, 'swiperContainer1')}
            getSwiper={(c) => {
              swiper.current = c;
            }}>
            {dataImages?.listImages?.map((item) => (
              <img
                src={item}
                alt="view-detail-image"
                className={classes.customImage}
                onClick={() => handleSetZoomIn(item)}
              />
            ))}
          </Swiper>
        ) : (
          <ScrollContainer className={classes.swiperContainer} hideScrollbars={false}>
            <img src={selectedImageScale} alt="view-detail-image" className={classes.customImage} id="zoomInImage" />
          </ScrollContainer>
        )}
        <div className={classes.wrapBottomButton}>
          {dataImages?.listImages?.length > 1 && !isZoomIn && (
            <button type={'button'} className={classes.buttonPrev} onClick={goPrev}>
              <img src={icLeftArrowPrimary} alt={'error'} />
            </button>
          )}
          <img className={classes.ml12} src={icZoomOut} alt="" onClick={() => setIsZoomIn(false)} />
          <img className={classes.ml12} src={icZoomIn} alt="" onClick={handleZoomInByButton} />
          {dataImages?.listImages?.length > 1 && !isZoomIn && (
            <button type={'button'} className={classes.buttonNext} onClick={goNext}>
              <img src={icRightArrowPrimary} alt={'error'} />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalViewDetailImages);
