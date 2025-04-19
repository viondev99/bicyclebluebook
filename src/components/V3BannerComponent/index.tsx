import React, { FC, useCallback, useMemo } from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import classes from './banner.module.scss';
import icRightArrowWhite from '../../assets/img/trade-in/ic_right_arrow_white.svg';

dayjs.extend(utc);

interface Props {
  customWrapBanner?: string;
}

const V3BannerComponent: FC<Props> = ({ customWrapBanner }) => {
  const bannerPublishingData = useSelector((store: StoreState) => store.common.bannerPublishing);
  const bannerPublishing = useMemo(() => {
    return Array.isArray(bannerPublishingData)
      ? bannerPublishingData.find((it) => it.size === 'large')
      : bannerPublishingData;
  }, [bannerPublishingData]);
  const { pathname } = useRouter();
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  const isShowBanner = useMemo(() => {
    let formatPathname = '';
    if (pathname === '/') {
      formatPathname = 'homepage';
    } else if (pathname.includes('/trade-in-account')) {
      formatPathname = 'partner_portal';
    } else if (pathname.includes('/marketplace')) {
      formatPathname = 'marketplace';
    } else if (pathname.includes('/value-guide')) {
      formatPathname = 'valueguide';
    } else if (pathname.includes('/sell-tradein')) {
      formatPathname = 'sell_trade';
    } else if (pathname.includes('/articles')) {
      formatPathname = 'articles';
    }
    const checkDate =
      bannerPublishing &&
      dayjs(bannerPublishing?.publishes_from).local().unix() < dayjs().local().unix() &&
      dayjs().local().unix() < dayjs(bannerPublishing?.publishes_to).local().unix();
    const checkPageDisplay = bannerPublishing && bannerPublishing?.display_pages?.includes(formatPathname);
    if (checkPageDisplay && checkDate) {
      return true;
    }
    return false;
  }, [bannerPublishing, pathname]);

  const gotoPage = useCallback(() => {
    router.push(`${bannerPublishing?.promo_url}`);
  }, [bannerPublishing, router]);

  const renderPC = useMemo(() => {
    return (
      <div className={classes.wrapBanner}>
        <div className={classes.wrapLeft}>
          <div className={classes.text46}>{bannerPublishing?.title || ''}</div>
          <div className={classes.text22}>{bannerPublishing?.description || ''}</div>
        </div>
        <div className={classes.wrapRight}>
          <div className={classes.wrapAvatar}>
            <span className={classes.text24}>{bannerPublishing?.text_in_circle || ''}</span>
          </div>
          <div className={classes.wrapContentRight}>
            <div className={cx(classes.text22, classes.mb24)}>{bannerPublishing?.promo_description || ''}</div>
            {bannerPublishing?.promo_text !== '' && (
              <div className={classes.wrapLink} onClick={gotoPage}>
                <span className={classes.text30}>{bannerPublishing?.promo_text || ''}</span>
                <img src={icRightArrowWhite} alt="arrow-right" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [bannerPublishing, gotoPage]);

  const renderMobile = useMemo(() => {
    return (
      <div className={classes.wrapBannerMobile}>
        <div className={classes.wrapMobileLeft}>
          <div className={classes.text46}>{bannerPublishing?.title || ''}</div>
          <div className={classes.text22} style={{ marginBottom: '50px' }}>
            {bannerPublishing?.description || ''}
          </div>
          {bannerPublishing?.promo_text !== '' && (
            <div className={classes.wrapLink} onClick={gotoPage}>
              <span className={classes.text30}>{bannerPublishing?.promo_text || ''}</span>
              <img src={icRightArrowWhite} alt="arrow-right" />
            </div>
          )}
          <div className={classes.text22}>{bannerPublishing?.promo_description || ''}</div>
        </div>

        <div className={classes.wrapAvatar}>
          <span className={classes.text24}>{bannerPublishing?.text_in_circle || ''}</span>
        </div>
      </div>
    );
  }, [bannerPublishing, gotoPage]);
  return (
    <>
      {isShowBanner ? (
        <Container className={cx(classes.container, customWrapBanner)}>
          {currentWidthScreen > 767 ? renderPC : renderMobile}
        </Container>
      ) : null}
    </>
  );
};

export default V3BannerComponent;
