import React, { useEffect, useState, useCallback, ReactElement, useMemo } from 'react';
import StoreState from 'model/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import uniq from 'lodash/uniq';
import { useDispatch, useSelector } from 'react-redux';
import { getListingsManagerReturn } from 'store/account/personal/listings/listings.action';
import {
  getUsersBasicInfo,
  getProductsBasicInfo,
  ProductsBasicInfoResponse,
  UserBasicInfoResponse,
} from 'api/info.api';
import { toastError } from 'helpers/utils.helper';
import { ListingReturnModel } from 'model/api/account/personal/listings.model';
import Pagination from '@ui/Pagination/Pagination';
import { ListingsReturnParamsModel } from 'model/store/account/personal/listings.model';
import Card from '@ui/Cards/index';
import Button from '@ui/Buttons/Primary/Button';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { StageInventory } from 'model/store/common.model';
import ListingSkeleton from '../ListingSkeleton';
import SearchBar from './SearchBar';
import ListingReturnItem from './ListingReturnItem';
import classes from '../listings.module.scss';

function ListingsComponent() {
  const isUserBBBStaff = useUserIsBBB();
  const { query } = useRouter();
  const listings = useSelector((store: StoreState) => store.account.personal.listings.listingsReturn);
  const loading = useSelector((store: StoreState) => store.account.personal.listings.loading);
  const [params, setParams] = useState<ListingsReturnParamsModel>({
    page: 1,
    size: 10,
    sort: 'date_created:-1',
    statusMarketListing: StageInventory.CustomerReturned,
  });
  const [listUserInfo, setListUserInfo] = useState<UserBasicInfoResponse>(null);
  const [listProducts, setListProducts] = useState<ProductsBasicInfoResponse>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListingsManagerReturn({ ...params, ...query }));
  }, [dispatch, params, query]);

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
          {listings?.data.map((listing: ListingReturnModel) => (
            <ListingReturnItem
              listUserInfo={listUserInfo}
              listProducts={listProducts}
              key={listing._id}
              listing={listing}
            />
          ))}
          <Pagination totalPage={listings.total_page} page={listings.page} onChangePage={handleGetListing} />
        </>
      );
    }
  }, [handleGetListing, isUserBBBStaff, listProducts, listUserInfo, listings, renderNoResult]);

  return (
    <div className={classes.listingsContainer}>
      <SearchBar />
      {loading ? renderSkeleton() : renderListings()}
    </div>
  );
}

export default ListingsComponent;
