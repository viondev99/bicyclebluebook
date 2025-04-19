import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import images from 'assets/images';
import SafeImage from 'components/Image/SafeImage';
import classes from './share.module.scss';

const ShareSection = () => {
  return (
    <Row className={classes.wrapShare} id={'download-our-app'}>
      <Col xs={12} md={7} lg={6}>
        <div className={classes.wrapImages}>
          <SafeImage src={images.sell.imgIphoneXSmall} className={classes.iphoneSmall} />
          <SafeImage src={images.sell.imgIphoneXBig} className={classes.iphoneBig} />
        </div>
      </Col>
      <Col xs={12} md={5} lg={6}>
        <div className={classes.title}>Download our mobile app</div>
        <div className={classes.description}>
          Trading and upgrading made easy. Get an instant valuation and make trading in simple, easy, and fast!
        </div>
        <div className={classes.wrapIcons}>
          <div className={classes.label}>Available on</div>
          <a
            href="https://apps.apple.com/us/app/id1530491147"
            target="_blank"
            rel="noreferrer noopener"
            className={classes.wrapShareIcon}>
            <div className={classes.icon}>
              <img src={images.imgAppStore} alt="imgAppStore" width={31} height={31} />
              <div className={classes.name}>App Store</div>
            </div>
            <img src={images.messages.icArrowRightGrey} alt="icArrowRightGrey" className={classes.arrowRight} />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.bbb.tradeinapp"
            target="_blank"
            rel="noreferrer noopener"
            className={classes.wrapShareIcon}>
            <div className={classes.icon}>
              <img src={images.imgChPlay} alt="imgChPlay" width={27} height={31} />
              <div className={classes.name}>App Store</div>
            </div>
            <img src={images.messages.icArrowRightGrey} alt="icArrowRightGrey" className={classes.arrowRight} />
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default ShareSection;
