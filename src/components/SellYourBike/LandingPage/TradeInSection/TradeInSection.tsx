import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import FeatureSection from 'components/TradeIn/FeatureSection';
import images from 'assets/images';
import classes from './trade-in-section.module.scss';

const TradeInSection = () => {
  return (
    <>
      <div className={classes.instant}>Trade In</div>
      <div className={classes.titleInstant}>Instant valuations and quick and easy trade ins</div>
      <Row>
        <Col xs={12} md={4} className={classes.cardBenefit}>
          <img
            src={images.valueGuide.icTradeInBlue}
            alt="icon instant payout"
            className={classes.cardIcon}
            width={30}
            height={30}
          />
          <div>
            <div className={classes.cardTitle}>Put your old bike to use</div>
            <div className={classes.cardContent}>
              Instantly unlock the value of your current bike by trading it towards the purchase of a new one.
            </div>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.cardBenefit}>
          <img
            src={images.sell.iconHeartPrimary}
            alt="icon instant payout"
            className={classes.cardIcon}
            width={30}
            height={30}
          />
          <div>
            <div className={classes.cardTitle}>Save hassle/expenses</div>
            <div className={classes.cardContent}>
              Take out the hassle and expense of repairing, cleaning, and shipping your current bike.
            </div>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.cardBenefit}>
          <img
            src={images.sell.iconPadLock}
            alt="icon instant payout"
            className={classes.cardIcon}
            width={30}
            height={30}
          />
          <div>
            <div className={classes.cardTitle}>Avoid sellers fees and scams</div>
            <div className={classes.cardContent}>
              Avoid seller's fees while trying to sell online, not to mention dealing with potential scams.
            </div>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.cardBenefit}>
          <img
            src={images.sell.iconStore}
            alt="icon instant payout"
            className={classes.cardIcon}
            width={30}
            height={30}
          />
          <div>
            <div className={classes.cardTitle}>Support Local Business</div>
            <div className={classes.cardContent}>
              Our Trade-in program helps to support local bike shops nationwide.
            </div>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.cardBenefit}>
          <img
            src={images.sell.iconPriceTag}
            alt="icon instant payout"
            className={classes.cardIcon}
            width={30}
            height={30}
          />
          <div>
            <div className={classes.cardTitle}>Immediate valuations</div>
            <div className={classes.cardContent}>
              The only program to offer immediate valuations based on millions of used bike sales.
            </div>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.cardBenefit}>
          <img
            src={images.sell.icBlueRestart}
            alt="icon instant payout"
            className={classes.cardIcon}
            width={30}
            height={30}
          />
          <div>
            <div className={classes.cardTitle}>Drive circular economy</div>
            <div className={classes.cardContent}>
              Trading in extends the life of your bike and contributes to a more sustainable retail ecosystem.
            </div>
          </div>
        </Col>
      </Row>
      <div className={classes.feature}>
        <FeatureSection />
      </div>
    </>
  );
};

export default TradeInSection;
