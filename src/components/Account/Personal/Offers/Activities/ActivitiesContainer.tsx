import React, { useCallback, ReactElement, useMemo } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import StoreState from 'model/store/index';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import classes from './offer-activities.module.scss';
import OfferParameter from './OfferParameter/index';
import OfferHistory from './OfferHistory/index';
import OfferSkeleton from '../Detail/OfferDetailSkeleton';

const OfferActivities = () => {
  const offerActivities = useSelector((store: StoreState) => store.account.personal.offers.offerActivities);
  const loading = useSelector((store: StoreState) => store.account.personal.offers.loading);
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const backToOfferLink = isStorefront ? '/store-front/offer-history' : '/account/offers/received';
  const isUserBBBStaff = useUserIsBBB();

  const renderSkeleton = useCallback((): ReactElement => {
    return <OfferSkeleton />;
  }, []);

  const renderInforItem = useMemo(() => {
    if (isUserBBBStaff) {
      return (
        <span className={classes.chip}>
          <span className={classes.labelChip}>Age</span>
          <span className={classes.contentChip}>{offerActivities?.listingAge || 0} days</span>
        </span>
      );
    }
  }, [isUserBBBStaff, offerActivities]);

  const renderOfferActivities = useCallback((): ReactElement => {
    if (!loading && !offerActivities) {
      return <h1>Not found offer !</h1>;
    }
    return (
      <div className={classes.containerOfferDetail}>
        <div className={classes.headerOfferDetail}>
          <div className={classes.titleDetail}>Offer Activity</div>
          <Link href={backToOfferLink}>
            <a className={classes.backToOffer}>
              <img src={icLeftArrowBlack} alt="arrow-left" /> Back to Offers
            </a>
          </Link>
        </div>
        <Link href={`/marketplace/buy-now/${slugifyId(offerActivities?.title, offerActivities?.masterListingId)}/`}>
          <a className={classes.bikeName}>{offerActivities?.title}</a>
        </Link>
        <div className={classes.containChips}>
          <span className={classes.chip}>
            <span className={classes.labelChip}>Listed Price</span>
            <span className={classes.contentChip}>{formatCurrency(offerActivities?.currentListedPrice)}</span>
          </span>
          {renderInforItem}
          <span className={classes.chip}>
            <span className={classes.labelChip}>Qty</span>
            <span className={classes.contentChip}>{offerActivities?.quantity}</span>
          </span>
          <span className={classes.chip}>
            <span className={classes.labelChip}>Frame</span>
            <span className={classes.contentChip}>{offerActivities?.frameSize}</span>
          </span>
          <span className={classes.chip}>
            <span className={classes.labelChip}>ID</span>
            <span className={classes.contentChip}>{offerActivities?.masterListingId}</span>
          </span>
        </div>
        <OfferParameter offerActivities={offerActivities} />
        <OfferHistory offerActivities={offerActivities} />
      </div>
    );
  }, [backToOfferLink, loading, offerActivities]);
  return <>{loading ? renderSkeleton() : renderOfferActivities()}</>;
};

export default OfferActivities;
