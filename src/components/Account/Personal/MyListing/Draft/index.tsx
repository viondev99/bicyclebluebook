import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { getListings } from 'store/account/personal/listings/listings.action';
import Card from '@ui/Cards/index';
import Button from '@ui/Buttons/Primary/Button';
import Pagination from '@ui/Pagination/Pagination';
import { ListingItemModel } from 'model/api/account/personal/listings.model';
import { ListingsModel } from 'model/store/account/personal/listings.model';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { StatusMarketListing } from 'constants/marketplace';
import { useRouter } from 'next/router';
import ListingItem from '../ListingItem';
import ListingSkeleton from '../ListingSkeleton';
import classes from '../listings.module.scss';
import ButtonSortBar, { HandleChangeParamsWhenClickSort } from '../components/ButtonSortBar';

function ListingsComponent() {
  const isUserBBBStaff = useUserIsBBB();
  const { query, replace, pathname } = useRouter();
  const [params, setParams] = useState<ListingsModel>({
    page: 1,
    size: 10,
    statusMarketListing: StatusMarketListing.DRAFT,
    sortField: query?.sortField ? `${query?.sortField}` : 'POSTING_TIME',
    sortType: query?.sortType ? `${query?.sortType}` : 'DESC',
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListings(params));
  }, [dispatch, params]);

  const handleChangeParamsWhenClickSort = useCallback(
    (data: HandleChangeParamsWhenClickSort) => {
      setParams({
        ...params,
        ...data,
      });
    },
    [params],
  );

  const listings = useSelector((store: StoreState) => store.account.personal.listings.listings);
  const loading = useSelector((store: StoreState) => store.account.personal.listings.loading);
  const handleGetListing = useCallback(
    (page: number) => {
      setParams({ ...params, page });
    },
    [params],
  );
  const renderSkeleton = useCallback((): ReactElement => {
    return (
      <>
        {new Array(10).fill(0).map((item, index) => (
          <ListingSkeleton key={String(index)} />
        ))}
      </>
    );
  }, []);

  const renderNoResult = useMemo(() => {
    return (
      <Card className={classes.notFoundListing}>
        <div className={classes.notFoundText}>There’s no data.</div>
      </Card>
    );
  }, []);

  const renderListings = useCallback((): ReactElement => {
    if (listings?.data?.length === 0) {
      if (!isUserBBBStaff) {
        return (
          <Card className={classes.notFoundListing}>
            <div className={classes.titleNotFound}>You don’t have anything listed.</div>
            <Button color="primary" className={classes.btnCreate}>
              <Link href="/account/mylistings/create">
                <a>Create a New Listing</a>
              </Link>
            </Button>
          </Card>
        );
      }
      return renderNoResult;
    }
    if (listings?.data?.length) {
      return (
        <>
          <ButtonSortBar handleChangeParamsWhenClickSort={handleChangeParamsWhenClickSort} />
          {listings.data?.map((listing: ListingItemModel) => (
            <ListingItem key={listing.postingTime} listing={listing} />
          ))}
          <Pagination totalPage={listings.total_page} page={listings.page} onChangePage={handleGetListing} />
        </>
      );
    }
  }, [handleChangeParamsWhenClickSort, handleGetListing, isUserBBBStaff, listings, renderNoResult]);

  return <div className={classes.listingsContainer}>{loading ? renderSkeleton() : renderListings()}</div>;
}

export default ListingsComponent;
