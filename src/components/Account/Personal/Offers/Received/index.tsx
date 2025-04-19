import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetOfferModel, OfferModel } from 'model/api/account/personal/offers.model';
import { getUsersBasicInfo } from 'api/info.api';
import uniq from 'lodash/uniq';
// import { formatDateUsa } from 'helpers/date.helper';
import { toastError } from 'helpers/utils.helper';
import Pagination from '@ui/Pagination/Pagination';
import StoreState from '../../../../../model/store/index';
import OfferReceivedItem from '../OfferItem';
import { getListOffersReceived } from '../../../../../store/account/personal/offers/offers.action';
import OfferSkeleton from '../OfferSkeleton';
import NotFoundItem from '../../../NotFound/index';
// import classes from './offers-received.module.scss';

function OffersReceived() {
  const dispatch = useDispatch();
  const [listPersonals, setListPersonals] = useState([]);
  const [params, setParams] = useState<GetOfferModel>({
    page: 1,
    size: 10,
    sort: 'DESC',
    fieldSort: 'CREATED_DATE',
  });

  useEffect(() => {
    dispatch(getListOffersReceived(params));
  }, [dispatch, params]);

  const handleGetOffers = useCallback(
    (page: number) => {
      dispatch(getListOffersReceived({ ...params, page }));
    },
    [dispatch, params],
  );

  const listOffersReceived = useSelector((store: StoreState) => store.account.personal.offers.listOffersReceived);
  const loading = useSelector((store: StoreState) => store.account.personal.offers.loading);

  useEffect(() => {
    if (listOffersReceived?.data?.length > 0) {
      const listUserIds: string[] = [];

      // eslint-disable-next-line no-unused-expressions
      listOffersReceived?.data?.forEach((item) => {
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
  }, [listOffersReceived]);

  // const renderTimeOffer = useCallback(
  //   (index: number): ReactElement => {
  //     if (index === 0) {
  //       return <div className={classes.dateUpdated}>{formatDateUsa(listOffersReceived?.data[0]?.lastUpdate)}</div>;
  //     }
  //     if (
  //       formatDateUsa(listOffersReceived?.data[index - 1]?.lastUpdate) !==
  //       formatDateUsa(listOffersReceived?.data[index]?.lastUpdate)
  //     ) {
  //       return <div className={classes.dateUpdated}>{formatDateUsa(listOffersReceived?.data[index]?.lastUpdate)}</div>;
  //     }
  //     return null;
  //   },
  //   [listOffersReceived],
  // );

  const renderSkeleton = useCallback(() => {
    return (
      <>
        {new Array(10).fill(0).map((item, index) => (
          <OfferSkeleton key={String(index)} />
        ))}
      </>
    );
  }, []);
  const renderListOffers = useCallback((): ReactElement => {
    if (listOffersReceived?.data?.length === 0) {
      return <NotFoundItem title="You haven’t received any offers yet." />;
    }
    if (listOffersReceived?.data?.length > 0) {
      return (
        <>
          {listOffersReceived?.data?.map((offer: OfferModel, index: number) => (
            <>
              {/* {renderTimeOffer(index)} */}
              <OfferReceivedItem offerItem={offer} key={offer.id} typeOffer="received" listPersonals={listPersonals} />
            </>
          ))}
          <Pagination
            totalPage={listOffersReceived?.total_page}
            page={listOffersReceived?.page}
            onChangePage={handleGetOffers}
          />
        </>
      );
    }
  }, [handleGetOffers, listOffersReceived, listPersonals]);
  return <div>{loading ? renderSkeleton() : renderListOffers()}</div>;
}

export default OffersReceived;
