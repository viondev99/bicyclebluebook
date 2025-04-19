import React, { FC, useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as listingActions from 'store/account/personal/listings/listings.action';
import Link from 'next/link';
import { formatCurrency, capitalizeFirstLetter, slugifyId } from 'helpers/string.helper';
import cx from 'classnames';
import { isNotDateExpired } from 'helpers/date.helper';
import bgBike from 'assets/img/trade-in/bg_bike.png';
import dayjs from 'dayjs';
import Card from '@ui/Cards/index';
import ContactBuyerModal from 'components/Contact/Modal/ContactBuyer';
import Button from '@ui/Buttons/Primary/Button';
import MenuCustom from '@ui/CustomMenu/index';
import { ListingItemModel } from 'model/api/account/personal/listings.model';
import { ShippingType } from 'model/common';
import { StageInventory } from 'model/store/common.model';
import { StatusMarketListing } from 'constants/marketplace';
import SafeImage from 'components/Image/SafeImage';
import classes from '../listings.module.scss';
import { UserInfoConsumer } from '../../../../../hooks/useUserInfo';

interface Props {
  listing: ListingItemModel;
}

const ListingItem: FC<Props> = ({ listing }) => {
  const {
    imageDefault,
    currentListedPrice,
    finished,
    postingTime,
    statusMessage,
    done,
    statusMarketListing,
    title,
  } = listing;
  const idListing = listing.done ? listing.done.masterListingId : listing.draft?.draftId;
  const [modalContactBuyerVisible, openModalContactBuyer] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showStatus = useCallback((): string => {
    if (statusMarketListing === StatusMarketListing.LISTED) {
      return statusMessage;
    }
    if (done?.sale) {
      if (done.sale.localPickup) {
        if (done?.stageInventory) {
          return done?.stageInventory === StageInventory.Sold
            ? 'Sold: Processing'
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
    return `Sold: ${capitalizeFirstLetter(done?.stageInventory)}`;
  }, [done, statusMarketListing, statusMessage]);

  const markAsPickup = useCallback(() => {
    dispatch(listingActions.markListingsAsShipped(done?.marketListingId));
  }, [dispatch, done]);

  const renderListMenu = useCallback(() => {
    const refundLink = `/account/order/${done?.sale?.orderId}/refund`;
    const sellSimilarLink = `/account/mylistings/sell-similar/${done?.masterListingId}/create`;
    const shipItemLink = `/marketplace/buy-now/${done?.masterListingId}`;
    const printLabelLink = `/marketplace/buy-now/${slugifyId(done?.bicycleName, done?.masterListingId)}`;
    const linkRefundDetail = `/account/return-detail/mylistings/${listing?.done?.masterListingId}/${listing?.done?.sale?.orderId}?inventory=${listing?.done?.sale?.inventoryId}&marketListing=${listing?.done?.marketListingId}`;
    const linkRefundListing = `/account/refund/mylistings/${listing?.done?.masterListingId}/${listing?.done?.sale?.orderId}?inventory=${listing?.done?.sale?.inventoryId}&marketListing=${listing?.done?.marketListingId}`;
    const linkCancelOrder = `/account/order/${done?.sale?.orderId}/seller-personal`;

    const allowPrintLabel =
      done?.sale?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE &&
      done?.stageInventory !== StageInventory.PickedUp &&
      done?.stageInventory !== StageInventory.AwaitingPickup;
    const allowShipItem =
      done?.sale?.shippingType === ShippingType.FLAT_RATE_TYPE &&
      done?.stageInventory !== StageInventory.ShippedToCustomer &&
      done?.stageInventory !== StageInventory.PickedUp &&
      done?.stageInventory !== StageInventory.AwaitingPickup;
    const allowMarkPickedUp = done?.sale?.localPickup && done?.stageInventory === StageInventory.AwaitingPickup;
    const allowRefundOrder =
      done?.sale?.orderId && done?.isAllowReturn && isNotDateExpired(done?.sale?.soldDateTime, done?.returnWithinDays);
    const allowRefundItem =
      done?.sale &&
      !done?.sale?.isRequestReturn &&
      done?.isAllowReturn &&
      isNotDateExpired(done?.sale?.soldDateTime, done?.returnWithinDays);
    const allowViewReturnRefund = done?.sale?.isRequestReturn;
    const allowCancelOrder =
      done?.sale &&
      done?.stageInventory !== StageInventory.ShippedToCustomer &&
      done?.stageInventory !== StageInventory.PickedUp;
    return (
      <>
        <li>
          <Link
            href={`/marketplace/buy-now/[id]`}
            as={`/marketplace/buy-now/${slugifyId(done?.bicycleName, done?.masterListingId)}`}>
            <a className={classes.customLink}>View Listing</a>
          </Link>
        </li>
        <li>
          <Link href={sellSimilarLink}>
            <a className={classes.customLink}>Sell similar</a>
          </Link>
        </li>
        {allowPrintLabel && (
          <li>
            <Link href={printLabelLink}>
              <a className={classes.customLink}>Print Label</a>
            </Link>
          </li>
        )}
        {allowShipItem && (
          <li>
            <Link href={shipItemLink}>
              <a className={classes.customLink}>Ship Item</a>
            </Link>
          </li>
        )}
        {allowMarkPickedUp && (
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={markAsPickup}>
              Mark as Picked up
            </Button>
          </li>
        )}
        {allowRefundOrder && (
          <li>
            <Link href={refundLink}>
              <a className={classes.customLink}>Refund this order</a>
            </Link>
          </li>
        )}
        {allowRefundItem && (
          <li>
            <Link href={linkRefundListing}>
              <a className={classes.btnMenu}>Refund this item</a>
            </Link>
          </li>
        )}
        {allowViewReturnRefund && (
          <li>
            <Link href={linkRefundDetail}>
              <a className={classes.customLink}> View Return / Refund Detail</a>
            </Link>
          </li>
        )}
        {allowCancelOrder && (
          <li>
            <Link href={linkCancelOrder}>
              <a className={classes.customLink}>Cancel Order</a>
            </Link>
          </li>
        )}
        <li>
          <Button
            buttonSize="s"
            buttonType="clear"
            onClick={() => openModalContactBuyer(true)}
            className={classes.resizeBtn}>
            Contact Buyer
          </Button>
        </li>
      </>
    );
  }, [done, listing, markAsPickup]);

  const isBuyerRequestCancel = useMemo(() => {
    if (listing?.done?.sale?.isCancelOrder) {
      return <div className={classes.isBuyerRequestCancel}>Buyer requested to cancel this order</div>;
    }
    return null;
  }, [listing]);
  return (
    <>
      <Card className={cx('row', classes.listingItem)}>
        <Link href={`/marketplace/buy-now/[id]`} as={`/marketplace/buy-now/${idListing}`}>
          <a className={cx('col-xs-12 col-sm-4', classes.imgListing)}>
            <SafeImage className={cx(classes.imageItemListing)} src={imageDefault || bgBike} alt="img default" />
          </a>
        </Link>
        <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
          <Link href={`/marketplace/buy-now/[id]`} as={`/marketplace/buy-now/${idListing}`}>
            <a className={classes.nameListing}>{title}</a>
          </Link>
          <div className={classes.nameYMB}>
            <span className={classes.time}>{postingTime ? dayjs(postingTime).format('DD MMM YYYY') : ''}</span>
            <span className={classes.idListing}> ID {idListing}</span>
            <br />
            <span className={classes.idOrder}>
              Order
              <Link href={`/account/order/[id]`} as={`/account/order/${done?.sale?.orderId}`}>
                <a>{done?.sale?.orderCode ? `#${done?.sale?.orderCode}` : '-'}</a>
              </Link>
            </span>
            <br />
            <span className={classes.customer}>
              Bought by{' '}
              <UserInfoConsumer id={done?.sale?.buyerId}>
                {(userInfo) => <>{userInfo?.displayName || done?.sale?.buyerDisplayName || '-'}</>}
              </UserInfoConsumer>
            </span>
          </div>
          <div className={classes.priceItem}>{formatCurrency(finished?.sale?.price || currentListedPrice)}</div>
          {isBuyerRequestCancel}
        </div>
        <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
          <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
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
      <ContactBuyerModal
        onClose={() => openModalContactBuyer(false)}
        image={listing?.imageDefault || ''}
        isOpen={modalContactBuyerVisible}
        orderId={listing?.done?.sale?.orderId || ''}
        buyerId={listing?.done?.sale?.buyerId || ''}
        masterListing={listing?.done?.masterListingId || null}
        listingTitle={listing?.title || ''}
        bikeName={listing?.done?.bicycleName || ''}
        invNames={[listing?.done?.inventoryName]}
      />
    </>
  );
};

export default ListingItem;
