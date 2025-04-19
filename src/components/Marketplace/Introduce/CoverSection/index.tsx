/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import useScreenDetect from 'hooks/useScreenDetect';
import Button from '@ui/Buttons/Primary/Button';
import CONFIG from 'config';
import Image from 'next/image';
import icRightArrowWhite from 'assets/img/trade-in/ic_right_arrow_white.svg';
import classes from './cover-section.module.scss';

const imgMarketplaceIntrodudePc = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude_xl.webp`;
const imgMarketplaceIntrodudeTablet = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude_lg.webp`;
const imgMarketplaceIntrodudeMobile = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude.webp`;

const CoverSection: FC = () => {
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  // useEffect(() => {
  //   const homeCoverSizesLarge = document.getElementById('idHomeCoverSizesLarge');
  //   if (homeCoverSizesLarge) {
  //     homeCoverSizesLarge.style.height =
  //       currentWidthScreen >= 1025 ? `${homeCoverSizesLarge?.clientWidth / 2.617}px` : `750px`;
  //   }

  //   const homeCoverSizesMedium = document.getElementById('idHomeCoverSizesMedium');
  //   if (homeCoverSizesMedium) {
  //     homeCoverSizesMedium.style.height =
  //       currentWidthScreen >= 768 ? `${homeCoverSizesMedium?.clientWidth * 1.148886}px` : `750px`;
  //   }
  // }, [currentWidthScreen]);

  const gotoPage = useCallback(
    (url: string) => {
      router.replace(url);
    },
    [router],
  );

  const renderHeightPc = useMemo(() => {
    if (currentWidthScreen >= 1025) {
      return currentWidthScreen / 2.787;
    }
    if (currentWidthScreen < 1025) {
      return null;
    }
    return 400;
  }, [currentWidthScreen]);

  return (
    <section
      className={classes.cover}
      id="idHomeCoverSizesLarge"
      style={{
        backgroundImage: currentWidthScreen >= 1025 && `url(${imgMarketplaceIntrodudePc})`,
        height: renderHeightPc,
      }}>
      <div className={cx('container', classes.wrapSection1)}>
        <div className={classes.wrapTitileAndSearchBar}>
          <div className={classes.wrapCoverSection}>
            {currentWidthScreen >= 1025 ? (
              <h1 className={classes.homeCoverSiteTitle}>
                Shop the largest
                <br />
                marketplace for
                <br />
                used bikes
              </h1>
            ) : (
              <h1 className={classes.homeCoverSiteTitle}>Shop the largest marketplace for used bikes</h1>
            )}
          </div>
          <Button className={classes.customButtonSize} onClick={() => gotoPage('/marketplace/buy-now')}>
            <span>Shop All Bikes</span>
            <img src={icRightArrowWhite} alt="arrow-right" />
          </Button>
          {currentWidthScreen < 768 && imgMarketplaceIntrodudeMobile && (
            <Image
              className={classes.customBackgroundMobileImage}
              src={imgMarketplaceIntrodudeMobile}
              alt=""
              loading="lazy"
              unsized={true}
            />
          )}
        </div>
        {currentWidthScreen >= 768 && currentWidthScreen < 1025 && imgMarketplaceIntrodudeTablet && (
          <div className={classes.wrapBackground} id="idHomeCoverSizesMedium">
            <Image
              className={classes.customBackgroundTabletImage}
              src={imgMarketplaceIntrodudeTablet}
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
