import images from 'assets/images';
import React from 'react';
import Container from 'reactstrap/lib/Container';
import V3BannerComponent from 'components/V3BannerComponent';
import CoverSection from 'components/SellYourBike/CoverSection';
import BenefitSection from './BenefitSection';
import InstantPayoutSection from './InstantPayoutSection';
import IntroSection from './IntroSection';
import ShareSection from './ShareSection/ShareSection';
import TradeInSection from './TradeInSection/TradeInSection';
import classes from './landing-page.module.scss';

const SellYourBikeLandingPage = () => {
  return (
    <div className="position-relative">
      <V3BannerComponent customWrapBanner={classes.customWrapBanner} />
      <CoverSection />
      <Container className={classes.container}>
        <IntroSection />
        <div className={classes.learnMore}>
          Learn More
          <div>
            <img src={images.sell.icLightGreyArrowDown} alt="ic light gray arrow" className={classes.arrowDown} />
          </div>
        </div>
        <BenefitSection />
        <InstantPayoutSection />
        <TradeInSection />
        <ShareSection />
      </Container>
    </div>
  );
};

export default SellYourBikeLandingPage;
