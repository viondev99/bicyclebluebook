import React, { FC } from 'react';
import Container from 'reactstrap/lib/Container';
import { useSelector } from 'react-redux';
import StoreState from '../../model/store';
import classes from './sell.module.scss';
import Card from '../ui/Cards';
import { SwiperOptions } from 'swiper';
import Swiper from '@ui/Slick/TestSlick';
import cx from 'classnames';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  passiveListeners: true,
  spaceBetween: 20,
  height: 430,
  breakpoints: {
    480: {
      slidesPerView: 1.2,
      spaceBetween: 10,
      freeMode: false,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
      // freeMode: true,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
      // freeMode: true,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 20,
      // freeMode: true,
    },
  },
};
const Recommended: FC = () => {
  const recommended = useSelector((state: StoreState) => state.home.recommended);
  const loading = useSelector((state: StoreState) => state.home.loadingRecommended);

  return (
    <section className={classes.section}>
      <Container className={classes.recommend}>
        <Swiper id={'recommended'} className={cx('d-flex', classes.benefits)} options={slideOptions}>
          <Swiper.Slide>
            <Card className={classes.recommendCard}>
              <p>
                <span className={classes.label}>Read our article</span> for tips on photographing your bike for the best
                advertisment.
              </p>
            </Card>
          </Swiper.Slide>
          <Swiper.Slide>
            <Card className={classes.recommendCard}>
              <p>
                <span className={classes.label}> Watch our video </span> on how to pack your bike properly ready for
                shipping.
              </p>
            </Card>
          </Swiper.Slide>{' '}
          <Swiper.Slide>
            <Card className={classes.recommendCard}>
              <p> 5% Bicycle Blue Book final value fee, and 2.9% + $0.30 Paypal transaction fee.</p>
            </Card>
          </Swiper.Slide>
        </Swiper>
      </Container>
    </section>
  );
};
export default Recommended;
