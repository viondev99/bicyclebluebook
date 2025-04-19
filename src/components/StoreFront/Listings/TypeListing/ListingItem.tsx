import React, { FC, ReactElement, useMemo, useRef } from 'react';
import { StageInventory } from 'model/store/common.model';
import Link from 'next/link';
import { slugifyId } from 'helpers/string.helper';
import cx from 'classnames';
import Card from '@ui/Cards/index';
import MenuCustom from '@ui/CustomMenu/index';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import SoldAsIs from 'components/SoldAsIs';
import Badge from '@ui/Badge';
import useListStorefont from 'hooks/useListStorefont';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import ModalDeleteListing from '../Modal/ModalDeleteListing';
import SafeImage from '../../../Image/SafeImage';
import classes from '../listing.module.scss';

interface Props {
  listing: ListingItemModel;
  imgDefault?: string;
  listingContent: ReactElement;
  listMenu?: ReactElement;
  statusListing?: string;
  closeModalDelete?: () => void;
  openDelete?: boolean;
  isDraft?: boolean;
}

const ListingItem: FC<Props> = ({
  listing,
  listingContent,
  imgDefault,
  listMenu,
  statusListing,
  closeModalDelete,
  isDraft,
  openDelete = false,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const { nameStorefont } = useListStorefont(listing?.finished?.storefrontId);
  const is_bbb_seller = useSelector((store: StoreState) => store.authenticate.user?.is_bbb_seller);
  const renderImage = useMemo(() => {
    if (isDraft) {
      return (
        <a className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}>
          <SoldAsIs />
          {is_bbb_seller && nameStorefont && <Badge name={nameStorefont} className={classes.banner} />}
          <SafeImage
            imgSize={'s'}
            ref={imgRef}
            className={cx(classes.imageItemListing)}
            src={imgDefault}
            // onError={(e) => checkImageError(e)}
            alt="img default"
          />
        </a>
      );
    }
    return (
      <Link href={`/marketplace/buy-now/${slugifyId(listing?.title, listing?.finished?.masterListingId)}`}>
        <a className={cx('col-xs-12 col-sm-4', classes.imageItemListing)}>
          <SoldAsIs />
          {is_bbb_seller && nameStorefont && <Badge name={nameStorefont} className={classes.banner} />}
          <SafeImage
            ref={imgRef}
            imgSize={'s'}
            className={cx(classes.imageItemListing)}
            src={imgDefault}
            // onError={(e) => checkImageError(e)}
            alt="img default"
          />
        </a>
      </Link>
    );
  }, [imgDefault, isDraft, is_bbb_seller, listing, nameStorefont]);
  return (
    <>
      <Card className={cx('row', classes.listingItem)}>
        {renderImage}
        <div className={cx('col-xs-8 col-sm-6', classes.contentItemListing)}>{listingContent}</div>
        <div className={cx('col-xs-4 col-sm-2', classes.actionItemListing)}>
          {listMenu ? <MenuCustom classMenuContent={classes.customMenu} listMenu={listMenu} /> : <div />}
          <div
            className={cx(classes.defaultStatus, {
              [classes.isActive]: listing?.statusMarketListing === StageInventory.Sold,
              [classes.draft]: listing?.statusMarketListing === StageInventory.Draft,
              [classes.expired]: listing?.statusMarketListing === StageInventory.Expired,
            })}>
            {statusListing}
          </div>
        </div>
      </Card>
      <ModalDeleteListing listingChecked={listing} onClose={() => closeModalDelete()} open={openDelete} />
    </>
  );
};

export default ListingItem;
