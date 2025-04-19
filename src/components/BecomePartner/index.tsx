import React from 'react';
import Container from 'reactstrap/lib/Container';
import FeatureSection from './FeatureSection/FeatureSection';
import classes from './become-partner.module.scss';
import IntroSection from './IntroSection';
import Benefits from './Benefits';
import Comments from '../Sell/Benefits';

const BecomePartnerPage = () => {
  return (
    <div className="overflow-hidden">
      <IntroSection />
      <Container className={classes.container}>
        <Benefits />
      </Container>
      <Comments />
      <Container className={classes.container} id={'feature-section'}>
        <FeatureSection />
      </Container>
    </div>
  );
};

export default BecomePartnerPage;
