import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { addToCompareList } from 'api/compare.api';
import { savedFavorite } from 'store/account/personal/favorites/favorites.action';
import Product from '@ui/Product/Product';
import { Col } from 'reactstrap';
import { FavoriteItemModal } from '../../../../model/store/account/personal/favorites.model';
import classes from './favorites.module.scss';

interface Props {
  favoriteItem: FavoriteItemModal;
}
const FavoriteItem: FC<Props> = ({ favoriteItem }) => {
  const dispatch = useDispatch();
  const handleSavedFavorite = useCallback(() => {
    const favouriteType = favoriteItem?.inventoryAuctionId ? 'AUCTION' : 'MARKET_LIST';
    const masterListingId = favoriteItem.inventoryAuctionId
      ? favoriteItem.inventoryAuctionId
      : favoriteItem.masterListingId;
    dispatch(
      savedFavorite({
        favouriteType,
        masterListingId,
      }),
    );
  }, [dispatch, favoriteItem]);
  const handleAddToCompare = useCallback(() => {
    try {
      addToCompareList(favoriteItem?.masterListingId);
      toastSuccess(t('compare.added'));
    } catch (error) {
      toastError(error);
    }
  }, [favoriteItem]);

  return (
    <>
      <Col xs={12} sm={6} xl={6} className={classes.favoriteList}>
        <Product
          isSaved={true}
          id={favoriteItem.masterListingId}
          bikeName={favoriteItem.bicycleName}
          bikePrice={favoriteItem.currentListedPrice}
          currentListedPrice={favoriteItem.currentListedPrice}
          bikeType={favoriteItem.bicycleTypeName}
          image={favoriteItem.imageDefault}
          altImage={favoriteItem.imageDefault}
          index={favoriteItem.bicycleId}
          stageInventory={favoriteItem.stageInventory}
          statusMarketListing={favoriteItem.statusMarketListing}
          initialListPrice={favoriteItem.initialListPrice}
          isFavorites
        />
      </Col>
    </>
  );
};

export default FavoriteItem;
