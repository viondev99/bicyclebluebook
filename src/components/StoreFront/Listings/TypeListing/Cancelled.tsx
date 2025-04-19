import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import StoreState from 'model/store/index';
import { getProductsBasicInfo, ProductsBasicInfoResponse, ProductBasicInfoItem } from 'api/info.api';
import cx from 'classnames';
import uniq from 'lodash/uniq';
import Card from '@ui/Cards/index';
import MenuCustom from '@ui/CustomMenu/index';
import { toastError } from 'helpers/utils.helper';
import ModelDetailListingCancelled from 'components/Account/Personal/MyListing/Cancel/ModalDetailListingCancel';
import customClass from 'components/Account/Personal/MyListing/Cancel/cancel-listing.module.scss';
import { slugifyId, formatCurrency } from 'helpers/string.helper';
import Button from '@ui/Buttons/Primary/Button';
import { formatDateUsa } from 'helpers/date.helper';
import { useSelector } from 'react-redux';
import { ListingCancelledItem } from 'model/api/account/personal/listings.model';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import Link from 'next/link';
import SoldAsIs from 'components/SoldAsIs';
import { useRouter } from 'next/router';
import useListStoreFronts from 'hooks/useListStorefont';
import Badge from '@ui/Badge';
import SafeImage from '../../../Image/SafeImage';
import classes from '../listing.module.scss';

const Cancelled: FC = () => {
  const listings = useSelector((store: StoreState) => store.account.personal.listings.listingsCancelled);
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [listingChecked, setListingChecked] = useState<ListingCancelledItem>(null);
  const [listProducts, setListProducts] = useState<ProductsBasicInfoResponse>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isUserBBBStaff = useUserIsBBB();
  const { query } = useRouter();
  const is_bbb_seller = useSelector((store: StoreState) => store.authenticate.user?.is_bbb_seller);

  const renderStatus = useCallback(
    (item: ListingCancelledItem) => {
      if (query?.isCancellations) {
        switch (item?.status) {
          case 'requesting':
            return 'Started';

          default:
            return `${item?.status?.charAt(0).toUpperCase()}${item?.status?.slice(1)}`;
        }
      }
      return 'Cancelled';
    },
    [query],
  );

  useEffect(() => {
    if (listings?.data?.length > 0) {
      const listProductIds: number[] = [];
      const list = listings?.data?.forEach((item) => {
        listProductIds.push(item?.master_listing);
      });

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
    (listing: ListingCancelledItem): string => {
      const result = listProducts?.find(
        (product: ProductBasicInfoItem) => product?.masterListingId === listing?.master_listing,
      );
      return result?.bicycleName || '';
    },
    [listProducts],
  );

  const findInventoryInfo = useCallback(
    (listing: ListingCancelledItem): string => {
      const result = listProducts?.find(
        (product: ProductBasicInfoItem) => product?.masterListingId === listing?.master_listing,
      );
      return result?.inventoryId?.toString() || '';
    },
    [listProducts],
  );

  const renderListMenu = useCallback(
    (listing: ListingCancelledItem) => {
      const linkDetailListing = `/marketplace/buy-now/${slugifyId(findProductInfo(listing), listing?.master_listing)}/`;
      return (
        <>
          <li>
            <Link href={'/marketplace/buy-now/[id]'} as={linkDetailListing}>
              <a className={classes.customLink}>View Listing</a>
            </Link>
          </li>
          <li>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={classes.resizeBtn}
              onClick={() => {
                setModalDetailVisible(true);
                setListingChecked(listing);
              }}>
              <a className={classes.customLink}>View Details</a>
            </Button>
          </li>
          {listing?.status === 'requesting' && (
            <li>
              <Link href={`/store-front/order-history/${listing?.order}/cancel`}>
                <a className={classes.customLink}>Cancel Order</a>
              </Link>
            </li>
          )}
        </>
      );
    },
    [findProductInfo],
  );
  const findLinkMarketplace = useCallback(
    (listing: ListingCancelledItem): string => {
      return `/marketplace/buy-now/${slugifyId(findProductInfo(listing), listing?.master_listing)}`;
    },
    [findProductInfo],
  );

  const checkIsBanner = (listingId: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { nameStorefont } = useListStoreFronts(listingId);
    if (nameStorefont && is_bbb_seller) {
      return <Badge name={nameStorefont} className={classes.banner} />;
    }
    return null;
  };

  return (
    <>
      {listings?.data?.map((listing: ListingCancelledItem) => (
        <Card className={cx('row', classes.listingItem)}>
          <div className="col-xs-12 col-sm-4">
            <Link href={findLinkMarketplace(listing)}>
              <a className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}>
                <SoldAsIs />
                <SafeImage
                  ref={imgRef}
                  className={cx(classes.imageItemListing)}
                  src={listing.image}
                  // onError={(e) => checkImageError(e)}
                  alt="img default"
                />
              </a>
            </Link>
            {checkIsBanner(listing?.storefront)}
          </div>
          <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
            <Link href={'marketplace/buy-now/[id]'} as={findLinkMarketplace(listing)}>
              <a className={classes.nameListing}>{findProductInfo(listing)}</a>
            </Link>
            <div className={customClass.chips} style={{ marginTop: 0 }}>
              <div>
                <span className={customClass.titleChip}>Date</span>
                <span className={customClass.contentChip}>{formatDateUsa(listing?.date_updated)}</span>
              </div>
              <div>
                <span className={customClass.titleChip}>ID</span>
                <span className={customClass.contentChip}>{listing?.master_listing}</span>
              </div>
              {isUserBBBStaff && (
                <div>
                  <span className={customClass.titleChip}>INV</span>
                  <span className={customClass.contentChip}>{findInventoryInfo(listing)}</span>
                </div>
              )}
            </div>
            <div className={customClass.buyer}>
              Buyer
              <Link href={`/marketplace/seller/${listing.buyer}`}>
                <a>{listing.buyer_name}</a>
              </Link>
            </div>
            <div className={classes.priceItem}>{formatCurrency(listing?.price)}</div>
          </div>
          <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
            <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu(listing)} />
            <div
              className={cx(classes.defaultStatus, classes.cancelledStatus, {
                [classes.cancleStarted]: listing?.status === 'requesting',
              })}>
              {renderStatus(listing)}
            </div>
          </div>
        </Card>
      ))}
      <ModelDetailListingCancelled
        listingChecked={listingChecked}
        open={modalDetailVisible}
        onClose={() => {
          setModalDetailVisible(false);
          setListingChecked(null);
        }}
      />
    </>
  );
};

export default Cancelled;
