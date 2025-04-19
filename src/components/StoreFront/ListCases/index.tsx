import React, { useEffect, useMemo, useCallback, useState } from 'react';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards/index';
import Pagination from '@ui/Pagination/Pagination';
import { getStorefrontListCases } from 'store/store-front/account/account.action';
import { MAX_SIZE } from 'helpers/string.helper';
import { useRouter } from 'next/router';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
// eslint-disable-next-line import/no-cycle
import CasesItem from './CasesItem';
import FavoriteSkeleton from './Skeleton';
import CasesSearch from './CasesSearch';
import { CasesSearchForm } from './interface';
import SearchBar from './SearchBar/SearchBar';
import classes from './cases.module.scss';

const valueFormDefault: CasesSearchForm = {
  type: 'openCases',
  visibleSelectSearch: false,
  visibleDatepickerSearch: false,
};

export interface ListCaseParams {
  page?: number;
  type?: string;
  pattern?: string;
  storefrontIds?: string[];
}

function CasesComponent() {
  const dispatch = useDispatch();
  const { query, replace, pathname } = useRouter();
  const [valueForm, setValueForm] = useState(valueFormDefault);
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const isSelectedStore = useSelector((store: StoreState) => store.common.isSelectedStore);

  const loading = useSelector((store: StoreState) => store.storeFront.account.loading);
  const dataCases = useSelector((store: StoreState) => store.storeFront.account.dataCases);
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);

  useEffect(() => {
    let params: ListCaseParams = {
      ...query,
      type: valueForm.type,
    };
    if (query.pattern && query.pattern !== '') {
      params = {
        ...params,
        pattern: `content:${query?.pattern}` || '',
      };
    }
    if (storefrontIds) {
      params = {
        ...params,
        storefrontIds: [storefrontIds],
      };
    }
    getListCases(params);
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [valueForm, query, isSelectedStore, dispatch]);

  const getListCases = useCallback(
    (params?: ListCaseParams) => {
      let payload = {
        ...params,
        page: params?.page || 1,
        is_seller: isStorefront,
        page_size: MAX_SIZE,
        sort: 'date_updated:-1',
        status:
          params?.type === 'closeCases'
            ? 'closed'
            : valueForm.type === 'openCases'
            ? 'new,open,pending,rejected,assigned'
            : 'closed',
      };
      delete payload.type;

      dispatch(getStorefrontListCases(payload));
    },
    [dispatch],
  );

  const handleChangePage = (page: number) => {
    replace({
      pathname,
      query: {
        ...query,
        page,
      },
    });
  };

  const renderLoading = useMemo(() => {
    return new Array(10).fill(0).map((_, index) => <FavoriteSkeleton key={String(index)} />);
  }, []);

  const renderData = useMemo(() => {
    return dataCases?.data?.map((it) => <CasesItem key={it._id} caseItem={it} valueForm={valueForm} />);
  }, [dataCases, valueForm]);

  const onChangeSearch = (key: string, value: string | boolean) => {
    setValueForm({
      ...valueForm,
      [key]: value,
    });
  };

  const visibleBoxSearch = () => {
    setSearchBoxVisible(!searchBoxVisible);
  };

  return (
    <div className={classes.casesContainer}>
      <CasesSearch valueForm={valueForm} onChangeSearch={onChangeSearch} visibleBoxSearch={visibleBoxSearch} />
      {searchBoxVisible && <SearchBar />}
      {loading ? renderLoading : renderData}

      <Pagination totalPage={dataCases?.total_page} page={dataCases?.page} onChangePage={handleChangePage} />

      {!loading && dataCases?.data?.length === 0 && (
        <Card className={classes.notFound}>
          <div className={classes.titleNotFound}>No cases matching your search</div>
        </Card>
      )}
    </div>
  );
}

export default CasesComponent;
