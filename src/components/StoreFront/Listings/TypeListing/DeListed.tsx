import React, { FC, useState, useCallback } from 'react';
import StoreState from 'model/store/index';
import cx from 'classnames';
import { formatDateUsa } from 'helpers/date.helper';
import { formatCurrency } from 'helpers/string.helper';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Button from 'components/ui/Buttons/Primary/Button';
import capitalize from 'lodash/capitalize';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import ListingItem from './ListingItem';
import classes from '../listing.module.scss';
import ModalReListing from '../Modal/ModalReListing';

const DeListed: FC = () => {
  const [modalDelete, showModalDelete] = useState<number>(null);
  const [modalRelist, showModalRelist] = useState<boolean>(false);
  const [listingChecked, setListing] = useState<ListingItemModel>(null);
  const listings = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.listListingOnlineStore);
  const isUserBBBStaff = useUserIsBBB();

  const openModalDelete = useCallback((id) => {
    showModalDelete(id);
  }, []);

  const openModalRelist = useCallback((listing: ListingItemModel) => {
    setListing(listing);
    showModalRelist(true);
  }, []);

  const renderActionsList = useCallback(
    (listing: ListingItemModel) => {
      const linkEditListing = listing.finished
        ? `/store-front/mylistings/edit/listed/${listing?.finished?.masterListingId}`
        : `/store-front/mylistings/edit/draft/${listing?.draft?.draftId}`;
      const id = listing?.finished?.masterListingId || listing?.draft?.draftId;
      if (isUserBBBStaff) {
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
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => openModalDelete(id)}>
                Delete
              </Button>
            </li>
          </>
        );
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
          <li>
            <Link href={linkEditListing}>
              <a className={classes.customLink}>Edit</a>
            </Link>
          </li>
          <li>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={classes.resizeBtn}
              onClick={() => openModalRelist(listing)}>
              Re-list
            </Button>
          </li>
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={() => openModalDelete(id)}>
              Delete
            </Button>
          </li>
        </>
      );
    },
    [isUserBBBStaff, openModalDelete, openModalRelist],
  );
  return (
    <>
      {listings?.data?.map((listing: ListingItemModel) => (
        <ListingItem
          imgDefault={listing?.imageDefault}
          key={listing.postingTime}
          listingContent={
            <>
              <Link
                href={'/marketplace/buy-now/[id]'}
                as={`/marketplace/buy-now/${listing?.finished?.masterListingId}`}>
                <a className={classes.nameListing}>{listing?.title}</a>
              </Link>
              <div style={{ marginBottom: 15 }}>
                <span className={classes.year}>{formatDateUsa(listing?.postingTime)}</span>
                <span className={classes.idListing}>ID {listing?.finished?.masterListingId}</span>
                {!isUserBBBStaff && <span className={classes.year}>Views {listing?.finished?.views || '-'}</span>}
                {isUserBBBStaff && <span className={classes.inventoryName}>{listing?.finished?.inventoryName}</span>}
              </div>
              <div className={classes.groupChips}>
                {listing?.finished?.sellerIsBBB && (
                  <span className={classes.chip}>
                    <span className={classes.titleChip}>Qty </span>
                    <span className={classes.contentChip}>{listing?.finished?.totalSold || 0}</span>
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
      <ModalReListing onClose={() => showModalRelist(false)} open={modalRelist} listingChecked={listingChecked} />
    </>
  );
};

export default DeListed;
