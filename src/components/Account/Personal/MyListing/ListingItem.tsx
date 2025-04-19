import React, { FC, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import Modal from '@ui/Modal/Modal';
import * as listingActions from 'store/account/personal/listings/listings.action';
import { formatCurrency, capitalizeFirstLetter } from 'helpers/string.helper';
import cx from 'classnames';
import bgBike from 'assets/img/trade-in/bg_bike.png';
import MenuCustom from '@ui/CustomMenu';
import dayjs from 'dayjs';
import Card from '@ui/Cards/index';
import Button from '@ui/Buttons/Primary/Button';
import { ListingItemModel, DeleteListingPayload } from 'model/api/account/personal/listings.model';
import { ShippingType } from 'model/common';
import { StageInventory } from 'model/store/common.model';
import { StatusMarketListing } from 'constants/marketplace';
import SafeImage from 'components/Image/SafeImage';
import MenuActions from './MenuActions';
import classes from './listings.module.scss';

interface Props {
  listing: ListingItemModel;
}

const ListingItem: FC<Props> = ({ listing }) => {
  const {
    imageDefault,
    currentListedPrice,
    postingTime,
    statusMessage,
    done,
    draft,
    statusMarketListing,
    title,
  } = listing;
  const idListing = listing?.done ? listing?.done?.masterListingId : listing.draft?.draftId;
  const nameBicycle = listing?.done ? listing?.done?.bicycleName : listing.draft?.content?.bicycleName;

  const urlToMarketPlace = useMemo(() => {
    if (!nameBicycle || nameBicycle === '') {
      return idListing;
    }
    return `${nameBicycle}-${idListing}`;
  }, [idListing, nameBicycle]);

  const viewListing = listing?.done ? listing?.done?.views : 0;
  const [modalDelete, openModalDelete] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showStatus = useCallback((): string => {
    if (statusMarketListing === StatusMarketListing.LISTED) {
      return statusMessage;
    }
    if (done?.sale) {
      if (done?.sale?.localPickup) {
        if (done?.stageInventory) {
          return done?.stageInventory === StageInventory.Sold
            ? 'Sold'
            : `Sold: ${capitalizeFirstLetter(done?.stageInventory)}`;
        }
        return 'n/a';
      }
      if (done?.sale?.shippingType === ShippingType.FLAT_RATE_TYPE) {
        switch (done?.stageInventory) {
          case StageInventory.Sold:
            return 'Sold: Processing';
          case StageInventory.Processing:
            return 'Sold: Processing';
          case StageInventory.ShippedToCustomer:
            return 'Sold: Shipped to customer';
          case StageInventory.ReceivedByCustomer:
            return 'Sold: Shipped to customer';
          default:
            break;
        }
      }
      if (done?.sale?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE) {
        switch (done?.stageInventory) {
          case StageInventory.Processing:
            return 'Sold: Processing';
          case StageInventory.Sold:
            return 'Sold: Processing';
          case StageInventory.ShippedToCustomer:
            return 'Sold: Shipped to customer';
          case StageInventory.ReceivedByCustomer:
            return 'Sold';
          default:
            break;
        }
      }
    }
    return statusMessage;
  }, [done, statusMarketListing, statusMessage]);

  const handleDeleteListing = useCallback(() => {
    const bodyParams: DeleteListingPayload = { idDelete: null, isDraft: false };
    if (draft) {
      bodyParams.idDelete = String(draft.draftId);
      bodyParams.isDraft = true;
    } else {
      bodyParams.idDelete = String(done?.masterListingId);
    }
    dispatch(listingActions.deleteListings(bodyParams));
    openModalDelete(false);
  }, [dispatch, done, draft]);
  const onCloseModal = () => {
    openModalDelete(false);
  };

  const renderTitle = useMemo(() => {
    if (draft?.draftId) {
      return <a className={classes.noLink}>{title}</a>;
    }
    return (
      <Link href={`/marketplace/buy-now/[id]`} as={`/marketplace/buy-now/${urlToMarketPlace}`}>
        <a className={classes.nameListing}>{title}</a>
      </Link>
    );
  }, [draft, title, urlToMarketPlace]);

  const renderImage = useMemo(() => {
    if (draft?.draftId) {
      return (
        <SafeImage
          className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}
          src={imageDefault || bgBike}
          alt="img default"
        />
      );
    }
    return (
      <Link href={`/marketplace/buy-now/[id]`} as={`/marketplace/buy-now/${urlToMarketPlace}`}>
        <a className={cx('col-xs-12 col-sm-4', classes.imgListing)}>
          <SafeImage className={cx(classes.imageItemListing)} src={imageDefault || bgBike} alt="img default" />
        </a>
      </Link>
    );
  }, [draft, imageDefault, urlToMarketPlace]);

  return (
    <>
      <Card className={cx('row', classes.listingItem)}>
        {renderImage}
        <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
          {renderTitle}
          <div className={classes.nameYMB}>
            {postingTime ? dayjs(postingTime).format('DD MMM YYYY') : ''}
            <span className={classes.idListing}> ID {idListing}</span>
            {listing?.done ? <span className={classes.viewListing}>Views {viewListing}</span> : null}
          </div>
          <div className={classes.priceItem}>{formatCurrency(currentListedPrice)}</div>
        </div>
        <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
          <MenuCustom
            classMenuContent={classes.customMenu}
            listMenu={<MenuActions listing={listing} handleOpenModal={() => openModalDelete(true)} />}
          />
          <div
            className={cx(classes.defaultStatus, {
              [classes.isActive]: statusMarketListing === StatusMarketListing.LISTED,
              [classes.draft]: statusMarketListing === StatusMarketListing.DRAFT,
              [classes.expired]: statusMarketListing === StatusMarketListing.EXPIRED,
            })}>
            {showStatus()}
          </div>
        </div>
      </Card>
      <Modal
        centered={true}
        isOpen={modalDelete}
        title="Remove Listing"
        className={classes.resizeModal}
        onClose={onCloseModal}>
        <>
          <div className={classes.contentModal}>
            Are you sure you want to remove this listing?
            <br /> This cannot be undone.
          </div>
          <div className={classes.footerModelDeactivate}>
            <Button buttonType="danger" className={classes.btnDelete} onClick={() => handleDeleteListing()}>
              Remove Listings
            </Button>
            <Button buttonType="outline" className={classes.btnCancel} onClick={onCloseModal}>
              Cancel
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default ListingItem;
