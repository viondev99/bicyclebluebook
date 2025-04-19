/* eslint-disable no-nested-ternary */
import React, { FC, useMemo } from 'react';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import Image from 'next/image';
import HomeSearchBar from './CoverSection/SearchBar/HomeSearchBar';
import classes from './home.module.scss';

interface Props {
  coverImageUrl: string;
}

const CoverSection: FC<Props> = ({ coverImageUrl }) => {
  const { currentWidthScreen } = useScreenDetect();

  // useEffect(() => {
  //   const homeCoverSizesLarge = document.getElementById('idHomeCoverSizesLarge');
  //   console.log(homeCoverSizesLarge, homeCoverSizesLarge?.clientWidth);
  //   // if (homeCoverSizesLarge) {
  //   //   homeCoverSizesLarge.style.height =
  //   //     currentWidthScreen >= 1025 ? `${homeCoverSizesLarge?.clientWidth / 1.9284}px` : `750px`;
  //   // }

  //   const homeCoverSizesMedium = document.getElementById('idHomeCoverSizesMedium');
  //   console.log('homeCoverSizesMedium', homeCoverSizesMedium?.clientWidth);
  //   // if (homeCoverSizesMedium) {
  //   //   homeCoverSizesMedium.style.height =
  //   //     currentWidthScreen >= 768 ? `${homeCoverSizesMedium?.clientWidth * 1.148886}px` : `750px`;
  //   // }
  // }, [currentWidthScreen]);

  const renderHeightPc = useMemo(() => {
    if (currentWidthScreen >= 1025) {
      return currentWidthScreen / 2.0125;
    }
    if (currentWidthScreen < 1025) {
      return null;
    }
    return 750;
  }, [currentWidthScreen]);

  return (
    <div
      className={classes.cover}
      // id="idHomeCoverSizesLarge"
      style={{
        height: renderHeightPc,
      }}>
      {currentWidthScreen >= 1025 && (
        <Image className={classes.customBackgroundPcImage} src={coverImageUrl} alt="" loading="lazy" unsized={true} />
      )}
      <div className={cx('container', classes.wrapSection1)}>
        <div className={classes.wrapCoverSection}>
          <h1 className={classes.homeCoverSiteTitle}>The definitive bike valuation platform and marketplace.</h1>
          <HomeSearchBar />
          {currentWidthScreen < 768 && (
            <Image className={classes.customBackgroundMobileImage} src={coverImageUrl} alt="" unsized priority />
          )}
        </div>
        {currentWidthScreen >= 768 && currentWidthScreen < 1025 && (
          <div className={classes.wrapBackground} id="idHomeCoverSizesMedium">
            <Image className={classes.customBackgroundTabletImage} src={coverImageUrl} alt="" unsized priority />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CoverSection);
