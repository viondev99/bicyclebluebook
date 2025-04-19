import React, { useMemo, useEffect, useCallback } from 'react';
import Switch from 'components/ui/Switch/Switch';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Card from '@ui/Cards';
import concat from 'lodash/concat';
import differenceBy from 'lodash/differenceBy';
import classes from './setting-notification.module.scss';
import {
  getNotificationSetting,
  updateNotificationSetting,
} from '../../../store/account/personal/notification/notification.action';
import {
  WishlistMailKey,
  SpecialOfferMailKey,
  OfferMailKey,
  ItemMailKey,
  MessageMailKey,
  WISHLIST_MAIL_KEYS,
  SPECIAL_OFFER_MAIL_KEYS,
  OFFER_MAIL_KEYS,
  ITEM_MAIL_KEYS,
  MESSAGE_MAIL_KEYS,
} from '../../../model/store/account/personal/notification.model';

const SettingNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { detail } = useSelector((store: StoreState) => ({
    detail: store.account.personal.notification.detail,
  }));

  const wishlist = useMemo(() => {
    return !detail?.mailConfig?.mailKey?.filter((item) => !!WISHLIST_MAIL_KEYS.includes(item as WishlistMailKey))
      ?.length;
  }, [detail]);

  const specialOffer = useMemo(() => {
    return !detail?.mailConfig?.mailKey?.filter(
      (item) => !!SPECIAL_OFFER_MAIL_KEYS.includes(item as SpecialOfferMailKey),
    )?.length;
  }, [detail]);

  const statusOffer = useMemo(() => {
    return !detail?.mailConfig?.mailKey?.filter((item) => !!OFFER_MAIL_KEYS.includes(item as OfferMailKey))?.length;
  }, [detail]);

  const listing = useMemo(() => {
    return !detail?.mailConfig?.mailKey?.filter((item) => !!ITEM_MAIL_KEYS.includes(item as ItemMailKey))?.length;
  }, [detail]);

  const message = useMemo(() => {
    return !detail?.mailConfig?.mailKey?.filter((item) => !!MESSAGE_MAIL_KEYS.includes(item as MessageMailKey))?.length;
  }, [detail]);

  useEffect(() => {
    dispatch(getNotificationSetting());
  }, [dispatch]);

  const toggleSwitchWishlist = useCallback(() => {
    const payload = {
      newMasterListing: detail?.newMasterListing || '',
      mailKey: !wishlist
        ? differenceBy(detail?.mailConfig?.mailKey || [], WISHLIST_MAIL_KEYS) || []
        : concat(detail?.mailConfig?.mailKey || [], WISHLIST_MAIL_KEYS),
    };
    dispatch(updateNotificationSetting(payload));
  }, [wishlist, detail, dispatch]);

  const toggleSwitchSpecialOffer = useCallback(() => {
    const payload = {
      newMasterListing: detail?.newMasterListing || '',
      mailKey: !specialOffer
        ? differenceBy(detail?.mailConfig?.mailKey || [], SPECIAL_OFFER_MAIL_KEYS)
        : concat(detail?.mailConfig?.mailKey || [], SPECIAL_OFFER_MAIL_KEYS),
    };
    dispatch(updateNotificationSetting(payload));
  }, [specialOffer, detail, dispatch]);

  const toggleSwitchStatusOffer = useCallback(() => {
    const payload = {
      newMasterListing: detail?.newMasterListing || '',
      mailKey: !statusOffer
        ? differenceBy(detail?.mailConfig?.mailKey || [], OFFER_MAIL_KEYS)
        : concat(detail?.mailConfig?.mailKey || [], OFFER_MAIL_KEYS),
    };
    dispatch(updateNotificationSetting(payload));
  }, [statusOffer, detail, dispatch]);

  const toggleSwitchListing = useCallback(() => {
    const payload = {
      newMasterListing: detail?.newMasterListing || '',
      mailKey: !listing
        ? differenceBy(detail?.mailConfig?.mailKey || [], ITEM_MAIL_KEYS)
        : concat(detail?.mailConfig?.mailKey || [], ITEM_MAIL_KEYS),
    };
    dispatch(updateNotificationSetting(payload));
  }, [listing, detail, dispatch]);

  const toggleSwitchMessage = useCallback(() => {
    const payload = {
      newMasterListing: detail?.newMasterListing || '',
      mailKey: !message
        ? differenceBy(detail?.mailConfig?.mailKey || [], MESSAGE_MAIL_KEYS)
        : concat(detail?.mailConfig?.mailKey || [], MESSAGE_MAIL_KEYS),
    };
    dispatch(updateNotificationSetting(payload));
  }, [message, detail, dispatch]);

  return (
    <>
      <div className={classes.description}>
        Turn on or off the email notifications you would or would not like to receive from us.
      </div>
      <Card>
        <div className={classes.notificationSetting}>
          <div className={classes.headerForm}>
            <div className={classes.subTitle}>
              Turn on or off the email notifications you would or would not like to receive from us.
            </div>
          </div>
          <div className={classes.wrapperInput}>
            <div className={classes.label}>When an item on my wishlist becomes available</div>
            <Switch checked={wishlist} onChange={toggleSwitchWishlist} />
          </div>
          <div className={classes.wrapperInput}>
            <div className={classes.label}>Special offers and updates</div>
            <Switch checked={specialOffer} onChange={toggleSwitchSpecialOffer} />
          </div>
          <div className={classes.wrapperInput}>
            <div className={classes.label}>When an offer is accepted, rejected, or countered</div>
            <Switch checked={statusOffer} onChange={toggleSwitchStatusOffer} />
          </div>
          <div className={classes.wrapperInput}>
            <div className={classes.label}>When an item I am listing is sold</div>
            <Switch checked={listing} onChange={toggleSwitchListing} />
          </div>
          <div className={classes.wrapperInput}>
            <div className={classes.label}>When I receive new messages</div>
            <Switch checked={message} onChange={toggleSwitchMessage} />
          </div>
        </div>
      </Card>
    </>
  );
};

export default SettingNotification;
