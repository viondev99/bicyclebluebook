import React, { FC, useEffect, useRef, useState, useCallback, ReactElement, useMemo } from 'react';
import StoreState from 'model/store/index';
import images from 'assets/images';
import {
  getUsersBasicInfo,
  getProductsBasicInfo,
  ProductsBasicInfoResponse,
  UserBasicInfoResponse,
  ProductBasicInfoItem,
  UserBasicInfoItem,
} from 'api/info.api';
import cx from 'classnames';
import uniq from 'lodash/uniq';
import Card from '@ui/Cards/index';
import MenuCustom from '@ui/CustomMenu/index';
import { toastError } from 'helpers/utils.helper';
import { slugifyId, formatCurrency } from 'helpers/string.helper';
import { ListingReturnStatus, ListingReturnDisplay } from 'constants/listing';
import { formatDateUsa } from 'helpers/date.helper';
import { useDispatch, useSelector } from 'react-redux';
import { ListingReturnModel } from 'model/api/account/personal/listings.model';
import Link from 'next/link';
import SoldAsIs from 'components/SoldAsIs';
import Button from 'components/ui/Buttons/Primary/Button';
import { getUrlTracking } from 'helpers/utilities.helper';
import { getShipmentReturn } from 'api/store-front/listings.api';
import { printLabel } from 'helpers/common.helper';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { useRouter } from 'next/router';
import Badge from '@ui/Badge';
import { checkShipping } from 'store/store-front/listings/listings.action';
import useListStoreFronts from 'hooks/useListStorefont';
import classes from '../listing.module.scss';
import SafeImage from '../../../Image/SafeImage';

interface Props {}

