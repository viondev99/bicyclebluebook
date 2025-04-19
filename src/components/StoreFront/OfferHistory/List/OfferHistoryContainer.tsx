import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError } from 'helpers/utils.helper';
import { formatDateUsa } from 'helpers/date.helper';
import { useRouter } from 'next/router';
import uniq from 'lodash/uniq';
import { OfferHistoryModel } from 'model/api/store-front/offers-history.model';
import { getUsersBasicInfo } from 'api/info.api';
import NotFoundItem from 'components/Account/NotFound';
import StoreState from 'model/store/index';
import { getListOffersHistory } from 'store/store-front/offers-history/offers-history.action';
import Pagination from '@ui/Pagination/Pagination';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import OfferHistoryItem from './OfferHistoryItem';
import classes from './list-offer-history.module.scss';
import OfferHistorySkeleton from './OfferHistorySkeleton';
import OfferHistoryAction from './OfferHistoryActions';

function OffersHistory() {
  const dispatch = useDispatch();
  const { isSelectedStore } = useSelector((store: StoreState) => ({
    isSelectedStore: store.common.isSelectedStore,
  }));
  const { query, replace, pathname } = useRouter();
  const [listPersonals, setListPersonals] = useState([]);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  useEffect(() => {
    const params = {
      ...query,
      storefrontIds,
    };
    dispatch(getListOffersHistory(params));
  }, [dispatch, query, storefrontIds, isSelectedStore]);

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

  const listOffersHistory = useSelector((store: StoreState) => store.storeFront.offersHistory.listOffersHistory);
  const loading = useSelector((store: StoreState) => store.storeFront.offersHistory.loading);
  useEffect(() => {
    if (listOffersHistory?.data?.length > 0) {
      const listUserIds: string[] = [];
      const list = listOffersHistory?.data?.forEach((item) => {
        listUserIds.push(item?.buyerId);
      });

      if (listUserIds?.length > 0) {
        const request = getUsersBasicInfo(uniq(listUserIds));
        request
          .then((res) => {
            setListPersonals(res);
          })
          .catch(toastError);
      }
    }
  }, [listOffersHistory]);

  const renderSkeleton = useCallback(() => {
    return <OfferHistorySkeleton />;
  }, []);

  const renderTimeOffer = useCallback(
    (index: number): ReactElement => {
      if (index === 0) {
        return <div className={classes.dateUpdated}>{formatDateUsa(listOffersHistory?.data[0]?.lastUpdate)}</div>;
      }
      if (
        formatDateUsa(listOffersHistory?.data[index - 1]?.lastUpdate) !==
        formatDateUsa(listOffersHistory?.data[index]?.lastUpdate)
      ) {
        return <div className={classes.dateUpdated}>{formatDateUsa(listOffersHistory?.data[index]?.lastUpdate)}</div>;
      }
      return null;
    },
    [listOffersHistory],
  );
  const renderListOffers = useCallback((): ReactElement => {
    if (listOffersHistory?.data?.length === 0) {
      return <NotFoundItem title="You haven’t any offers yet." />;
    }
    if (listOffersHistory?.data?.length > 0) {
      return (
        <>
          {listOffersHistory?.data?.map((offer: OfferHistoryModel, index: number) => (
            <>
              {renderTimeOffer(index)}
              <OfferHistoryItem offerItem={offer} key={offer.id} listPersonals={listPersonals} />
            </>
          ))}
          <Pagination
            totalPage={listOffersHistory?.total_page}
            page={listOffersHistory?.page}
            onChangePage={handlePagination}
          />
        </>
      );
    }
  }, [handlePagination, listOffersHistory, listPersonals, renderTimeOffer]);
  return (
    <div>
      <OfferHistoryAction />
      {loading ? renderSkeleton() : renderListOffers()}
    </div>
  );
}

export default OffersHistory;
