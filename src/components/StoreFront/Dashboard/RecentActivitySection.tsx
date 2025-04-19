import React, { FC, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Pagination from '@ui/Pagination/Pagination';
import Link from 'next/link';
import dayjs from 'dayjs';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import images from 'assets/images';

import StoreState from 'model/store';
import {
  ActivityAgent,
  ActivityListingAction,
  ActivityOfferAction,
  ActivityShippingAction,
  ActivityMessageAction,
} from 'model/store/store-front/dashboard.model';
import { getStorefrontActivities } from 'store/store-front/dashboard/dashboard.action';
import Card from '@ui/Cards';
import useScreenDetect from 'hooks/useScreenDetect';
import { BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
import classes from './dashboard.module.scss';

const contents = {
  [ActivityAgent.MASTER_LISTING]: {
    [ActivityListingAction.CREATE]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was created',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.EDIT]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was edited',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.DELETED]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was deleted',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.RE_LIST]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was re-listed',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.RENEW]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was renewed',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.EXPIRED]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was expired',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.SOLD]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was sold',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.REVIEW]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was reviewed',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
  },
  [ActivityAgent.OFFER]: {
    [ActivityOfferAction.MAKE]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was created',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.COUNTER]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was countered',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.ACCEPT]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was accepted',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.CANCEL]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was canceled',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.REJECT]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was rejected',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.EXPIRED]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was expired',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.AUTO_ACCEPT]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was accepted automatically',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.COMPLETE]: {
      icon: images.dashboard.icOfferBlue,
      title: 'data.name was completed',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
    [ActivityOfferAction.REMOVE]: {
      icon: images.dashboard.icCartBlue,
      title: 'data.name removed from cart',
      href: '/store-front/offer-history/detail/[id]',
      as: '/store-front/offer-history/detail/[masterListingId]',
    },
  },
  [ActivityAgent.SHIPPING]: {
    [ActivityShippingAction.SHIPPED]: {
      icon: images.dashboard.icCartBlue,
      title: 'data.name was shipped',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
  },
  [ActivityAgent.MESSAGE]: {
    [ActivityMessageAction.MESSAGE]: {
      icon: images.dashboard.icMessageBlue,
      title: 'You have already received a new message',
      href: '/store-front/messages',
    },
  },
  [ActivityAgent.MARKET_LISTING]: {
    [ActivityListingAction.CREATE]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was created',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.EDIT]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was edited',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.DELETED]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was deleted',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.RE_LIST]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was re-listed',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.RENEW]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was renewed',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.EXPIRED]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was expired',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.SOLD]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was sold',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
    [ActivityListingAction.REVIEW]: {
      icon: images.dashboard.icListingBlue,
      title: 'data.name was reviewed',
      href: '/marketplace/buy-now/[id]',
      as: '/marketplace/buy-now/[masterListingId]',
    },
  },
};

interface Props {
  isMenu?: boolean;
}

