/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import CONFIG from 'config';
import Button from '@ui/Buttons/Primary/Button';
import StoreState from 'model/store';
import { toastSuccess } from 'helpers/utils.helper';
import Container from 'reactstrap/lib/Container';
import classes from './intro-section.module.scss';

const imgBecomePartnerBg = `${CONFIG.IMAGE_CDN_URL}/img_become_partner_bg.webp`;
const imgBecomePartnerBgTablet = `${CONFIG.IMAGE_CDN_URL}/img_become_partner_bg_tablet.png`;

const IntroSection = () => {
  const { currentWidthScreen } = useScreenDetect();
  const isPartner = useSelector((store: StoreState) => !!store.authenticate.user?.partner);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  useEffect(() => {
    const _coverImg =
      currentWidthScreen >= 1025
        ? imgBecomePartnerBg
        : currentWidthScreen >= 768
        ? imgBecomePartnerBgTablet
        : imgBecomePartnerBgTablet;
    setCoverImageUrl(_coverImg);
  }, [currentWidthScreen]);

  useEffect(() => {
    const homeCoverSizesLarge = document.getElementById('idHomeCoverSizesLarge');
    if (homeCoverSizesLarge) {
      homeCoverSizesLarge.style.height =
        currentWidthScreen >= 1025 ? `${homeCoverSizesLarge?.clientWidth / 2.617}px` : `unset`;
    }
  }, [currentWidthScreen]);

  const showMessage = useCallback(() => {
    toastSuccess('You are ready to be a partner.');
  }, []);

  return (
    <section
      className={classes.cover}
      id="idHomeCoverSizesLarge"
      style={{
        backgroundImage: currentWidthScreen >= 1025 && `url(${coverImageUrl})`,
      }}>
      <Container className={classes.container}>
        <div className={cx(classes.wrapSection1)}>
          <div className={classes.wrapTitileAndBtn}>
            <div>
              <h1 className={classes.titleFirst}>Join the trade in partner network.</h1>
              <p className={classes.titleSecond}>
                Drive business to new heights and become a Bicycle Blue Book trade in partner.
              </p>
              {isPartner ? (
                <Button className={classes.btnBecome} onClick={showMessage}>
                  Become a Partner
                </Button>
              ) : (
                <Link href="/register/trade-in-partner">
                  <Button className={classes.btnBecome}>Become a Partner</Button>
                </Link>
              )}
              {/* </div> */}
            </div>
            {currentWidthScreen < 768 && (
              <img className={classes.customBackgroundMobileImage} src={coverImageUrl} alt="" />
            )}
          </div>
          {currentWidthScreen >= 768 && currentWidthScreen < 1025 && (
            <div className={classes.wrapBackground}>
              <img className={classes.customBackgroundTabletImage} src={coverImageUrl} alt="" />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default IntroSection;
