import React, { FC, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { isNotDateExpired } from 'helpers/date.helper';
import cx from 'classnames';
import { markListingsAsShipped, patchReListSoldListing } from 'store/account/personal/listings/listings.action';
import Button from '@ui/Buttons/Primary/Button';
import { ListingItemModel } from 'model/api/account/personal/listings.model';
import { slugifyId } from 'helpers/string.helper';
import { StatusMarketListing } from 'constants/marketplace';
import { StageInventory } from 'model/store/common.model';
import { ShippingType } from 'model/common';
import classes from './listings.module.scss';

interface Props {
  listing: ListingItemModel;
  handleOpenModal: () => void;
}

const MenuActions: FC<Props> = ({ listing, handleOpenModal }) => {
  const dispatch = useDispatch();
  const { done } = listing;
  const editLink = listing?.draft
    ? `/account/mylistings/edit/draft/${listing?.draft?.draftId}`
    : `/account/mylistings/edit/listed/${done?.masterListingId}`;
  const editPath = listing?.draft ? `/account/mylistings/edit/draft/[id]` : `/account/mylistings/edit/listed/[id]`;

  const linkMarketplace = `/marketplace/buy-now/${slugifyId(done?.bicycleName || '', done?.masterListingId || '')}`;
  const linkSellSimilar = `/account/mylistings/sell-similar/${done?.masterListingId}/create`;
  const linkRefundOrder = `/account/order/${done?.sale?.orderId}/refund`;
  const linkViewRefund = `/account/return-detail/mylistings/${done?.masterListingId}/${done?.sale?.orderId}?inventory=${done?.sale?.inventoryId}&marketListing=${done?.marketListingId}`;
  const linkRefundListing = `/account/refund/mylistings/${done?.masterListingId}/${done?.sale?.orderId}?inventory=${done?.sale?.inventoryId}&marketListing=${done?.marketListingId}`;
  const linkCancelOrder = `/account/order/${done?.sale?.orderId}/seller-personal`;
  const markAsPickup = useCallback(
    (marketListingId: string) => {
      dispatch(markListingsAsShipped(marketListingId));
    },
    [dispatch],
  );
  const handleReListSoldListing = useCallback(
    (masterListingId: string) => {
      dispatch(patchReListSoldListing(masterListingId));
    },
    [dispatch],
  );
  const showActionsSold = useMemo(() => {
    const allowSellSimilar =
      done?.sale?.localPickup ||
      (done?.sale?.shippingType === ShippingType.FLAT_RATE_TYPE &&
        done?.stageInventory !== StageInventory.ShippedToCustomer) ||
      done?.sale?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE;
    const allowMarkAsShipped = done?.sale?.localPickup && done?.stageInventory === StageInventory.AwaitingPickup;
    const allowShipItem =
      done?.sale?.shippingType === ShippingType.FLAT_RATE_TYPE &&
      done?.stageInventory !== StageInventory.ShippedToCustomer;
    const allowPrintLabel = done?.sale?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE;
    const allowRefundItem =
      !done?.sale?.isRequestReturn &&
      done?.isAllowReturn &&
      isNotDateExpired(done.sale?.soldDateTime, done?.returnWithinDays);
    const allowRefundOrder =
      done?.sale && done?.isAllowReturn && isNotDateExpired(done.sale?.soldDateTime, done?.returnWithinDays);
    const allowCancelOrder =
      done?.sale &&
      done?.stageInventory !== StageInventory.ShippedToCustomer &&
      done?.stageInventory !== StageInventory.PickedUp;
    return (
      <>
        {allowSellSimilar && (
          <li>
            <Link href="/account/mylistings/sell-similar/[id]/create" as={linkSellSimilar}>
              <a className={classes.btnMenu}>Sell similar</a>
            </Link>
          </li>
        )}
        {allowMarkAsShipped && (
          <li>
            <Button
              buttonType="clear"
              className={classes.btnMenu}
              onClick={() => markAsPickup(String(done?.marketListingId))}>
              Mark as Picked up
            </Button>
          </li>
        )}
        {allowShipItem && (
          <li>
            <Link href="/marketplace/buy-now/[id]" as={linkMarketplace}>
              <a className={classes.btnMenu}>Ship Item</a>
            </Link>
          </li>
        )}
        {allowPrintLabel && (
          <li>
            <Link href="/marketplace/buy-now/[id]" as={linkMarketplace}>
              <a className={classes.btnMenu}>Print Label</a>
            </Link>
          </li>
        )}
        {allowRefundItem && (
          <li>
            <Link href="/account/refund/mylistings/[itemId]/[id]" as={linkRefundListing}>
              <a className={classes.btnMenu}>Refund this item</a>
            </Link>
          </li>
        )}
        {allowRefundOrder && (
          <li>
            <Link href="/account/order/[id]/refund" as={linkRefundOrder}>
              <a className={classes.btnMenu}>Refund this order</a>
            </Link>
          </li>
        )}
        {done?.sale?.isRequestReturn && (
          <li>
            <Link href="/account/return-detail/mylistings/[itemId]/[id]" as={linkViewRefund}>
              <a className={classes.btnMenu}>View Return / Refund Detail</a>
            </Link>
          </li>
        )}
        {allowCancelOrder && (
          <li>
            <Link href="/account/order/[id]/seller-personal" as={linkCancelOrder}>
              <a className={classes.btnMenu}>Cancel Order</a>
            </Link>
          </li>
        )}
      </>
    );
  }, [
    done,
    linkCancelOrder,
    linkMarketplace,
    linkRefundListing,
    linkRefundOrder,
    linkSellSimilar,
    linkViewRefund,
    markAsPickup,
  ]);

  const showActionsForSale = useMemo(() => {
    const allowRelist = listing?.statusMarketListing === StatusMarketListing.DE_LISTED;
    const allowEdit =
      listing?.statusMarketListing !== StatusMarketListing.SALE_PENDING &&
      listing?.statusMarketListing !== StatusMarketListing.DE_LISTED;
    const allowRenew = listing?.statusMarketListing === StatusMarketListing.EXPIRED;
    return (
      <>
        {allowRelist && (
          <li>
            <Button
              buttonType="clear"
              className={cx(classes.resetBtn, classes.btnMenu)}
              onClick={() => handleReListSoldListing(String(done?.masterListingId))}>
              Re-list
            </Button>
          </li>
        )}
        {allowEdit && (
          <li>
            <Link href={editPath} as={editLink}>
              <a className={classes.btnMenu}>Edit</a>
            </Link>
          </li>
        )}
        {allowRenew && (
          <li>
            <Link href="/marketplace/buy-now/[id]" as={linkMarketplace}>
              <a className={classes.btnMenu}>Renew</a>
            </Link>
          </li>
        )}
        <li>
          <Button
            buttonType="clear"
            className={cx(classes.txtRemove, classes.resetBtn, classes.btnMenu)}
            onClick={handleOpenModal}>
            Remove
          </Button>
        </li>
      </>
    );
  }, [done, editLink, editPath, handleOpenModal, handleReListSoldListing, linkMarketplace, listing]);

  return (
    <>
      {!listing?.draft?.draftId && (
        <li>
          <Link href="/marketplace/buy-now/[id]" as={linkMarketplace}>
            <a className={classes.btnMenu}>View</a>
          </Link>
        </li>
      )}

      {listing?.statusMarketListing === StatusMarketListing.SOLD ? showActionsSold : showActionsForSale}
    </>
  );
};

export default MenuActions;
