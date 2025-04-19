/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import CONFIG from 'config';
import useScreenDetect from 'hooks/useScreenDetect';
import Image from 'next/image';
import classes from './cover-section.module.scss';

interface FormValues {
  content: string;
}
const imgSellTradeTablet = `${CONFIG.IMAGE_CDN_URL}/imgSellTradeTablet.png`;
const imgSellTradePc = `${CONFIG.IMAGE_CDN_URL}/imgSellTradePc.webp`;

const CoverSection: FC = () => {
  const { currentWidthScreen } = useScreenDetect();
  // const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  // useEffect(() => {
  //   const _coverImg =
  //     currentWidthScreen >= 1025 ? imgSellTradePc : currentWidthScreen >= 768 ? imgSellTradeTablet : imgSellTradeTablet;
  //   setCoverImageUrl(_coverImg);
  // }, [currentWidthScreen]);

  // useEffect(() => {
  //   // const homeCoverSizesLarge = document.getElementById('idHomeCoverSizesLarge');
  //   // if (homeCoverSizesLarge) {
  //   //   homeCoverSizesLarge.style.height =
  //   //     currentWidthScreen >= 1025 ? `${homeCoverSizesLarge?.clientWidth / 2.617}px` : `750px`;
  //   // }

  //   // const homeCoverSizesMedium = document.getElementById('idHomeCoverSizesMedium');
  //   // if (homeCoverSizesMedium) {
  //   //   homeCoverSizesMedium.style.height =
  //   //     currentWidthScreen >= 768 ? `${homeCoverSizesMedium?.clientWidth * 1.148886}px` : `750px`;
  //   // }
  // }, [currentWidthScreen]);

  const renderHeightPc = useMemo(() => {
    if (currentWidthScreen >= 1025) {
      return currentWidthScreen / 2.947;
    }
    if (currentWidthScreen < 1025) {
      return null;
    }
    return 400;
  }, [currentWidthScreen]);

  return (
    <section
      className={classes.cover}
      // id="idHomeCoverSizesLarge"
      style={{
        backgroundImage: currentWidthScreen >= 1025 && `url(${imgSellTradePc})`,
        height: renderHeightPc,
      }}>
      <div className={cx('container', classes.wrapSection1)}>
        <div className={classes.wrapTitileAndSearchBar}>
          <div className={classes.wrapCoverSection}>
            <div className={classes.textSellMyBike}>Sell MY BIKE or Trade IT In</div>
            {currentWidthScreen >= 1025 ? (
              <h1 className={classes.homeCoverSiteTitle}>
                It's easy and secure
                <br />
                to sell and trade
                <br />
                your bike with us.
              </h1>
            ) : (
              <h1 className={classes.homeCoverSiteTitle}>It's easy and secure to sell and trade your bike with us.</h1>
            )}
          </div>
          {currentWidthScreen < 768 && (
            <Image
              className={classes.customBackgroundMobileImage}
              src={imgSellTradeTablet}
              alt=""
              loading="lazy"
              unsized={true}
            />
          )}
        </div>
        {currentWidthScreen >= 768 && currentWidthScreen < 1025 && (
          <div className={classes.wrapBackground} id="idHomeCoverSizesMedium">
            <Image
              className={classes.customBackgroundTabletImage}
              src={imgSellTradeTablet}
              alt=""
              loading="lazy"
              unsized={true}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CoverSection;
