import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Card from '@ui/Cards/index';
import { StageInventory } from 'model/store/common.model';
import Pagination from '@ui/Pagination/Pagination';
import Button from '@ui/Buttons/Primary/Button';
import { getListingsCancelled, getListingsManagerReturn } from 'store/account/personal/listings/listings.action';
import { getListingsOnlineStore } from 'store/store-front/listings/listings.action';
import StoreState from 'model/store/index';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
import HeaderListing from './HeaderListing';
import ForSale from './TypeListing/ForSale';
import Sold from './TypeListing/Sold';
import ManageReturn from './TypeListing/ManageReturn';
import ListingSkeleton from './ListingSkeleton';
import Expired from './TypeListing/Expired';
import Draft from './TypeListing/Draft';
import SalePending from './TypeListing/SalePending';
import DeListed from './TypeListing/DeListed';
import Cancelled from './TypeListing/Cancelled';

import classes from './listing.module.scss';

function ListingsHistory() {
  const isUserBBBStaff = useUserIsBBB();
  const { query, replace, pathname } = useRouter();
  const dispatch = useDispatch();
  const isSelectedStore = useSelector((store: StoreState) => store.common.isSelectedStore);
  const loading = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.loading);
  const listings = useSelector((store: StoreState) => store.storeFront.listingOnlineStore.listListingOnlineStore);
  const listingsReturn = useSelector((store: StoreState) => store.account.personal.listings.listingsReturn);
  const loadingListingReturn = useSelector((store: StoreState) => store.account.personal.listings.loading);
  const listingsCancelled = useSelector((store: StoreState) => store.account.personal.listings.listingsCancelled);
  const typeListing = useMemo(() => {
    return query?.statuses;
  }, [query]);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const handleListingOnlineStore = useCallback(() => {
    if (!typeListing) {
      dispatch(
        getListingsOnlineStore({
          ...query,
          statuses: StageInventory.Listed,
          storefrontIds,
        }),
      );
    } else if (typeListing === StageInventory.CustomerReturned) {
      dispatch(
        getListingsManagerReturn({
          page: Number(query?.page),
          page_size: 10,
          pattern: query?.content ? `reason_buyer_return:${query?.content}` : '',
          sort: query?.sort ? query?.sort : 'date_created:-1',
          time_start: query?.fromDay ? Number(query?.fromDay) : '',
          time_end: query?.toDay ? Number(query?.toDay) : '',
          return_status: query?.returnStatus || '',
          storefrontIds,
        }),
      );
    } else if (typeListing === StageInventory.Cancelled) {
      dispatch(
        getListingsCancelled({
          page: Number(query?.page),
          page_size: 10,
          pattern: query?.content ? `content:${query?.content}` : '',
          sort: query?.sort ? query?.sort : 'date_created:-1',
          time_start: query?.fromDay ? Number(query?.fromDay) : '',
          time_end: query?.toDay ? Number(query?.toDay) : '',
          storefrontIds,
        }),
      );
    } else {
      dispatch(
        getListingsOnlineStore({
          ...query,
          storefrontIds: [storefrontIds],
        }),
      );
    }
  }, [dispatch, query, storefrontIds, typeListing]);

  useEffect(() => {
    handleListingOnlineStore();
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [dispatch, handleListingOnlineStore, query, isSelectedStore]);

  const renderSkeleton = useCallback(() => {
    return <ListingSkeleton />;
  }, []);

  const handlePagination = useCallback(
    (page: number) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [pathname, query, replace],
  );

  const renderNoResult = useMemo(() => {
    return (
      <Card className={classes.notFoundListing}>
        <div className={classes.notFoundText}>There’s no data.</div>
      </Card>
    );
  }, []);

  const checkIsBBBStaff = useCallback(() => {
    if (isUserBBBStaff) {
      return {
        notFoundIsBBB: true,
      };
    }
    return {
      notFoundNotBBB: true,
    };
  }, [isUserBBBStaff]);

  const listingNotFound: Partial<{ notFoundIsBBB: boolean; notFoundNotBBB: boolean }> = useMemo(() => {
    if (listings?.data?.length === 0 && typeListing !== StageInventory.CustomerReturned) {
      return checkIsBBBStaff();
    }
    if (listingsReturn?.data?.length === 0 && typeListing === StageInventory.CustomerReturned) {
      return checkIsBBBStaff();
    }
    if (listingsCancelled?.data?.length === 0 && typeListing === StageInventory.Cancelled) {
      return checkIsBBBStaff();
    }
    return {};
  }, [checkIsBBBStaff, listings, listingsCancelled, listingsReturn, typeListing]);

  const renderListingPage = useMemo((): ReactElement => {
    if (listingNotFound.notFoundNotBBB) {
      return (
        <Card className={classes.notFoundListing}>
          <div className={classes.titleNotFound}>You don’t have anything listed.</div>
          <Button color="primary" className={classes.btnCreate}>
            <Link href="/store-front/mylistings/create">
              <a>Create a New Listing</a>
            </Link>
          </Button>
        </Card>
      );
    }
    if (listingNotFound.notFoundIsBBB) {
      return renderNoResult;
    }

    switch (typeListing) {
      case StageInventory.Listed:
        return <ForSale />;
      case StageInventory.Sold:
        return <Sold />;
      case StageInventory.Expired:
        return <Expired />;
      case StageInventory.Draft:
        return <Draft />;
      case StageInventory.SalePending:
        return <SalePending />;
      case StageInventory.DeListed:
        return <DeListed />;
      case StageInventory.CustomerReturned:
        return <ManageReturn />;
      case StageInventory.Cancelled:
        return <Cancelled />;
      default:
        return <ForSale />;
    }
  }, [listingNotFound.notFoundIsBBB, listingNotFound.notFoundNotBBB, renderNoResult, typeListing]);

  const totalItem = useMemo(() => {
    switch (typeListing) {
      case StageInventory.CustomerReturned:
        return listingsReturn?.total_item;
      case StageInventory.Cancelled:
        return listingsCancelled?.total_item;
      default:
        return listings?.total_item;
    }
  }, [listings, listingsCancelled, listingsReturn, typeListing]);
  const totalPage = useMemo(() => {
    switch (typeListing) {
      case StageInventory.CustomerReturned:
        return listingsReturn?.total_page;
      case StageInventory.Cancelled:
        return listingsCancelled?.total_page;
      default:
        return listings?.total_page;
    }
  }, [listings, listingsCancelled, listingsReturn, typeListing]);

  const currentPage = useMemo(() => {
    switch (typeListing) {
      case StageInventory.CustomerReturned:
        return listingsReturn?.page;
      case StageInventory.Cancelled:
        return listingsCancelled?.page;
      default:
        return listings?.page;
    }
  }, [listings, listingsCancelled, listingsReturn, typeListing]);

  const currentLoading = useMemo(() => {
    switch (typeListing) {
      case StageInventory.CustomerReturned:
        return loadingListingReturn;
      case StageInventory.Cancelled:
        return loadingListingReturn;
      default:
        return loading;
    }
  }, [loading, loadingListingReturn, typeListing]);

  const renderLayout = useMemo(() => {
    return (
      <div>
        <HeaderListing totalItem={totalItem} />
        {currentLoading ? renderSkeleton() : renderListingPage}
        <Pagination totalPage={totalPage} page={currentPage} onChangePage={handlePagination} />
      </div>
    );
  }, [currentLoading, currentPage, handlePagination, renderListingPage, renderSkeleton, totalItem, totalPage]);
  return renderLayout;
}

export default ListingsHistory;
