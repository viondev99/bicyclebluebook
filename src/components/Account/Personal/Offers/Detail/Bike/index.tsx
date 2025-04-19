import React, { useCallback, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUsersBasicInfo } from 'api/info.api';
import uniq from 'lodash/uniq';
import { toastError } from 'helpers/utils.helper';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { getListOfferBike } from 'store/account/personal/offers/offers.action';
import StoreState from 'model/store';
import { OfferBikeModal } from 'model/api/account/personal/offers.model';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import OfferDetailSkeleton from '../OfferDetailSkeleton';
import BikeCard from './BikeCard';
import classes from './offer-bike-detail.module.scss';

const DetailBikeOffer = () => {
  const [listPersonals, setListPersonals] = useState([]);
  const listBikeOffers = useSelector((store: StoreState) => store.account.personal.offers.listBikeOffers);
  const detailBikeOffers = useSelector((store: StoreState) => store.account.personal.offers.detailBikeOffers);
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const loading = useSelector((store: StoreState) => store.account.personal.offers.loading);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();
  const mkpLink = `/marketplace/buy-now/${slugifyId(detailBikeOffers?.title, detailBikeOffers?.masterListingId)}/`;
  const backToOfferLink = isStorefront ? '/store-front/offer-history' : '/account/offers/received';
  useEffect(() => {
    dispatch(
      getListOfferBike({
        id: query.id,
        sortFile: 'LAST_UPDATE',
        sortType: 'DESC',
      }),
    );
  }, [dispatch, query.id]);
  useEffect(() => {
    if (listBikeOffers?.length > 0) {
      const listUserIds: string[] = [];
      const list = listBikeOffers?.forEach((item) => {
        listUserIds.push(item?.buyerId);
      });
      if (listUserIds?.length > 0) {
        const request = getUsersBasicInfo(uniq(listUserIds));
        request
          .then((res) => {
            setListPersonals(res);
          })
          .catch(toastError);
      }
    }
  }, [listBikeOffers]);

  const renderSkeleton = useCallback((): ReactElement => {
    return <OfferDetailSkeleton />;
  }, []);
  const renderDetailBike = useCallback((): ReactElement => {
    if (!loading && !listBikeOffers) {
      return <h1>Not found offer !</h1>;
    }
    return (
      <div className={classes.containerOfferDetail}>
        <div className={classes.headerOfferDetail}>
          <div className={classes.titleDetail}>All Offers for</div>
          <Link href={backToOfferLink}>
            <a className={classes.backToOffer}>
              <img src={icLeftArrowBlack} alt="arrow-left" /> Back to Offers
            </a>
          </Link>
        </div>
        <div className={classes.titleOfferDetail}>
          <Link href={mkpLink}>
            <a>{detailBikeOffers?.title}</a>
          </Link>
        </div>
        <div className={classes.wrapChip}>
          <span className={classes.currentPrice}>{formatCurrency(detailBikeOffers?.currentListedPrice)}</span>
          <span className={classes.quantity}>{listBikeOffers?.length} available</span>
        </div>
        {listBikeOffers?.map((bikeOffer: OfferBikeModal) => (
          <BikeCard bikeOffer={bikeOffer} key={bikeOffer.id} listPersonals={listPersonals} />
        ))}
      </div>
    );
  }, [backToOfferLink, detailBikeOffers, listBikeOffers, listPersonals, loading, mkpLink]);
  return <>{loading ? renderSkeleton() : renderDetailBike()}</>;
};

export default DetailBikeOffer;
