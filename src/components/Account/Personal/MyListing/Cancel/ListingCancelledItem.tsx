import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatDateUsa } from 'helpers/date.helper';
import Link from 'next/link';
import { ProductBasicInfoItem, ProductsBasicInfoResponse, UserBasicInfoResponse } from 'api/info.api';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import cx from 'classnames';
import bgBike from 'assets/img/trade-in/bg_bike.png';
import Card from '@ui/Cards/index';
import Button from '@ui/Buttons/Primary/Button';
import MenuCustom from '@ui/CustomMenu/index';
import { ListingCancelledItem } from 'model/api/account/personal/listings.model';
import classes from '../listings.module.scss';
import customClass from './cancel-listing.module.scss';
import ModelDetailListingCancelled from './ModalDetailListingCancel';

interface Props {
  listing: ListingCancelledItem;
  listUserInfo?: UserBasicInfoResponse;
  listProducts?: ProductsBasicInfoResponse;
}

const ListingItem: FC<Props> = ({ listing, listProducts, listUserInfo }) => {
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const productInfo = useMemo((): string => {
    const result = listProducts?.find(
      (product: ProductBasicInfoItem) => product?.masterListingId === listing?.master_listing,
    );
    return result?.bicycleName || '';
  }, [listProducts, listing]);

  const renderListMenu = useCallback(() => {
    const linkDetailOrder = `/account/order/${listing?.order}`;
    const linkDetailListing = `/marketplace/buy-now/${slugifyId(productInfo, listing?.master_listing)}/`;
    return (
      <>
        <li>
          <Link href={`/marketplace/buy-now/[id]`} as={linkDetailListing}>
            <a className={classes.customLink}>View Listing</a>
          </Link>
        </li>
        <li>
          <Button
            buttonSize="s"
            buttonType="clear"
            className={classes.resizeBtn}
            onClick={() => setModalDetailVisible(true)}>
            <a className={classes.customLink}>View Details</a>
          </Button>
        </li>
      </>
    );
  }, [listing, productInfo]);

  const detailListingLink = `/marketplace/buy-now/${slugifyId(productInfo, listing?.master_listing)}`;
  const detailListingPath = `/marketplace/buy-now/[id]`;
  return (
    <>
      <Card className={cx('row', classes.listingItem)}>
        <Link href={detailListingPath} as={detailListingLink}>
          <a className={cx('col-xs-12 col-sm-4', classes.imgListing)}>
            <img
              ref={imgRef}
              className={cx(classes.imageItemListing)}
              src={listing?.image || bgBike}
              alt="img default"
            />
          </a>
        </Link>
        <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>
          <div>
            <Link href={detailListingPath} as={detailListingLink}>
              <a className={classes.nameListing}>{productInfo}</a>
            </Link>
          </div>
          <div className={customClass.chips}>
            <span className={customClass.titleChip}>Date</span>
            <span className={customClass.contentChip}> {formatDateUsa(listing?.date_updated)}</span>
            <span className={customClass.titleChip}>ID</span>
            <span className={customClass.contentChip}>{listing?.master_listing}</span>
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
          <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
          <div className={cx(classes.defaultStatus, classes.expired)}>Cancelled</div>
        </div>
      </Card>
      <ModelDetailListingCancelled
        listingChecked={listing}
        open={modalDetailVisible}
        onClose={() => setModalDetailVisible(false)}
      />
    </>
  );
};

export default ListingItem;
