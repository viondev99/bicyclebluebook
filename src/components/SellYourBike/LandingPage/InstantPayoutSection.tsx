import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import cx from 'classnames';
import images from 'assets/images';
import classes from './landing-page.module.scss';

const InstantPayoutSection = () => {
  return (
    <>
      <div className={classes.instant}>Instant Payout</div>
      <div className={classes.titleInstant}>Quick and easy payment for your used bike</div>
      <div className={classes.wrapInstantPayout}>
        <Row>
          <Col xs={12} md={4} className={classes.cardInstant}>
            <img
              src={images.sell.iconPriceTag}
              alt="icon instant payout"
              className={classes.cardIcon}
              width={30}
              height={30}
            />
            <div className={classes.separate} />
            <div>
              <div className={cx('text-center', classes.cardTitle)}>Get a Valuation</div>
              <div className={cx('text-center', classes.cardContent)}>
                Find your bike in our database and we’ll give you an instant estimated valuation.
              </div>
            </div>
          </Col>
          <Col xs={12} md={4} className={classes.cardInstant}>
            <img
              src={images.sell.iconStore}
              alt="icon instant payout"
              className={classes.cardIcon}
              width={30}
              height={30}
            />
            <div className={classes.separate} />
            <div>
              <div className={cx('text-center', classes.cardTitle)}>Find a Partner</div>
              <div className={cx('text-center', classes.cardContent)}>
                Enter your zip code and select one of our partners near you to sell your bike with.
              </div>
            </div>
          </Col>
          <Col xs={12} md={4} className={classes.cardInstant}>
            <img
              src={images.sell.iconDollarPrimary}
              alt="icon instant payout"
              className={classes.cardIcon}
              width={30}
              height={30}
            />
            <div>
              <div className={cx('text-center', classes.cardTitle)}>Receive Payment</div>
              <div className={cx('text-center', classes.cardContent)}>
                Take your used bike into your chosen partner and receive an instant Paypal payment.
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default InstantPayoutSection;
