import React, { FC } from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import { SwiperOptions } from 'swiper';
import Swiper from '@ui/Slick/TestSlick';
import Card from '@ui/Cards';
import classes from './home.module.scss';

import icSmallBusiness from '../../assets/img/home/ic_small_business.svg';
import icUsedBike from '../../assets/img/home/ic_used_bike.svg';
import icGivingBack from '../../assets/img/home/ic_giving_back.svg';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  // init: false,
  passiveListeners: true,
  centeredSlides: false,
  freeMode: true,
  spaceBetween: 20,
  height: 430,
  breakpoints: {
    768: {
      slidesPerView: 2.3,
      spaceBetween: 20,
      freeMode: true,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 2.3,
      spaceBetween: 20,
      freeMode: true,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 20,
      freeMode: true,
    },
  },
};

const Benefits: FC = () => {
  return (
    <>
      <section className={cx(classes.section, classes.benefit, 'pb-0')}>
        <Container>
          <div className={cx(classes.miniTitle)}>Benefits</div>
          <h2 className={'text-center'}>Driving the Circular Economy</h2>
        </Container>
      </section>
      <section className={cx(classes.section, classes.benefitContent, classes.benefit, 'pt-0')}>
        <Container>
          <Swiper id={'home-benefit'} className={cx('d-flex', classes.benefits)} options={slideOptions}>
            <Swiper.Slide>
              <Card className={classes.benefitCard}>
                <img src={icSmallBusiness} style={{ width: 80, height: 56 }} alt={'small-business'} />
                <h4 className={classes.contentTitle}>Supporting Local</h4>
                <p className={classes.content}>
                  Every bike that comes through our Trade in Program drives business for local bike shops.
                </p>
              </Card>
            </Swiper.Slide>
            <Swiper.Slide>
              <Card className={classes.benefitCard}>
                <img src={icUsedBike} style={{ width: 80, height: 56 }} alt={'scorecard'} />
                <h4 className={classes.contentTitle}>Making Old New</h4>
                <p className={classes.content}>
                  We provide the foundation for the secondary bicycle market as the definitive source for used bike
                  values.
                </p>
              </Card>
            </Swiper.Slide>
            <Swiper.Slide>
              <Card className={classes.benefitCard}>
                <img src={icGivingBack} style={{ width: 80, height: 56 }} alt={'giving-back'} />
                <h4 className={classes.contentTitle}>Doing Our Part</h4>
                <p className={classes.content}>
                  We reduce our carbon footprint by extending the life of every bike we take in through trades.
                </p>
              </Card>
            </Swiper.Slide>
          </Swiper>
          <div className={classes.benefitDescription}>
            When combined together, these pillars contribute to a more sustainable cycling industry ecosystem.
          </div>
        </Container>
      </section>
    </>
  );
};

export default React.memo(Benefits);
