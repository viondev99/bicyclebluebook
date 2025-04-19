import React, { FC } from 'react';
import cx from 'classnames';
import StoreState from 'model/store/index';
import { formatDateUsa } from 'helpers/date.helper';
import Link from 'next/link';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { useSelector } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import ListingItem from './ListingItem';
import classes from '../listing.module.scss';

interface Props {}

const SalePending: FC<Props> = () => {
  const listings = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.listListingOnlineStore);
  const isUserBBBStaff = useUserIsBBB();
  return (
    <>
      {listings?.data?.map((listing: ListingItemModel) => (
        <ListingItem
          imgDefault={listing?.imageDefault}
          key={listing?.postingTime}
          listingContent={
            <>
              <Link
                href={'/marketplace/buy-now/[id]'}
                as={`/marketplace/buy-now/${slugifyId(listing?.title, listing?.finished?.masterListingId)}/`}>
                <a className={classes.nameListing}>{listing?.title}</a>
              </Link>
              <div style={{ marginBottom: 15 }}>
                <span className={classes.year}>{formatDateUsa(listing?.postingTime)}</span>
                <span>
                  <Link href={`/marketplace/buy-now/${slugifyId(listing?.title, listing?.finished?.masterListingId)}/`}>
                    <a className={classes.idListing}>ID {listing?.finished?.masterListingId}</a>
                  </Link>
                </span>
                {!isUserBBBStaff && <span className={classes.year}>Views {listing?.finished?.views || '-'}</span>}
                {isUserBBBStaff && <span className={classes.inventoryName}>{listing?.finished?.inventoryName}</span>}
              </div>
              <div className={classes.groupChips}>
                {listing?.finished?.sellerIsBBB && (
                  <span className={classes.chip}>
                    <span className={classes.titleChip}>Qty </span>
                    <span className={classes.contentChip}>{listing?.finished?.totalSalePending || 0}</span>
                  </span>
                )}
                {isUserBBBStaff && (
                  <>
                    <span className={classes.chip}>
                      <span className={classes.titleChip}>Margin </span>
                      <span className={classes.contentChip}>
                        {listing?.margin ? `${listing?.margin?.toFixed(0)} %` : '-'}
                      </span>
                    </span>
                    <span className={cx(classes.chip, classes.breakWhenMobile)}>
                      <span className={classes.titleChip}>Views </span>
                      <span className={classes.contentChip}>{listing?.finished?.views || '-'}</span>
                    </span>
                  </>
                )}
              </div>
              <div className={classes.priceItem}>{formatCurrency(listing?.currentListedPrice)}</div>
              {!!listing?.finished?.isAvailableAssembled && (
                <div className={classes.availableAssembled}>Available assembled</div>
              )}
            </>
          }
          listing={listing}
          statusListing={capitalize(listing?.statusMarketListing?.replace(/_/, ' '))}
          listMenu={null}
        />
      ))}
    </>
  );
};

export default SalePending;
