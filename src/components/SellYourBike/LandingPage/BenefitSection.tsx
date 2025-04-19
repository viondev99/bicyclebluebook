import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import images from 'assets/images';
import Swiper from 'react-id-swiper';
import { SwiperOptions } from 'swiper';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classes from './landing-page.module.scss';

const slideOptions: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 20,
  passiveListeners: true,
  breakpoints: {
    576: {
      slidesPerView: 1.2,
      spaceBetween: 14,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 36,
    },
  },
};

const BenefitSection = () => {
  const router = useRouter();
  return (
    <Row className={classes.wrapBenefit}>
      <Col xs={12} lg={5}>
        <div className={classes.benefit}>Marketplace</div>
        <div className={classes.titleBenefit}>Listing your bike on Bicycle Blue Book</div>
      </Col>
      <Col xs={12} lg={7}>
        <Row>
          <Col xs={12} sm={6} className={classes.cardBenefit}>
            <img
              src={images.sell.iconMarketing}
              alt="icon benefit"
              className={classes.cardIcon}
              width={30}
              height={30}
            />
            <div>
              <div className={classes.cardTitle}>Huge Outreach</div>
              <div className={classes.cardContent}>
                Your listing can attract attention from hundreds of thousands of shoppers.
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} className={classes.cardBenefit}>
            <img
              src={images.sell.iconTraining}
              alt="icon benefit"
              className={classes.cardIcon}
              width={30}
              height={30}
            />
            <div>
              <div className={classes.cardTitle}>Effective Assistance</div>
              <div className={classes.cardContent}>
                We will guide you through the listing process to help create an effective listing.
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} className={classes.cardBenefit}>
            <img src={images.sell.iconPadLock} alt="icon benefit" className={classes.cardIcon} width={30} height={30} />
            <div>
              <div className={classes.cardTitle}>Safe and Secure</div>
              <div className={classes.cardContent}>Utilize a safe and secure marketplace to avoid potential scams.</div>
            </div>
          </Col>
          <Col xs={12} sm={6} className={classes.cardBenefit} id={'pack-your-bike'}>
            <img
              src={images.sell.iconHeartPrimary}
              alt="icon benefit"
              className={classes.cardIcon}
              width={30}
              height={30}
            />
            <div>
              <div className={classes.cardTitle}>Simple and Affordable</div>
              <div className={classes.cardContent}>
                We make selling your bike convenient, inexpensive, and hassle-free.
              </div>
            </div>
          </Col>
        </Row>
        <Link href="/article/start-selling">
          <h1 className={classes.linkSelfaBike}>
            How to Sell your Bike on BicycleBlueBook.com
            <img src={images.icArrowBlue} alt="" width={24} height={16} />
          </h1>
        </Link>
      </Col>
      <Col xs={12} className={classes.wrapSwipeBenefit}>
        <Swiper {...slideOptions}>
          <div className={classes.cardSwipe}>
            <span className={classes.customLink} onClick={() => router.push('/articles')}>
              Read our article
            </span>{' '}
            for tips on photographing your bike for the best advertisment.
          </div>
          <div className={classes.cardSwipe}>
            <a
              className={classes.customLink}
              rel="noreferrer noopener"
              href="https://www.youtube.com/watch?v=lr-oUndzmJY&feature=youtu.be"
              target="_blank">
              Watch our video
            </a>{' '}
            on how to pack your bike properly ready for shipping.
          </div>
          <div className={classes.cardSwipe} id={'instant-payout'}>
            5% Bicycle Blue Book final value fee, and 2.9% + $0.30 Paypal transaction fee.
          </div>
        </Swiper>
      </Col>
    </Row>
  );
};

export default BenefitSection;
