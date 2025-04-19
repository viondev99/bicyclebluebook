import React, { useCallback, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ActionName } from 'constants/offer';
import StoreState from 'model/store';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import classes from '../offer-detail.module.scss';
import ActivityItem from '../OfferActivity';
import OfferDetailSkeleton from '../OfferDetailSkeleton';

const OfferDetailBuyer = () => {
  const detailOfferBuyer = useSelector((store: StoreState) => store.account.personal.offers.detailOfferBuyer);
  const loading = useSelector((store: StoreState) => store.account.personal.offers.loading);
  const onlineStoreLink = `/marketplace/online-store/${detailOfferBuyer?.sellerStorefrontId}`;
  const mkpSellerLink = `/marketplace/seller/${detailOfferBuyer?.sellerUserId}`;

  const haveAtLeastOneAutoAccept = useCallback((): boolean => {
    const check = detailOfferBuyer?.activities.filter((activity) => activity.action === ActionName.AUTO_ACCEPT);
    return check?.length > 0;
  }, [detailOfferBuyer]);
  const existAutoAccept = haveAtLeastOneAutoAccept();

  const renderSkeleton = useCallback((): ReactElement => {
    return <OfferDetailSkeleton />;
  }, []);

  const renderDetailOffer = useCallback((): ReactElement => {
    if (!loading && !detailOfferBuyer) {
      return <h1>Not found offer !</h1>;
    }
    return (
      <div className={classes.containerOfferDetail}>
        <div className={classes.headerOfferDetailMobilePersonal}>
          <Link href="/account/offers/made">
            <a className={classes.backToOffer}>
              <img src={icLeftArrowBlack} alt="arrow-left" /> Back
            </a>
          </Link>
        </div>
        <div className={classes.titleOfferDetail}>
          <div>{detailOfferBuyer.title}</div>
          <div className={classes.headerOfferDetail}>
            <Link href="/account/offers/made">
              <a className={classes.backToOffer}>
                <img src={icLeftArrowBlack} alt="arrow-left" /> Back
              </a>
            </Link>
          </div>
        </div>
        <div className={classes.wrapChipPersonal}>
          <div className={classes.chip}>
            <span className={classes.titleChip}>Qty</span>
            <div className={classes.contentChip}>{detailOfferBuyer.quantity}</div>
          </div>
          <div className={classes.chip}>
            <span className={classes.titleChip}>Frame</span>
            <div className={classes.contentChip}>{detailOfferBuyer.frameSize}</div>
          </div>
          <div className={classes.chip}>
            <span className={classes.titleChip}>Offer ID</span>
            <div className={classes.contentChip}>{detailOfferBuyer.offerId}</div>
          </div>
          <div className={classes.chip}>
            <span className={classes.titleChip}>Seller</span>
            <div className={classes.contentChip}>
              <Link href={detailOfferBuyer?.sellerStorefrontId ? onlineStoreLink : mkpSellerLink}>
                <a className={classes.resizeLink}>{detailOfferBuyer.sellerName}</a>
              </Link>
            </div>
          </div>
        </div>
        {detailOfferBuyer?.activities?.map((activity, index: number) => (
          <ActivityItem
            activity={activity}
            existAutoAccept={existAutoAccept}
            offerBy="buyer"
            isOfferFirst={index === 0}
            buyerId={detailOfferBuyer?.buyerId}
            sellerName={detailOfferBuyer?.sellerName}
            buyerName={detailOfferBuyer?.buyerName}
            sellerStorefrontId={detailOfferBuyer?.sellerStorefrontId}
            sellerUserId={detailOfferBuyer?.sellerUserId}
            leftTimeExpire={detailOfferBuyer?.leftTimeExpire}
            key={activity.id}
          />
        ))}
      </div>
    );
  }, [detailOfferBuyer, existAutoAccept, loading, mkpSellerLink, onlineStoreLink]);
  return <>{loading ? renderSkeleton() : renderDetailOffer()}</>;
};

export default OfferDetailBuyer;