const RecentActivitySection: FC<Props> = ({ isMenu }) => {
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const { activity } = useSelector((store: StoreState) => ({ activity: store.storeFront.dashboard.activity }));
  const { isSelectedStore } = useSelector((store: StoreState) => ({ isSelectedStore: store.common.isSelectedStore }));

  const [page, setPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const storeFront = checkExistLocalStorage() && localStorage.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  useEffect(() => {
    const payload = {
      page,
      pageSize: !isMenu ? 15 : 5,
      sort: 'date_created:-1',
      where: 'role:online_store',
      storefrontIds,
    };
    dispatch(getStorefrontActivities(payload));
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [page, dispatch, isMenu, storeFront, isSelectedStore]);

  const handleScroll = useCallback(() => {
    if (
      containerRef.current &&
      containerRef.current.scrollHeight > containerRef.current.clientHeight &&
      containerRef.current.scrollTop + containerRef.current.offsetHeight >= containerRef.current.scrollHeight &&
      page < activity.totalPage
    ) {
      setPage(page + 1);
    }
  }, [page, activity.totalPage]);

  const handleChangePage = useCallback((value: number) => {
    setPage(Number(value));
  }, []);

  const dataActivity = useMemo(() => {
    if (!isMenu) {
      return activity?.data;
    }
    if (currentWidthScreen >= 768) {
      return activity?.dataActivity;
    }
    return activity?.data;
  }, [activity, currentWidthScreen, isMenu]);

  const renderItemNotScroll = useCallback(() => {
    return (
      <div className={classes.recentActivityContainer} ref={containerRef}>
        {!dataActivity.length ? (
          <div className={classes.noActivity}>You have no recent activity</div>
        ) : (
          dataActivity?.map((item, index) => (
            <div
              className={classes.activity}
              key={item.id}
              style={{ marginBottom: index === activity.data.length - 1 ? 0 : 40 }}>
              <div className={classes.iconContainer}>
                <img src={get(contents, `${item.agent}.${item.action}.icon`, '')} alt="icon" />
              </div>
              <div className={classes.info}>
                <Link
                  href={get(contents, `${item.agent}.${item.action}.href`, '').replace(
                    '[id]',
                    `${item?.data.name
                      .split(' ')
                      ?.map((e) => e)
                      ?.join('-')}-${item?.master_listing}`,
                  )}
                  as={
                    get(contents, `${item.agent}.${item.action}.as`, '') && item.masterListing
                      ? get(contents, `${item.agent}.${item.action}.as`, '').replace(
                          '[masterListingId]',
                          item.masterListing,
                        )
                      : undefined
                  }>
                  <a className={classes.title}>
                    {get(contents, `${item.agent}.${item.action}.title`, '').replace('data.name', item.data.name)}
                  </a>
                </Link>
                <div className={classes.dateTime}>{dayjs(item.dateCreated).format('DD MMMM YYYY')}</div>
              </div>
            </div>
          ))
        )}
        {activity.loading && page < activity.totalPage && (
          <div className={classes.loadingContainer}>
            <img className={classes.loadingIcon} src={images.messages.icLoading} alt={'loading-icon'} />
          </div>
        )}
        {isMenu && dataActivity?.length > 0 && (
          <div className={classes.paging}>
            <Pagination onChangePage={handleChangePage} totalPage={activity.totalPage} page={+String(page || '')} />
          </div>
        )}
      </div>
    );
  }, [activity.data.length, activity.loading, activity.totalPage, dataActivity, handleChangePage, isMenu, page]);

  const renderItemScroll = useCallback(() => {
    return (
      <div className={classes.recentActivityContainer} ref={containerRef} onScroll={handleScroll}>
        {!dataActivity.length ? (
          <div className={classes.noActivity}>You have no recent activity</div>
        ) : (
          dataActivity?.map((item, index) => (
            <div
              className={classes.activity}
              key={item.id}
              style={{ marginBottom: index === activity.data.length - 1 ? 0 : 40 }}>
              <div className={classes.iconContainer}>
                <img src={get(contents, `${item.agent}.${item.action}.icon`, '')} alt="icon" />
              </div>
              <div className={classes.info}>
                <Link
                  href={get(contents, `${item.agent}.${item.action}.href`, '')}
                  as={
                    get(contents, `${item.agent}.${item.action}.as`, '') && item.masterListing
                      ? get(contents, `${item.agent}.${item.action}.as`, '').replace(
                          '[masterListingId]',
                          item.masterListing,
                        )
                      : undefined
                  }>
                  <a className={classes.title}>
                    {get(contents, `${item.agent}.${item.action}.title`, '').replace('data.name', item.data.name)}
                  </a>
                </Link>
                <div className={classes.dateTime}>{dayjs(item.dateCreated).format('DD MMMM YYYY')}</div>
              </div>
            </div>
          ))
        )}
        {!!activity.data.length && page < activity.totalPage && (
          <div className={classes.loadingContainer}>
            <img className={classes.loadingIcon} src={images.messages.icLoading} alt={'loading-icon'} />
          </div>
        )}
      </div>
    );
  }, [activity.data.length, activity.totalPage, dataActivity, handleScroll, page]);

  return (
    <div>
      <h3 className={classes.subTitle}>Recent Activities</h3>
      <Card
        className={cx(classes.recentActivityCard, {
          [classes.recentActivityCardMenu]: isMenu,
          [classes.recentActivityCardMobile]: currentWidthScreen < 768 && isMenu,
        })}>
        {!isMenu ? renderItemScroll() : currentWidthScreen >= 768 ? renderItemNotScroll() : renderItemScroll()}
      </Card>
    </div>
  );
};

export default RecentActivitySection;
