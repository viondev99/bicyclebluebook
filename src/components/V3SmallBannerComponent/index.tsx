import cx from 'classnames';
import config from 'config';
import { BANNER_SESSION } from 'constants/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { GetBannerPublishingResponse } from 'model/store/common.model';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBannerPublishing, getBannerPublishingSucceeded } from 'store/common/common.action';
import icArrowRightPrimary from '../../assets/img/finder-bike/ic_arrow_right_primary.svg';
import classes from './bannerDetailBike.module.scss';

dayjs.extend(utc);

interface Props {
  wrapSmallBanner?: string;
}

const V3SmallBannerComponent: FC<Props> = ({ wrapSmallBanner }) => {
  const dispatch = useDispatch();
  const bannerPublishingData = useSelector((store: StoreState) => store.common.bannerPublishing);
  const bannerPublishing = useMemo(() => {
    return Array.isArray(bannerPublishingData)
      ? bannerPublishingData.find((it) => it.size === 'small')
      : bannerPublishingData;
  }, [bannerPublishingData]);
  const { pathname } = useRouter();
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
    const checkPageDisplay = bannerPublishing && !bannerPublishing?.not_display_pages?.includes(formatPathname);
    if (checkPageDisplay && checkDate) {
      return true;
    }
    return false;
  }, [bannerPublishing, pathname]);

  const promoCodeUrl = useMemo(() => {
    if (bannerPublishing?.promo_url?.slice(0, 1) !== '/') {
      return `/${bannerPublishing?.promo_url}`;
    }
    return bannerPublishing?.promo_url;
  }, [bannerPublishing]);

  useEffect(() => {
    const bannerSesstion = checkExistLocalStorage() && sessionStorage?.getItem(BANNER_SESSION);
    const bannerCachedTimeConfig = config.BANNER_CACHE_TIME_SECOND || 0;

    if (bannerSesstion) {
      const {
        response: responseCached,
        createAt,
      }: {
        response: GetBannerPublishingResponse;
        createAt: string;
      } = JSON.parse(bannerSesstion);
      const date = new Date();
      const exp = dayjs(date).diff(createAt, 'second');
      if (responseCached && exp < bannerCachedTimeConfig) {
        dispatch(getBannerPublishingSucceeded(responseCached));
        const timeoutGetbanner = setTimeout(() => {
          sessionStorage.removeItem(BANNER_SESSION);
          dispatch(getBannerPublishing());
        }, (bannerCachedTimeConfig - exp) * 1000);
        return () => clearTimeout(timeoutGetbanner);
      }
      sessionStorage.removeItem(BANNER_SESSION);
    } else {
      dispatch(getBannerPublishing());
      const timeoutGetbanner = setTimeout(() => {
        sessionStorage.removeItem(BANNER_SESSION);
        dispatch(getBannerPublishing());
      }, bannerCachedTimeConfig * 1000);
      return () => clearTimeout(timeoutGetbanner);
    }
  }, [dispatch]);

  const renderPromoCode = useMemo(() => {
    if (bannerPublishing?.promo_description !== '') {
      return `Promo code “${bannerPublishing?.promo_description}”.`;
    }
    return '';
  }, [bannerPublishing]);

  return (
    <>
      {isShowBanner ? (
        <div className={cx(classes.smallBanner, wrapSmallBanner)}>
          {bannerPublishing?.title} <span className={classes.promoCode}>{renderPromoCode}</span>{' '}
          {renderPromoCode !== '' && (
            <span className={classes.linkShopName}>
              <Link href={promoCodeUrl}>
                <a className={classes.contentLink}>
                  {' '}
                  {bannerPublishing?.promo_text} <img src={icArrowRightPrimary} alt="" width="17.5px" height="11.5px" />
                </a>
              </Link>
            </span>
          )}
        </div>
      ) : null}
    </>
  );
};

export default V3SmallBannerComponent;
