import React, { FC, useMemo, useRef, useCallback } from 'react';
import { formatDateUsa } from 'helpers/date.helper';
import Link from 'next/link';
import {
  ProductsBasicInfoResponse,
  UserBasicInfoResponse,
  ProductBasicInfoItem,
  UserBasicInfoItem,
} from 'api/info.api';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import cx from 'classnames';
import { ListingReturnStatus, ListingReturnDisplay } from 'constants/listing';
import Card from '@ui/Cards/index';
import MenuCustom from '@ui/CustomMenu/index';
import { ListingReturnModel } from 'model/api/account/personal/listings.model';
import classes from '../listings.module.scss';
import SafeImage from '../../../../Image/SafeImage';

interface Props {
  listing: ListingReturnModel;
  listUserInfo?: UserBasicInfoResponse;
  listProducts?: ProductsBasicInfoResponse;
}

const ListingItem: FC<Props> = ({ listing, listProducts, listUserInfo }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const productInfo = useMemo((): string => {
    const result = listProducts?.find(
      (product: ProductBasicInfoItem) => product?.masterListingId === listing?.master_listing,
    );
    return result?.bicycleName || '';
  }, [listProducts, listing]);

  const findBuyerInfo = useCallback((): string => {
    const result = listUserInfo?.find((user: UserBasicInfoItem) => user?._id === listing?.buyer);
    return result?.user_name || '';
  }, [listUserInfo, listing]);

  const showStatus = useCallback((): string => {
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
  }, [listing]);

  const renderViewListing = useCallback(() => {
    return (
      <li>
        <Link href={'/marketplace/buy-now/[id]'} as={`/marketplace/buy-now/${listing?.master_listing}`}>
          <a className={classes.customLink}>View Listing</a>
        </Link>
      </li>
    );
  }, [listing]);

  const renderListMenu = useCallback(() => {
    const refundLink = `/account/refund/mylistings/${listing?.master_listing}/${listing?.order}?inventory=${listing?.inventory}&marketListing=${listing?.market_listing}`;
    const refundPath = '/account/refund/mylistings/[itemId]/[id]';
    const returnDetailLink = `/account/return-detail/mylistings/${listing?.master_listing}/${listing?.order}?inventory=${listing?.inventory}&marketListing=${listing?.market_listing}`;
    const refundDetailPath = '/account/return-detail/mylistings/[itemId]/[id]';
    switch (listing?.return_status) {
      case ListingReturnStatus.BuyerRequest: {
        if (listing?.shipping_payer === 'SELLER') {
          return (
            <>
              {renderViewListing()}
              <li>
                <Link
                  href={{
                    pathname: refundDetailPath,
                    query: {
                      inventory: listing?.inventory,
                      marketListing: listing?.market_listing,
                    },
                  }}
                  as={returnDetailLink}>
                  <a className={classes.customLink}>Provide Shipping Label</a>
                </Link>
              </li>
              <li>
                <Link
                  href={{
                    pathname: refundPath,
                    query: {
                      inventory: listing?.inventory,
                      marketListing: listing?.market_listing,
                    },
                  }}
                  as={refundLink}>
                  <a className={classes.customLink}>Refund</a>
                </Link>
              </li>
            </>
          );
        }
        return (
          <>
            {renderViewListing()}
            <li>
              <Link
                href={{
                  pathname: refundDetailPath,
                  query: {
                    inventory: listing?.inventory,
                    marketListing: listing?.market_listing,
                  },
                }}
                as={returnDetailLink}>
                <a className={classes.customLink}>Mark as delivered</a>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: refundPath,
                  query: {
                    inventory: listing?.inventory,
                    marketListing: listing?.market_listing,
                  },
                }}
                as={refundLink}>
                <a className={classes.customLink}>Refund</a>
              </Link>
            </li>
          </>
        );
      }

      case ListingReturnStatus.ItemShipping:
        return (
          <>
            {renderViewListing()}
            <li>
              <Link
                href={{
                  pathname: refundDetailPath,
                  query: {
                    inventory: listing?.inventory,
                    marketListing: listing?.market_listing,
                  },
                }}
                as={returnDetailLink}>
                <a className={classes.customLink}>Mark as delivered</a>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: refundPath,
                  query: {
                    inventory: listing?.inventory,
                    marketListing: listing?.market_listing,
                  },
                }}
                as={refundLink}>
                <a className={classes.customLink}>Refund</a>
              </Link>
            </li>
          </>
        );

      case ListingReturnStatus.ItemDelivered:
        return (
          <>
            {renderViewListing()}
            <li>
              <Link href={refundPath} as={refundLink}>
                <a className={classes.customLink}>Refund</a>
              </Link>
            </li>
          </>
        );

      default:
        return (
          <>
            {renderViewListing()}
            <li>
              <Link
                href={{
                  pathname: refundDetailPath,
                  query: {
                    inventory: listing?.inventory,
                    marketListing: listing?.market_listing,
                  },
                }}
                as={returnDetailLink}>
                <a className={classes.customLink}>View Detail</a>
              </Link>
            </li>
          </>
        );
    }
  }, [listing, renderViewListing]);

  return (
    <>
      <Card className={cx('row', classes.listingItem)}>
        <SafeImage
          ref={imgRef}
          className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}
          src={listing?.image}
          alt="img default"
        />
        <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
          <Link href={`/marketplace/buy-now/${slugifyId(productInfo, listing?.master_listing)}/`}>
            <a className={classes.nameListing}>{productInfo}</a>
          </Link>
          <div className={classes.nameYMB}>
            {formatDateUsa(listing?.date_updated)}
            <span className={classes.idListing}>{findBuyerInfo()}</span>
          </div>
          <div className={classes.priceItem}>{formatCurrency(listing?.amount_refund)}</div>
        </div>
        <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
          <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
          <div
            className={cx(classes.defaultStatus, {
              [classes.isActive]: listing?.return_status === ListingReturnStatus.SellerRefund,
              [classes.draft]: listing?.return_status === ListingReturnStatus.ItemShipping,
              [classes.expired]: listing?.return_status === ListingReturnStatus.ItemDeliver,
            })}>
            {showStatus()}
          </div>
        </div>
      </Card>
    </>
  );
};

export default ListingItem;
