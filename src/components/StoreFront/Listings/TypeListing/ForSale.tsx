import React, { FC, useState, useCallback } from 'react';
import cx from 'classnames';
import StoreState from 'model/store/index';
import { formatDateUsa } from 'helpers/date.helper';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { useSelector } from 'react-redux';
import capitalize from 'lodash/capitalize';
import Link from 'next/link';
import Button from 'components/ui/Buttons/Primary/Button';
import { StageInventory } from 'model/store/common.model';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import ListingItem from './ListingItem';
import classes from '../listing.module.scss';

interface Props {}

const ForSale: FC<Props> = () => {
  const [modalDelete, showModalDelete] = useState<number>(null);
  const listings = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.listListingOnlineStore);
  const isUserBBBStaff = useUserIsBBB();

  const openModalDelete = useCallback((id) => {
    showModalDelete(id);
  }, []);

  const renderActionsList = useCallback(
    (listing: ListingItemModel) => {
      const linkEditListing = listing.finished
        ? `/store-front/mylistings/edit/listed/${listing?.finished?.masterListingId}`
        : `/store-front/mylistings/edit/draft/${listing?.draft?.draftId}`;
      const id = listing?.finished?.masterListingId || listing?.draft?.draftId;
      if (!listing?.statusMarketListing) {
        return null;
      }
      return (
        <>
          {!!listing?.finished?.masterListingId && (
            <li>
              <Link
                href={'/marketplace/buy-now/[id]'}
                as={`/marketplace/buy-now/${listing?.finished?.masterListingId}`}>
                <a className={classes.customLink}>View</a>
              </Link>
            </li>
          )}
          {listing?.finished?.typeInventoryName === StageInventory.PTP && (
            <li>
              <Link href={linkEditListing}>
                <a className={classes.customLink}>Edit</a>
              </Link>
            </li>
          )}

          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={() => openModalDelete(id)}>
              Delete
            </Button>
          </li>
        </>
      );
    },
    [openModalDelete],
  );
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
                    <span className={classes.contentChip}>{listing?.finished?.totalForSale || 0}</span>
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
          listMenu={renderActionsList(listing)}
          closeModalDelete={() => showModalDelete(null)}
          openDelete={modalDelete === (listing?.finished?.masterListingId || listing?.draft?.draftId)}
        />
      ))}
    </>
  );
};

export default ForSale;