const ManageReturn: FC<Props> = () => {
  const listings = useSelector((store: StoreState) => store.account.personal.listings.listingsReturn);
  const isBBBSeller = useSelector((state: StoreState) => state.authenticate.user?.is_bbb_seller);
  const [listUserInfo, setListUserInfo] = useState<UserBasicInfoResponse>(null);
  const [listProducts, setListProducts] = useState<ProductsBasicInfoResponse>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();
  const isUserBBBStaff = useUserIsBBB();
  const { query } = useRouter();
  const shipping = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.shipping);
  const loading = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.loading);
  const checkImageError = useCallback((e: any) => {
    if (imgRef.current) {
      imgRef.current.src = images.tradeIn.bgBike;
    }
  }, []);
  const is_bbb_seller = useSelector((store: StoreState) => store.authenticate.user?.is_bbb_seller);

  const checkIsBanner = (listingId: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { nameStorefont } = useListStoreFronts(listingId);
    if (nameStorefont && is_bbb_seller) {
      return <Badge name={nameStorefont} className={classes.banner} />;
    }
    return null;
  };

  useEffect(() => {
    if (listings?.data?.length > 0) {
      const listIdsUser: string[] = [];
      const listProductIds: number[] = [];
      const list = listings?.data?.forEach((item) => {
        listIdsUser.push(item?.buyer);
        listProductIds.push(item?.master_listing);
      });

      if (listIdsUser?.length > 0) {
        const request = getUsersBasicInfo(uniq(listIdsUser));
        request
          .then((res) => {
            setListUserInfo(res);
          })
          .catch(toastError);
      }
      if (listProductIds?.length > 0) {
        const request = getProductsBasicInfo(uniq(listProductIds));
        request
          .then((res) => {
            setListProducts(res);
          })
          .catch(toastError);
      }
    }
  }, [listings]);
  const findProductInfo = useCallback(
    (listing: ListingReturnModel): string => {
      const result = listProducts?.find(
        (product: ProductBasicInfoItem) => product?.masterListingId === listing?.master_listing,
      );
      return result?.bicycleName || '';
    },
    [listProducts],
  );

  const findBuyerInfo = useCallback(
    (listing: ListingReturnModel): ReactElement | string => {
      const result = listUserInfo?.find((user: UserBasicInfoItem) => user._id === listing?.buyer);
      if (result) {
        return (
          <Link href={`/marketplace/seller/${listing?.buyer}`}>
            <a>{result?.display_name}</a>
          </Link>
        );
      }
      return '';
    },
    [listUserInfo],
  );

  const showStatus = useCallback((listing: ListingReturnModel): string => {
    switch (listing?.return_status) {
      case ListingReturnStatus.SellerRefund:
        return ListingReturnDisplay.Complete;

      case ListingReturnStatus.ItemDeliver:
        return ListingReturnDisplay.Delivered;

      case ListingReturnStatus.ItemShipping:
        return ListingReturnDisplay.Shipped;

      default:
        return ListingReturnDisplay.Started;
    }
  }, []);

  const handleCheckShipping = useCallback(
    (listing) => {
      dispatch(checkShipping(listing?.inventory));
    },
    [dispatch],
  );

  const handlePrintLabel = useCallback(
    (listing: ListingReturnModel) => {
      if (shipping) {
        const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
        printLabel(newWindow, shipping?.fullLinkLabel);
      } else {
        getShipmentReturn(String(listing?.inventory))
          .then((res) => {})
          .catch((err) => {
            toastError(err);
          });
      }
    },
    [shipping],
  );

  const renderActionsList = useCallback(
    (listing: ListingReturnModel) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const handlePrintReturnLabel = useCallback(async () => {
        getShipmentReturn(String(listing?.inventory))
          .then((res) => {
            const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
            printLabel(newWindow, res?.fullLinkLabel);
          })
          .catch((err) => {
            toastError(err);
          });
      }, [listing]);

      const refundLink = `/store-front/refund/mylistings/${listing?.master_listing}/${listing?.order}?inventory=${listing?.inventory}&marketListing=${listing?.market_listing}`;
      const returnDetailLink = `/store-front/return-detail/mylistings/${listing?.master_listing}/${listing?.order}?inventory=${listing?.inventory}&marketListing=${listing?.market_listing}&isManagerReturn=${query?.isManagerReturn}`;
      const ProvideShippingLabel = (
        <li>
          <Link href={returnDetailLink}>
            <a className={classes.customLink}>Provide Shipping Label</a>
          </Link>
        </li>
      );
      const RefundAction = (
        <li>
          <Link href={refundLink}>
            <a className={classes.customLink}>Refund</a>
          </Link>
        </li>
      );
      const MarkAsDeliverAction = (
        <li>
          <Link href={returnDetailLink}>
            <a className={classes.customLink}>Mark as delivered</a>
          </Link>
        </li>
      );
      const ViewAction = (
        <li>
          <Link href={returnDetailLink}>
            <a className={classes.customLink}>View Detail</a>
          </Link>
        </li>
      );
      const ViewListingAction = (
        <li>
          <Link href={'/marketplace/buy-now/[id]'} as={`/marketplace/buy-now/${listing.master_listing}`}>
            <a className={classes.customLink}>View Listing</a>
          </Link>
        </li>
      );
      const ViewPrintReturnAction = (
        <li style={{ marginBottom: '5px' }}>
          <Button
            buttonSize="s"
            buttonType="clear"
            disabled={loading}
            className={classes.resizeBtn}
            onClick={() => handlePrintLabel(listing)}>
            Print return shipping label
          </Button>
        </li>
      );
      switch (listing?.return_status) {
        case ListingReturnStatus.BuyerRequest: {
          if (listing?.shipping_payer === 'SELLER') {
            return (
              <>
                {ViewListingAction}
                {ProvideShippingLabel}
                {RefundAction}
                {isBBBSeller && ViewPrintReturnAction}
              </>
            );
          }
          return (
            <>
              {ViewListingAction}
              {MarkAsDeliverAction}
              {RefundAction}
              {isBBBSeller && ViewPrintReturnAction}
            </>
          );
        }

        case ListingReturnStatus.ItemShipping:
          return (
            <>
              {ViewListingAction}
              {MarkAsDeliverAction}
              {RefundAction}
              {isBBBSeller && ViewPrintReturnAction}
            </>
          );

        case ListingReturnStatus.ItemDelivered:
          return (
            <>
              {ViewListingAction}
              {RefundAction}
              {isBBBSeller && ViewPrintReturnAction}
            </>
          );

        default:
          return (
            <>
              {ViewListingAction}
              {ViewAction}
              {isBBBSeller && ViewPrintReturnAction}
            </>
          );
      }
    },
    [handlePrintLabel, isBBBSeller, loading, query],
  );
  const findLinkMarketplace = useCallback(
    (listing: ListingReturnModel): string => {
      return `/marketplace/buy-now/${slugifyId(findProductInfo(listing), listing?.master_listing)}`;
    },
    [findProductInfo],
  );
  return (
    <>
      {listings?.data?.map((listing: ListingReturnModel) => (
        <Card className={cx('row', classes.listingItem)}>
          <div className="col-xs-12 col-sm-4">
            <Link href={findLinkMarketplace(listing)}>
              <a className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}>
                <SoldAsIs />
                <SafeImage
                  ref={imgRef}
                  className={cx(classes.imageItemListing)}
                  src={listing.image}
                  alt="img default"
                />
              </a>
            </Link>
            {checkIsBanner(listing?.storefront)}
          </div>

          <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
            <Link href={'/marketplace/buy-now/[id]'} as={findLinkMarketplace(listing)}>
              <a className={classes.nameListing}>{findProductInfo(listing)}</a>
            </Link>
            <div style={{ marginBottom: 15 }}>
              <span className={classes.year}>{formatDateUsa(listing?.date_created)}</span>
              <span className={classes.boughtBy}>{findBuyerInfo(listing)}</span>
              {isUserBBBStaff && <span className={classes.inventoryName}>INV {listing?.inventory}</span>}
            </div>
            {listing?.tracking_id && (
              <div style={{ marginBottom: 15 }}>
                <span className={classes.inventoryName}>
                  Tracking Number: {` `}
                  <a target="_blank" href={getUrlTracking(listing.tracking_id)} className={classes.link}>
                    {listing.tracking_id}
                  </a>
                </span>
              </div>
            )}
            <div className={classes.priceItem}>{formatCurrency(listing?.amount_refund)}</div>
          </div>
          <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
            <MenuCustom
              classMenuContent={classes.customMenu}
              onCheckShipping={() => handleCheckShipping(listing)}
              listMenu={renderActionsList(listing)}
            />
            <div
              className={cx(classes.defaultStatus, {
                [classes.isActive]: listing?.return_status === ListingReturnStatus.SellerRefund,
                [classes.draft]: listing?.return_status === ListingReturnStatus.ItemShipping,
                [classes.expired]: listing?.return_status === ListingReturnStatus.ItemDeliver,
              })}>
              {showStatus(listing)}
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ManageReturn;
