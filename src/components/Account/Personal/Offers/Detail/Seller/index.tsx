import React, { useCallback, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ActionName } from 'constants/offer';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import StoreState from 'model/store';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import useScreenDetect from 'hooks/useScreenDetect';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from '../offer-detail.module.scss';
import ActivityItem from '../OfferActivity';
import OfferDetailSkeleton from '../OfferDetailSkeleton';

const OfferDetailSeller = () => {
  const { detailOfferBuyer, isStorefront } = useSelector((store: StoreState) => ({
    detailOfferBuyer: store.account.personal.offers.detailOfferBuyer,
    isStorefront: !!store.authenticate.user?.storefront,
  }));
  const loading = useSelector((store: StoreState) => store.account.personal.offers.loading);
  const mkpSellerLink = `/marketplace/seller/${detailOfferBuyer?.buyerId}`;
  const listOfferLink = !isStorefront ? '/account/offers/received' : '/store-front/offer-history';
  const haveAtLeastOneAutoAccept = useCallback((): boolean => {
    const check = detailOfferBuyer?.activities.filter((activity) => activity.action === ActionName.AUTO_ACCEPT);
    return check?.length > 0;
  }, [detailOfferBuyer]);
  const existAutoAccept = haveAtLeastOneAutoAccept();
  const isUserBBBStaff = useUserIsBBB();

  const renderSkeleton = useCallback((): ReactElement => {
    return <OfferDetailSkeleton />;
  }, []);

  const renderMobile = useMemo(() => {
    return (
      <div className={classes.wrapMobile}>
        <div className="d-flex">
          <div style={{ marginRight: 20 }} className={classes.chip}>
            <div className={classes.titleChip}>Price</div>
            <div className={classes.titleChip}>Originally Listed</div>
            <div className={classes.titleChip}>Qty</div>
            <div className={classes.titleChip}>Frame</div>
            {isUserBBBStaff && <div className={classes.titleChip}>Age</div>}
            {isUserBBBStaff && <div className={classes.titleChip}>INV</div>}
            <div className={classes.titleChip}>ID</div>
          </div>
          <div style={{ marginRight: 20 }} className={classes.chip}>
            <div className={classes.contentChip}>{formatCurrency(detailOfferBuyer?.currentOffer?.price)}</div>
            <div className={classes.contentChip}>{formatCurrency(detailOfferBuyer?.currentListedPrice)}</div>
            <div className={classes.contentChip}>{detailOfferBuyer?.quantity}</div>
            <div className={classes.contentChip}>{detailOfferBuyer?.frameSize}</div>
            {isUserBBBStaff && <div className={classes.contentChip}>{detailOfferBuyer?.listingAge || 0} days</div>}
            <div className={classes.contentChip}>
              <Link href={mkpSellerLink}>
                <a className={classes.resizeLink}>{detailOfferBuyer?.inventoryName || '-'}</a>
              </Link>
            </div>
            {isUserBBBStaff && <div className={classes.contentChip}>{detailOfferBuyer?.offerId}</div>}
          </div>
        </div>
      </div>
    );
  }, [detailOfferBuyer, isUserBBBStaff, mkpSellerLink]);

  const renderDetailOffer = useCallback((): ReactElement => {
    if (!loading && !detailOfferBuyer) {
      return <h1>Not found offer !</h1>;
    }
    return (
      <div className={classes.containerOfferDetail}>
        <div className={classes.headerOfferDetailMobile}>
          <Link href={listOfferLink}>
            <a className={classes.backToOffer}>
              <img src={icLeftArrowBlack} alt="arrow-left" /> Back
            </a>
          </Link>
        </div>
        <div className={classes.titleOfferDetail}>
          <span>{detailOfferBuyer?.title}</span>
          <div className={classes.headerOfferDetail}>
            <Link href={listOfferLink}>
              <a className={classes.backToOffer}>
                <img src={icLeftArrowBlack} alt="arrow-left" /> Back
              </a>
            </Link>
          </div>
        </div>
        <div className={classes.wrapChip}>
          <div className="d-flex">
            <div style={{ marginRight: 20 }} className={classes.chip}>
              <div className={classes.titleChip}>Price</div>
              <span className={classes.contentChip}>{formatCurrency(detailOfferBuyer?.currentOffer?.price)}</span>
            </div>
            <div style={{ marginRight: 20 }} className={classes.chip}>
              <div className={classes.titleChip}>Originally Listed</div>
              <span className={classes.contentChip}>{formatCurrency(detailOfferBuyer?.currentListedPrice)}</span>
            </div>
            <div style={{ marginRight: 20 }} className={classes.chip}>
              <div className={classes.titleChip}>Qty</div>
              <span className={classes.contentChip}>{detailOfferBuyer?.quantity}</span>
            </div>
            <div style={{ marginRight: 20 }} className={classes.chip}>
              <div className={classes.titleChip}>Frame</div>
              <span className={classes.contentChip}>{detailOfferBuyer?.frameSize}</span>
            </div>
            {isUserBBBStaff && (
              <div style={{ marginRight: 20 }} className={classes.chip}>
                <div className={classes.titleChip}>Age</div>
                <span className={classes.contentChip}>{detailOfferBuyer?.listingAge || 0} days</span>
              </div>
            )}
            {isUserBBBStaff && (
              <div style={{ marginRight: 20 }} className={classes.chip}>
                <div className={classes.titleChip}>INV</div>
                <span className={classes.contentChip}>
                  <Link href={mkpSellerLink}>
                    <a className={classes.resizeLink}>{detailOfferBuyer?.inventoryName || '-'}</a>
                  </Link>
                </span>
              </div>
            )}
            <div style={{ marginRight: 20 }} className={classes.chip}>
              <div className={classes.titleChip}>ID</div>
              <span className={classes.contentChip}>{detailOfferBuyer?.offerId}</span>
            </div>
          </div>
        </div>
        {renderMobile}
        {detailOfferBuyer?.activities?.map((activity, index: number) => (
          <ActivityItem
            activity={activity}
            existAutoAccept={existAutoAccept}
            isOfferFirst={index === 0}
            offerBy="seller"
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
  }, [loading, detailOfferBuyer, listOfferLink, mkpSellerLink, existAutoAccept]);
  return <>{loading ? renderSkeleton() : renderDetailOffer()}</>;
};

export default OfferDetailSeller;
