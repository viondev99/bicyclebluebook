import React, { FC, useCallback, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import { SwiperOptions } from 'swiper';
import Button from '@ui/Buttons/Primary/Button';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import Card from '../ui/Cards';
import images from '../../assets/images';
import classes from './sell.module.scss';

const slideOptions: SwiperOptions = {
  // slidesPerView: 1.2,
  // init: false,
  // freeMode: true,
  passiveListeners: true,
  spaceBetween: 20,
  // height: 500,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    300: {
      slidesPerView: 1.2,
      spaceBetween: 14,
      freeMode: true,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
      freeMode: true,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 2.2,
      spaceBetween: 24,
      freeMode: true,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 2,
      spaceBetween: 24,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    },
  },
};
const slideData = [
  {
    titleName: 'Todd',
    titleLocation: 'Houston, TX',
    content:
      'The trade in process was super easy and it went a lot smoother than I thought it would. I chose to trade in versus selling to save hassle. I got a fair price for my trade in and I couldn’t be happier.',
  },
  {
    titleName: 'Beverly',
    titleLocation: 'Wisconsin',
    content:
      'I got an email saying I could trade my bike in, so I brought two into the store. They were so helpful and in the meantime I found a new bike I really liked and it was as easy as that! I would do it again in a heart beat.',
  },
  {
    titleName: 'Jorge',
    titleLocation: 'Orlando, FL',
    content:
      'The process was super easy, a couple of photos and that was about it. My dealer did the rest. This is what made this so painless and trouble free for me. Definitely will use Bicycle Bluebook again.',
  },
];
const Benefits: FC = () => {
  const [swipper, setSwipper] = useState<SwiperInstance>(null);
  const goNext = useCallback(() => {
    swipper.slideNext();
  }, [swipper]);
  const goPre = useCallback(() => {
    swipper.slidePrev();
  }, [swipper]);
  return (
    <>
      <section className={cx(classes.section, classes.benefit, 'pb-0')} id={'testimonials'}>
        <Container>
          <div className={cx(classes.miniTitle)}>TESTIMONIALS</div>
          <h2 className={'text-center'}>What our Partners have to say</h2>
        </Container>
      </section>
      <section className={cx(classes.section, classes.benefitContent, classes.benefit, 'pt-0')}>
        <div className={cx('d-flex', classes.benefits, 'container')}>
          <Swiper {...slideOptions} getSwiper={(c: any) => setSwipper(c)}>
            {slideData.map((item, index: number) => (
              <Card className={classes.benefitCard} key={String(index)}>
                <div className={classes.titleBox}>
                  <img src={images.sell.ic_note} alt={'small-business'} />
                  <h4 className={classes.contentTitle}>
                    {item.titleName} –<span> {item.titleLocation}</span>
                  </h4>
                </div>
                <p className={classes.content}>{item.content}</p>
              </Card>
            ))}
          </Swiper>
          <Button
            disabled={swipper && !swipper.allowSlideNext}
            buttonType="clear"
            className={classes.btnNext}
            onClick={goNext}>
            <img src={images.sell.ic_next} alt={'Next Icon'} />
          </Button>
          <Button
            disabled={swipper && !swipper.allowSlidePrev}
            buttonType="clear"
            className={classes.btnPre}
            onClick={goPre}>
            <img src={images.sell.ic_next} alt={'Next Icon'} />
          </Button>
        </div>
      </section>
    </>
  );
};

export default Benefits;
