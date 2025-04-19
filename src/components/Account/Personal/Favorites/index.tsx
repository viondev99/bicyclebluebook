import React, { useEffect, useMemo, useCallback } from 'react';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Link from 'next/link';
import Card from '@ui/Cards/index';
import Button from '@ui/Buttons/Primary/Button';
import Pagination from '@ui/Pagination/Pagination';
import { getListFavorites } from 'store/account/personal/favorites/favorites.action';
import { Row } from 'reactstrap';
import FavoriteItem from './FavoriteItem';
import classes from './favorites.module.scss';
// import { ListingsModel } from '../../../../model/store/account/personal/listings.model';
import { FavoriteItemModal } from '../../../../model/store/account/personal/favorites.model';
import FavoriteSkeleton from './FavoriteSkeleton';

function FavoritesComponent() {
  const dispatch = useDispatch();

  const favorites = useSelector((store: StoreState) => store.account.personal.favorites.listFavorites);
  const loading = useSelector((store: StoreState) => store.account.personal.favorites.loading);
  const params = useSelector((store: StoreState) => store.account.personal.favorites.queryParams);

  useEffect(() => {
    dispatch(getListFavorites(params));
  }, [dispatch, params]);

  const handleGetFavorite = useCallback(
    (page: number) => {
      dispatch(getListFavorites({ ...params, page }));
    },
    [dispatch, params],
  );

  const renderLoading = useMemo(() => {
    return new Array(10).fill(0).map((item, index) => <FavoriteSkeleton key={String(index)} />);
  }, []);

  const renderData = useMemo(() => {
    return (
      <Row xs={12} sm={6} xl={4}>
        {favorites?.data?.map((favorite: FavoriteItemModal) => (
          <FavoriteItem key={favorite.masterListingId} favoriteItem={favorite} />
        ))}
      </Row>
    );
  }, [favorites]);

  return (
    <div className={classes.favoritesContainer}>
      {loading ? renderLoading : renderData}

      {favorites && (
        <Pagination totalPage={favorites?.total_page} page={favorites?.page} onChangePage={handleGetFavorite} />
      )}

      {!loading && favorites?.data?.length === 0 && (
        <Card className={classes.notFound}>
          <div className={classes.titleNotFound}>You haven’t saved anything yet.</div>
          <div className={'d-flex justify-content-center'}>
            <Link href="/marketplace/buy-now">
              <a>
                <Button color="primary" className={classNames(classes.btnShowMkp, 'align-self-center')}>
                  Visit Marketplace
                </Button>
              </a>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default FavoritesComponent;
