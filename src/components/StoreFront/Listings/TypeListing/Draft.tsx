import React, { FC, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import StoreState from 'model/store/index';
import { formatDateUsa } from 'helpers/date.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { finishDraftListing } from 'api/store-front/listings.api';
import { formatCurrency } from 'helpers/string.helper';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Button from 'components/ui/Buttons/Primary/Button';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import ListingItem from './ListingItem';
import classes from '../listing.module.scss';

interface Props {}

const Draft: FC<Props> = () => {
  const [modalDelete, showModalDelete] = useState<number>(null);
  const listings = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.listListingOnlineStore);
  const router = useRouter();

  const openModalDelete = useCallback((id) => {
    showModalDelete(id);
  }, []);
  const handlePublishItem = useCallback(
    (listing: ListingItemModel) => {
      finishDraftListing(listing?.draft?.draftId)
        .then(() => {
          router.replace({
            pathname: router.pathname,
            query: router.query,
          });
          toastSuccess('Publish successfully');
        })
        .catch(toastError);
    },
    [router],
  );

  const renderActionsList = useCallback(
    (listing: ListingItemModel) => {
      const linkEditListing = listing.finished
        ? `/store-front/mylistings/edit/listed/${listing?.finished?.masterListingId}`
        : `/store-front/mylistings/edit/draft/${listing?.draft?.draftId}`;
      const id = listing?.finished?.masterListingId || listing?.draft?.draftId;
      return (
        <>
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
              onClick={() => handlePublishItem(listing)}>
              Publish
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
    [handlePublishItem, openModalDelete],
  );
  return (
    <>
      {listings?.data?.map((listing: ListingItemModel) => (
        <ListingItem
          imgDefault={listing?.imageDefault}
          key={listing?.postingTime}
          isDraft={true}
          listingContent={
            <>
              <div className={cx(classes.nameListing, classes.noLink)}>{listing?.title}</div>
              <div style={{ marginBottom: 15 }}>
                <span className={classes.year}>{formatDateUsa(listing?.postingTime)}</span>
                {/* <span>
                  <a className={classes.idListing}>ID {listing?.finished?.masterListingId}</a>
                </span> */}
              </div>
              {/* <div className={classes.groupChips}>
                <span className={classes.chip}>
                  <span className={classes.titleChip}>Qty </span>
                  <span className={classes.contentChip}>{listing?.finished?.totalForSale || 0}</span>
                </span>
                <span className={classes.chip}>
                  <span className={classes.titleChip}>Margin </span>
                  <span className={classes.contentChip}>
                    {listing?.margin ? `${listing?.margin?.toFixed(0)} %` : '-'}
                  </span>
                </span>
                <span className={cx(classes.chip, classes.breakWhenMobile)}>
                  <span className={classes.titleChip}>View </span>
                  <span className={classes.contentChip}>{listing?.finished?.views || '-'}</span>
                </span>
              </div> */}
              <div className={classes.priceItem}>{formatCurrency(listing?.currentListedPrice)}</div>
              {!!listing?.finished?.isAvailableAssembled && (
                <div className={classes.availableAssembled}>Available assembled</div>
              )}
            </>
          }
          listing={listing}
          statusListing={listing?.statusMarketListing}
          listMenu={renderActionsList(listing)}
          closeModalDelete={() => showModalDelete(null)}
          openDelete={modalDelete === (listing?.finished?.masterListingId || listing?.draft?.draftId)}
        />
      ))}
    </>
  );
};

export default Draft;
