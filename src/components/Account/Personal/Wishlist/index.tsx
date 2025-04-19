import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import StoreState from 'model/store/index';
import { getListSearchSubscriber, getListSubscription } from 'store/account/personal/wishlist/wishlist.action';
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards/index';
import Pagination from '@ui/Pagination/Pagination';
import { useProductInfo } from 'hooks/useProductInfo';
import WishListItem from './WishListItem';
import classes from './wishlist.module.scss';
import WishListSkeleton from './WishlistSkeleton';
import BikeSubscribeItem from './BikeSubscribeItem';

function WishListContainer() {
  const dispatch = useDispatch();
  const listSubscribers = useSelector((store: StoreState) => store.account.personal.wishlist.listSubscribers);
  const loading = useSelector((store: StoreState) => store.account.personal.wishlist.loading);
  const listBikeSubscribe = useSelector((store: StoreState) => store.account.personal.wishlist.listBikeSubscribe);
  const loadingBike = useSelector((store: StoreState) => store.account.personal.wishlist.loadingBike);
  const params = useSelector((store: StoreState) => store.account.personal.wishlist.queryParams);
  const paramsGetBike = useSelector((store: StoreState) => store.account.personal.wishlist.bikeSubscribeQuery);
  const products = useProductInfo(listBikeSubscribe?.data?.map((item) => item.data_id) || []);

  const listSaved = useMemo(() => {
    return (
      listBikeSubscribe?.data?.map((item) => {
        const temp = products.find((product) => String(product.masterListingId) === String(item.data_id));
        return {
          ...item,
          id: String(item.id),
          genders: temp?.genderName,
          start_price: String(temp?.currentListedPrice),
          frame_material_names: temp?.frameMaterialName,
          wheel_sizes: temp?.wheelSizeName,
          brand_names: temp?.bicycleBrandName,
          suspensions: temp?.suspensionName,
          model_names: temp?.bicycleModelName,
          conditions: temp?.condition,
          brake_type_names: temp?.brakeName,
        };
      }) || []
    );
  }, [listBikeSubscribe, products]);

  useEffect(() => {
    dispatch(getListSearchSubscriber(params));
    dispatch(getListSubscription(paramsGetBike));
  }, [dispatch, params, paramsGetBike]);
  const handleGetSubscriber = useCallback(
    (page: number) => {
      dispatch(getListSearchSubscriber({ ...params, page }));
    },
    [dispatch, params],
  );
  const handleGetBikeSubscribe = useCallback(
    (page?: number) => {
      dispatch(getListSubscription({ ...paramsGetBike, page }));
    },
    [dispatch, paramsGetBike],
  );

  const renderListSavedSearch = useMemo(() => {
    if (loading) {
      return <WishListSkeleton />;
    }
    return listSubscribers?.data?.length > 0 ? (
      <div>
        <div className={classes.headerWishlist}>
          You are signed up to receive an email when a new bike is added to our marketplace that matches the criteria of
          your saved searches below. Delete the saved search to unsubscribe.
        </div>
        <div className={classes.title}>List Saved Search</div>
        <div className={classes.wishListContainer}>
          {listSubscribers?.data?.map((subscriber) => (
            <WishListItem subscriber={subscriber} key={subscriber.id} />
          ))}
          <Pagination
            totalPage={listSubscribers?.total_page}
            page={listSubscribers?.page}
            onChangePage={handleGetSubscriber}
          />
        </div>
      </div>
    ) : null;
  }, [handleGetSubscriber, listSubscribers, loading]);
  const renderListBikeSubscribe = useMemo(() => {
    if (loadingBike) {
      return <WishListSkeleton />;
    }
    return listSaved.length > 0 ? (
      <div>
        <div className={classes.title}>List Saved Bike</div>
        <div className={classes.wishListContainer}>
          {listSaved.map((subscribe) => (
            <BikeSubscribeItem
              key={subscribe.data_id}
              subscribe={subscribe}
              handleGetBikeSubscribe={handleGetBikeSubscribe}
            />
          ))}
          <Pagination
            totalPage={listBikeSubscribe?.total_page}
            page={listBikeSubscribe?.page}
            onChangePage={handleGetBikeSubscribe}
          />
        </div>
      </div>
    ) : null;
  }, [handleGetBikeSubscribe, listSaved, listBikeSubscribe, loadingBike]);
  return (
    <div>
      {renderListSavedSearch}
      {renderListBikeSubscribe}
      {!loadingBike &&
        !loading &&
        ((listSubscribers?.data?.length === 0 && listBikeSubscribe?.data?.length === 0) ||
          (!listSubscribers?.data && !listBikeSubscribe?.data)) && (
          <Card className={classes.notFound}>
            <div className={classes.titleNotFound}>You haven’t added anything to your wishlist.</div>
            <Button color="primary" className={classes.btnShowMkp}>
              <Link href="/marketplace/buy-now">
                <a>Visit Marketplace</a>
              </Link>
            </Button>
          </Card>
        )}
    </div>
  );
}

export default WishListContainer;
