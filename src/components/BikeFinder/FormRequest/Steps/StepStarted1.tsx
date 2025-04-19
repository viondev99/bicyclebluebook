/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import CONFIG from 'config';
import useScreenDetect from 'hooks/useScreenDetect';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import Image from 'next/image';
import classes from './step.module.scss';
import icLeftArrow from '../../../../assets/img/home/ic_left_arrow.svg';
import GroupButton from './GroupButton';

const imgBikeFinder1 = `${CONFIG.IMAGE_CDN_URL}/bikeFinder1V2.png`;
const imgBikeFinder2 = `${CONFIG.IMAGE_CDN_URL}/bikeFinder2V2.png`;
const imgBikeFinder3 = `${CONFIG.IMAGE_CDN_URL}/bikeFinder3new.webp`;

const arrImages = [
  {
    id: 1,
    title: `Answer a few simple questions to help us find the perfect bike for you.`,
    url: imgBikeFinder1,
  },
  {
    id: 2,
    title: `We'll show you bikes that fit your needs that are available in our marketplace.`,
    url: imgBikeFinder2,
  },
  {
    id: 3,
    title: `You can add or remove filters to narrow or expand your results.`,
    url: imgBikeFinder3,
  },
];

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  // spaceBetween: 20,
  passiveListeners: true,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  // init: false,
  breakpoints: {
    576: {
      slidesPerView: 1.3,
      // spaceBetween: 20,
    },
    768: {
      slidesPerView: 1.3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

const StepStarted1: FC = () => {
  const { query, replace, pathname } = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const swiper = useRef<SwiperInstance>(null);

  const checkShowSlide = useMemo(() => {
    return currentWidthScreen < 768;
  }, [currentWidthScreen]);

  const goPrev = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    swiper.current?.slidePrev();
  }, []);

  const gotoStepStarted2 = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        step: 0,
      },
    });
  }, [pathname, query, replace]);

  const renderImages = useMemo(() => {
    return arrImages.map((it, index: number) => {
      return (
        <Col xl={4} md={6} key={it.id} className={classes.customCol}>
          <div className={classes.wrapItem} id={`idWrapImage991_${index}`}>
            <div className={classes.wrapIndexContent}>
              <span className={classes.indexContent}>{index + 1}</span>
            </div>
            <p className={classes.titleItem}>{it.title}</p>
            <div className={classes.wrapImages}>
              <Image unsized src={it.url} alt="image1" className={classes.customImages} id={`idImage991_${index}`} />
            </div>
          </div>
        </Col>
      );
    });
  }, []);

  const renderSlideImages = useMemo(() => {
    return (
      <Swiper
        {...slideOptions}
        key={2}
        getSwiper={(c) => {
          swiper.current = c;
        }}>
        {arrImages?.map((it, index: number) => (
          <Col xl={4} md={6} key={it.id} className={classes.customCol}>
            <div className={classes.wrapItem} id={`idWrapImage991_${index}`}>
              <div className={classes.wrapIndexContent}>
                <span className={classes.indexContent}>{index + 1}</span>
              </div>
              <p className={classes.titleItem}>{it.title}</p>
              <div className={classes.wrapImages}>
                <Image unsized src={it.url} alt="images" className={classes.customImages} id={`idImage991_${index}`} />
              </div>
            </div>
          </Col>
        ))}
      </Swiper>
    );
  }, []);

  const showDragBtn = useMemo(() => {
    return (
      <span className={classes.dragRecommend} onClick={goPrev}>
        <img src={icLeftArrow} alt={'arrow-left'} />
        Drag
      </span>
    );
  }, [goPrev]);

  return (
    <div className={classes.wrapStepStarted1}>
      {checkShowSlide ? (
        <div className={classes.stepTitleStepStarted}>Need our help finding the perfect bike?</div>
      ) : (
        <div className={classes.stepTitleStepStarted}>
          Need our help finding
          <br />
          the perfect bike?
        </div>
      )}
      <Row className={classes.customRow}>{checkShowSlide ? renderSlideImages : renderImages}</Row>
      {showDragBtn}
      <GroupButton disableBack={true} onClickContinue={gotoStepStarted2} />
      <div className={classes.wrapButtonSupportFixed} />
    </div>
  );
};

export default memo(StepStarted1);
