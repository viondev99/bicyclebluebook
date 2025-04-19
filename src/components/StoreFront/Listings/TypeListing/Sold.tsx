import React, { FC, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import t from 'helpers/language';
import cx from 'classnames';
import { getInventoryShipment, getShipmentReturn, sendMailListingShipping } from 'api/store-front/listings.api';
import { printLabel } from 'helpers/common.helper';
import { shipToBuyer } from 'api/marketplace.api';
import { markListingAsShipped } from 'api/account/personal/listings.api';
import StoreState from 'model/store/index';
import { slugifyId, formatCurrency } from 'helpers/string.helper';
import { formatDateUsa, isNotDateExpired, isNewDataPrintLabel } from 'helpers/date.helper';
import ContactBuyerModal from 'components/Contact/Modal/ContactBuyer';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import { useSelector } from 'react-redux';
import { useStockLocationInfo } from 'hooks/useStockLocationInfo';
import capitalize from 'lodash/capitalize';
import Button from 'components/ui/Buttons/Primary/Button';
import { StageInventory } from 'model/store/common.model';
import { GetShipmentResponse, ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import { handleCheckListUsersBlockedRequest } from 'store/partner/account/account.saga';
import { UserInfoConsumer } from 'hooks/useUserInfo';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import ListingItem from './ListingItem';
import classes from '../listing.module.scss';
import ModelTrackingEmail from '../Modal/ModalTrackingEmail';

interface Props {}

const Sold: FC<Props> = () => {
  const { query, replace, pathname } = useRouter();
  // const [listUserInfo, setListUserInfo] = useState<UserBasicInfoResponse>(null);
  const [modalSendMail, showModalSendMail] = useState<boolean>(false);
  const [showContactModal, openContactModal] = useState<boolean>(false);
  const [listingChecked, setListingChecked] = useState<ListingItemModel>(null);
  const listings = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.listListingOnlineStore);
  const isUserBBBStaff = useUserIsBBB();
  const router = useRouter();
  const stockLocation = useStockLocationInfo(
    listings?.data?.map((item) => item?.finished?.stockLocationId).filter((item) => !!item) || [],
  );

  // console.log('listInv', listInv);

  // useEffect(() => {
  //   if (listings?.data?.length > 0) {
  //     const listUserIds: string[] = [];
  //     const list = listings?.data?.forEach((listing) => {
  //       listUserIds.push(
  //         listing?.finished?.sale?.accountId ? listing?.finished?.sale?.accountId : listing?.finished?.sale?.buyerId,
  //       );
  //     });
  //     // if (listUserIds?.length > 0) {
  //     //   const request = getUsersBasicInfo(without(uniq(listUserIds), '', undefined));
  //     //   request
  //     //     .then((res) => {
  //     //       setListUserInfo(res);
  //     //     })
  //     //     .catch(toastError);
  //     // }
  //   }
  // }, [listings]);

  // useEffect(() => {})

  const handlePrintLabel = useCallback(
    (listing: ListingItemModel) => {
      const isNewData: boolean = isNewDataPrintLabel(listing?.finished?.timeSold);
      if (isNewData && !isUserBBBStaff) {
        router.push(`/marketplace/buy-now/${listing?.finished.masterListingId}/print-label`);
      } else {
        shipToBuyer({
          id: listing?.finished?.marketListingId,
          orderId: listing?.finished?.sale?.orderId,
          salePrice: listing?.finished?.sale?.price,
        })
          .then((res) => {
            const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
            printLabel(newWindow, res.fullLinkLabel);
          })
          .catch(toastError);
      }
    },
    [isUserBBBStaff, router],
  );
  const handleMarkListingAsShipped = useCallback(
    (listing: ListingItemModel) => {
      markListingAsShipped(String(listing?.finished?.marketListingId))
        .then(() => {
          replace({
            pathname,
            query: {
              ...query,
            },
          });
          toastSuccess(t('myAccount.myListing.markAsPickedUp'));
        })
        .catch(toastError);
    },
    [pathname, query, replace],
  );

  const handleSendMail = useCallback((id: number, shipment: GetShipmentResponse) => {
    sendMailListingShipping({
      marketListingId: id,
      carrierType: shipment?.carrierType,
      trackingNumber: shipment?.trackingNumber,
    })
      .then((res) => {
        toastSuccess(t('storeFront.myListing.sendTrackingEmail'), t('seoTitle.success'));
      })
      .catch(toastError);
  }, []);

  const handleCheckShipment = useCallback(
    (listing: ListingItemModel) => {
      setListingChecked(listing);
      getInventoryShipment(String(listing?.finished?.inventoryId))
        .then((res: GetShipmentResponse) => {
          if (res?.carrierType && res?.trackingNumber) {
            handleSendMail(listing?.finished?.marketListingId, res);
          } else if (res?.shipmentType === 'OUTBOUND') {
            showModalSendMail(true);
          } else {
            toastError('Tracking Number and Carrier Type must be not empty.');
          }
        })
        .catch((error) => {
          if (error?.response?.status === 404) {
            showModalSendMail(true);
          } else {
            toastError(error);
          }
        });
    },
    [handleSendMail],
  );

  const showModalContactBuyer = useCallback((listing: ListingItemModel) => {
    setListingChecked(listing);
    openContactModal(true);
  }, []);

  const renderActionsList = useCallback(
    (listing: ListingItemModel) => {
      const listingStage = listing?.finished?.stageInventory;
      const shippingType = listing?.finished?.sale?.shippingType;
      const linkSellSimilar = `/store-front/mylistings/sell-similar/${listing?.finished?.masterListingId}/create`;
      const linkMarketplace = `/marketplace/buy-now/${slugifyId(listing?.title, listing?.finished?.masterListingId)}`;
      const linkCancelOrder = `/store-front/order-history/${listing?.finished?.orderId}/cancel`;
      const linkRefundListing = `/store-front/refund/mylistings/${listing?.finished?.masterListingId}/${listing?.finished?.sale?.orderId}?inventory=${listing?.finished?.inventoryId}&marketListing=${listing?.finished?.marketListingId}`;
      const linkRefundOrder = `/store-front/order-history/${listing?.finished?.sale?.orderId}/refund`;
      const linkViewRefund = `/store-front/return-detail/mylistings/${listing?.finished?.masterListingId}/${listing?.finished?.sale?.orderId}?inventory=${listing?.finished?.inventoryId}&marketListing=${listing?.finished?.marketListingId}`;

      const allowSellSimilar = !isUserBBBStaff;
      // listing?.finished?.sale?.localPickup ||
      // (!isUserBBBStaff &&
      //   shippingType === StageInventory.FlatRateType &&
      //   listingStage !== StageInventory.ShippedToCustomer &&
      //   listingStage !== StageInventory.PickedUp) ||
      // (!isUserBBBStaff && shippingType === StageInventory.BicycleBlueBookType);

      const allowPrintReturnShipping =
        (listingStage === StageInventory?.ShippedToCustomer || listingStage === StageInventory?.Sold) && isUserBBBStaff;

      const allowMarkAsPickedUp =
        !!listing?.finished?.sale?.localPickup &&
        (listingStage === StageInventory.AwaitingPickup ||
          listingStage === StageInventory.Sold ||
          listingStage === StageInventory.Processing);

      const checkWithUserBBB =
        ((shippingType === StageInventory.FlatRateType &&
          listingStage !== StageInventory.ShippedToCustomer &&
          listingStage !== StageInventory.PickedUp) ||
          shippingType === StageInventory.BicycleBlueBookType) &&
        isUserBBBStaff;

      const allowMarkAsShipped =
        checkWithUserBBB &&
        !listing?.finished?.sale?.localPickup &&
        (listingStage === StageInventory.Sold || listingStage === StageInventory.Processing);

      const allowSendMail = isUserBBBStaff && checkWithUserBBB && listingStage === StageInventory.ShippedToCustomer;

      const allowShipItem =
        // !listing?.finished?.sale?.localPickup &&
        shippingType === StageInventory.FlatRateType &&
        listingStage !== StageInventory.ShippedToCustomer &&
        listingStage !== StageInventory.PickedUp &&
        (isUserBBBStaff || (listingStage !== StageInventory.Sold && listingStage !== StageInventory.ShippedToCustomer));

      const allowPrintLabel = !isUserBBBStaff && shippingType === StageInventory.BicycleBlueBookType;

      const allowCancelOrder =
        listingStage !== StageInventory.ShippedToCustomer && listingStage !== StageInventory.PickedUp;

      const allowRefundListing =
        !listing?.finished?.sale?.isRequestReturn &&
        ((listing?.finished?.isAllowReturn &&
          isNotDateExpired(listing?.finished?.sale?.soldDateTime, listing?.finished?.returnWithinDays)) ||
          isUserBBBStaff);

      const allowRefundOrder =
        listing?.finished?.sellerIsBBB ||
        (!listing?.finished?.sellerIsBBB &&
          listing?.finished?.isAllowReturn &&
          isNotDateExpired(listing?.finished?.sale?.soldDateTime, listing?.finished?.returnWithinDays));

      const allowRefundReturn = listing?.finished?.sale?.isRequestReturn === true;

      const targetContactId = listing?.finished?.sale?.buyerId || '';

      const handleContactTarget = useCallback(async () => {
        const isBlocked = await handleCheckListUsersBlockedRequest({ ids: [targetContactId] });
        if (isBlocked) {
          return toastError(t('myAccount.message.checkUsersBlockedAccess'));
        }
        showModalContactBuyer(listing);
      }, [targetContactId]);

      const handlePrintReturnLabel = useCallback(async () => {
        getShipmentReturn(String(listing?.finished?.inventoryId))
          .then((res) => {
            const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
            printLabel(newWindow, res?.fullLinkLabel);
          })
          .catch((err) => {
            toastError(err);
          });
      }, [listing]);

      return (
        <>
          {listing?.finished?.masterListingId && (
            <li>
              <Link
                href={'/marketplace/buy-now/[id]'}
                as={`/marketplace/buy-now/${listing?.finished?.masterListingId}`}>
                <a className={classes.customLink}>View Listing</a>
              </Link>
            </li>
          )}
          {allowSellSimilar && (
            <li>
              <Link href={linkSellSimilar}>
                <a className={classes.customLink}>Sell Similar</a>
              </Link>
            </li>
          )}
          {allowMarkAsPickedUp && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => handleMarkListingAsShipped(listing)}>
                Mark as Picked up
              </Button>
            </li>
          )}
          {checkWithUserBBB && (
            <>
              {allowMarkAsShipped && (
                <li>
                  <Button
                    buttonSize="s"
                    buttonType="clear"
                    className={classes.resizeBtn}
                    onClick={() => handleMarkListingAsShipped(listing)}>
                    Mark as Shipped
                  </Button>
                </li>
              )}
              {allowSendMail && (
                <li>
                  <Button
                    buttonSize="s"
                    buttonType="clear"
                    className={classes.resizeBtn}
                    onClick={() => handleCheckShipment(listing)}>
                    Send tracking email
                  </Button>
                </li>
              )}
            </>
          )}
          {allowShipItem && (
            <li>
              <Link href={linkMarketplace}>
                <a className={classes.customLink}>Ship Item</a>
              </Link>
            </li>
          )}
          {allowPrintLabel && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => handlePrintLabel(listing)}>
                Print Label
              </Button>
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
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={handleContactTarget}>
              Contact Buyer
            </Button>
          </li>
          {allowRefundListing && (
            <li>
              <Link href={linkRefundListing}>
                <a className={classes.customLink}>Refund this item</a>
              </Link>
            </li>
          )}
          {allowRefundOrder && (
            <li>
              <Link href={linkRefundOrder}>
                <a className={classes.customLink}>Refund this order</a>
              </Link>
            </li>
          )}
          {allowRefundReturn && (
            <li>
              <Link href={linkViewRefund}>
                <a className={classes.customLink}> View Return / Refund Detail</a>
              </Link>
            </li>
          )}
          {allowPrintReturnShipping && (
            <li style={{ marginBottom: '5px' }}>
              <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={handlePrintReturnLabel}>
                Print return shipping label
              </Button>
            </li>
          )}
        </>
      );
    },
    [handleCheckShipment, handleMarkListingAsShipped, handlePrintLabel, isUserBBBStaff, showModalContactBuyer],
  );

  const showStatusListing = useCallback((listing: ListingItemModel): string => {
    if (listing?.statusMarketListing === StageInventory.Sold) {
      if (listing?.finished?.sale?.localPickup) {
        if (listing?.finished?.stageInventory === StageInventory.Sold) {
          return 'Sold';
        }
        if (listing?.finished?.stageInventory) {
          return `${capitalize(listing?.finished?.stageInventory?.replace(/_/, ' '))}`;
        }
        return 'n/a';
      }
      if (
        listing?.finished?.sale?.shippingType === StageInventory.FlatRateType ||
        listing?.finished?.sale?.shippingType === StageInventory.BicycleBlueBookType
      ) {
        switch (listing?.finished?.stageInventory) {
          case StageInventory.Sold:
            return 'Processing';
          case StageInventory.Processing:
            return 'Processing';
          case StageInventory.ShippedToCustomer:
            return 'Shipped to customer';
          case StageInventory.ReceivedByCustomer:
            return 'Shipped to customer';
          default:
            return 'Sold';
        }
      }
    }
    return capitalize(listing?.statusMarketListing?.replace(/_/, ' '));
  }, []);

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
                <span className={classes.year}>{formatDateUsa(listing?.finished?.timeSold)}</span>
                <span className={classes.boughtBy}>
                  Bought by{' '}
                  <UserInfoConsumer id={listing?.finished?.sale?.buyerId}>
                    {(buyerInfo) => (
                      <Link href={`/store-front/order-history/buyer/${listing?.finished?.sale?.buyerId}`}>
                        <a>
                          {buyerInfo?.displayName ||
                            buyerInfo?.name ||
                            listing?.finished?.sale?.buyerDisplayName ||
                            '-'}
                        </a>
                      </Link>
                    )}
                  </UserInfoConsumer>
                </span>
              </div>
              <div className={classes.groupChips}>
                <span className={classes.chip}>
                  <span className={classes.titleChip}>ID </span>
                  <span className={classes.contentChip}>
                    <Link
                      href={`/marketplace/buy-now/${slugifyId(listing?.title, listing?.finished?.masterListingId)}/`}>
                      <a>{listing?.finished?.masterListingId}</a>
                    </Link>
                  </span>
                </span>
                <span className={cx(classes.chip, classes.breakWhenMobile)}>
                  <span className={classes.titleChip}>Order </span>
                  <span className={classes.contentChip}>
                    <Link href={`/store-front/order-history/${listing?.finished?.sale?.orderId}`}>
                      <a>{listing?.finished?.sale?.orderCode ? `#${listing?.finished?.sale?.orderCode}` : '-'}</a>
                    </Link>
                  </span>
                </span>
              </div>
              <div className={classes.groupChips}>
                <span className={classes.chip}>
                  <span className={classes.titleChip}>Views </span>
                  <span className={classes.contentChip}>{listing?.finished?.views}</span>
                </span>
              </div>
              {isUserBBBStaff && (
                <div className={classes.groupChips}>
                  <span className={classes.chip}>
                    <span className={classes.titleChip}>INV </span>
                    <span className={classes.contentChip}>{listing?.finished?.inventoryName}</span>
                  </span>

                  <span className={cx(classes.chip, classes.breakWhenMobile)}>
                    <span className={classes.titleChip}>Stock Location </span>
                    <span className={classes.contentChip}>
                      {stockLocation.find((item) => item.id === listing?.finished?.stockLocationId)
                        ? stockLocation.find((item) => item.id === listing?.finished?.stockLocationId).name
                        : '-'}
                    </span>
                  </span>
                </div>
              )}
              {isUserBBBStaff && (
                <div className={classes.groupChips}>
                  <span className={classes.chip}>
                    <span className={classes.titleChip}>Margin </span>
                    <span className={classes.contentChip}>
                      {listing?.margin ? `${listing?.margin?.toFixed(0)}%` : '-'}
                    </span>
                  </span>
                </div>
              )}
              <div className={classes.priceItem}>{formatCurrency(listing?.currentListedPrice)}</div>
              {!!listing?.finished?.isAvailableAssembled && (
                <div className={classes.availableAssembled}>Available assembled</div>
              )}
              {!!listing?.finished?.sale?.isCancelOrder && (
                <div className={classes.cancelRequest}>Buyer requested to cancel this order</div>
              )}
              {listing?.trackingNumber && (
                <div className="mt-3">
                  <span className={classes.titleChip}>Tracking No. </span>
                  <Link
                    href={`https://wwwapps.ups.com/tracking/tracking.cgi?tracknum=${listing?.trackingNumber}&requester=ST/trackdetails`}>
                    <a className={classes.link}>{listing?.trackingNumber}</a>
                  </Link>
                </div>
              )}
            </>
          }
          listing={listing}
          statusListing={showStatusListing(listing)}
          listMenu={renderActionsList(listing)}
        />
      ))}
      <ModelTrackingEmail
        onClose={() => showModalSendMail(false)}
        open={modalSendMail}
        marketListingId={listingChecked?.finished?.marketListingId}
      />
      <ContactBuyerModal
        isOpen={showContactModal}
        onClose={() => openContactModal(false)}
        buyerId={
          listingChecked?.finished?.sale?.buyerId
            ? listingChecked?.finished?.sale?.buyerId
            : listingChecked?.finished?.sale?.accountId
        }
        buyerDisplayName={listingChecked?.finished?.sale?.buyerDisplayName}
        masterListing={listingChecked?.finished?.masterListingId}
        listingTitle={listingChecked?.title}
        bikeName={listingChecked?.finished?.bicycleName}
        invNames={[listingChecked?.finished?.inventoryName]}
        image={listingChecked?.imageDefault}
        isOrder={true}
        orderId={listingChecked?.finished?.orderId}
      />
    </>
  );
};

export default Sold;
