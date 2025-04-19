import React, { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { formatDateUsa } from 'helpers/date.helper';
import Link from 'next/link';
import { formatCurrency } from 'helpers/string.helper';
import { OfferActivitiesResponse, OfferActivities } from 'model/api/account/personal/offers.model';
import cx from 'classnames';
import Card from '@ui/Cards';
import classes from './offer-history.module.scss';

interface Props {
  offerActivities: OfferActivitiesResponse;
}

const TITLE_MODIFIED = {
  PendingMake: 'made you an offer',
  PendingMakeYou: 'made an offer',
  Countered: 'responded with a counter offer',
  Accepted: 'accepted this offer',
  Reject: 'rejected this offer',
  Complete: 'completed this offer',
  Remove: 'closed this offer',
  Expired: 'This offer is expired',
  Cancel: 'cancelled this offer',
  Auto_accept: 'This offer is accepted',
  Auto_Reject: 'This offer is rejected',
  Declined: 'This offer is declined',
};

const TITLE_NON_MODIFIED = {
  PendingMake: 'This offer is made',
  Countered: 'This offer is counter responded',
  Accepted: 'This offer is accepted!',
  Reject: 'This offer is rejected',
  Complete: 'This offer is completed',
  Remove: 'This offer is closed',
  Expired: 'This offer is expired',
  Cancel: 'This offer is cancelled',
  Auto_accept: 'This offer is accepted',
  Auto_Reject: 'This offer is rejected',
  Declined: 'This offer is declined',
};

const OfferHistory: FC<Props> = ({ offerActivities }) => {
  const { pathname } = useRouter();
  const renderTitle = useCallback(
    (activity: OfferActivities) => {
      if (activity.action === 'AUTO_ACCEPT' || activity.action === 'EXPIRED') {
        return;
      }
      const isSelf = activity.modifiedBy === offerActivities?.sellerUserId && offerActivities?.sellerStorefrontId;
      const link = isSelf
        ? `/marketplace/online-store/${offerActivities?.sellerStorefrontId}`
        : `/marketplace/seller/${activity.modifiedBy}`;
      return (
        <Link href={link}>
          <span>{activity.displayName} </span>
        </Link>
      );
    },
    [offerActivities],
  );

  const renderTitleDes = useCallback((activity: OfferActivities) => {
    const isModified = !!activity.modifiedBy;

    switch (activity.action) {
      case 'PENDING':
      case 'MAKE':
        if (isModified) {
          return TITLE_MODIFIED.PendingMake;
        }
        return TITLE_NON_MODIFIED.PendingMake;
      case 'COUNTER':
        if (isModified) {
          return TITLE_MODIFIED.Countered;
        }
        return TITLE_NON_MODIFIED.Countered;
      case 'ACCEPT':
        if (isModified) {
          return TITLE_MODIFIED.Accepted;
        }
        return TITLE_NON_MODIFIED.Accepted;
      case 'AUTO_ACCEPT':
        return TITLE_MODIFIED.Auto_accept;
      case 'REJECT':
        if (isModified) {
          if (activity && activity.modifiedByType) {
            return TITLE_MODIFIED.Reject;
          }
          return TITLE_MODIFIED.Auto_Reject;
        }
        return TITLE_NON_MODIFIED.Reject;
      case 'DECLINED':
        if (isModified) {
          return TITLE_MODIFIED.Declined;
        }
        return TITLE_NON_MODIFIED.Declined;
      case 'COMPLETE':
        if (isModified) {
          return TITLE_MODIFIED.Complete;
        }
        return TITLE_NON_MODIFIED.Declined;
      case 'REMOVE':
        if (isModified) {
          return TITLE_MODIFIED.Remove;
        }
        return TITLE_NON_MODIFIED.Remove;
      case 'EXPIRED':
        return TITLE_MODIFIED.Expired;
      case 'CANCEL':
        if (isModified) {
          return TITLE_MODIFIED.Cancel;
        }
        return TITLE_NON_MODIFIED.Cancel;
      default:
        return TITLE_MODIFIED.Auto_Reject;
    }
  }, []);
  const detailOfferLink = useMemo(() => {
    const currentOfferId = offerActivities?.currentOffer?.id;
    if (pathname?.includes('account/offers')) {
      return `/account/offers/detail-offer/${currentOfferId}`;
    }
    return `/store-front/offer-history/detail-offer/${currentOfferId}`;
  }, [offerActivities, pathname]);

  return (
    <Card className={classes.wrapHistory}>
      <div className={classes.title}>Offer History</div>
      {offerActivities?.activities?.map((activity: OfferActivities, index) => (
        <div key={String(index)} className={classes.historyItem}>
          <div className={classes.lineInfo}>
            <div className={classes.label}>
              {renderTitle(activity)} {renderTitleDes(activity)}
            </div>
            <div>{formatDateUsa(activity?.modifiedTime)}</div>
          </div>
          <div className={classes.lineInfo}>
            <div className={cx(classes.lineInfo, classes.chip)}>
              <div>Offer Price</div>
              <div className={classes.content}>{formatCurrency(activity?.amount)}</div>
            </div>
          </div>
          <div className={classes.lineInfo}>
            <div className={cx(classes.lineInfo, classes.chip)}>
              <div>Margin</div>
              <div className={classes.content}>{activity?.margin ? `${activity?.margin?.toFixed(0)}%` : '-'}</div>
            </div>
            {index + 1 === offerActivities?.activities?.length && (
              <div className={classes.view}>
                <Link
                  href={
                    pathname?.includes('account/offers')
                      ? '/account/offers/detail-offer/[id]'
                      : '/store-front/offer-history/detail-offer/[id]'
                  }
                  as={detailOfferLink}>
                  <a>View Details</a>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default OfferHistory;
