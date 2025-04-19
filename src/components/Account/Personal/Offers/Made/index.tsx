import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError } from 'helpers/utils.helper';
// import { formatDateUsa } from 'helpers/date.helper';
import uniq from 'lodash/uniq';
import Pagination from '@ui/Pagination/Pagination';
import { GetOfferModel, OfferModel } from 'model/api/account/personal/offers.model';
import { getStoresBasicInfo, getUsersBasicInfo } from 'api/info.api';
import StoreState from '../../../../../model/store/index';
import OfferMadeItem from '../OfferItem';
import { getListOffersMade } from '../../../../../store/account/personal/offers/offers.action';
import NotFoundItem from '../../../NotFound';
// import classes from './offers-made.module.scss';
import OfferSkeleton from '../OfferSkeleton';

function OffersMade() {
  const dispatch = useDispatch();
  const [params, setParams] = useState<GetOfferModel>({
    page: 1,
    size: 10,
    sort: 'DESC',
    fieldSort: 'CREATED_DATE',
  });
  const [listStoreFronts, setListStoreFronts] = useState([]);
  const [listPersonals, setListPersonals] = useState([]);

  useEffect(() => {
    dispatch(getListOffersMade(params));
  }, [dispatch, params]);

  const handleGetOffers = useCallback(
    (page: number) => {
      dispatch(getListOffersMade({ ...params, page }));
    },
    [dispatch, params],
  );
  const listOffersMade = useSelector((store: StoreState) => store.account.personal.offers.listOffersMade);
  const loading = useSelector((store: StoreState) => store.account.personal.offers.loading);
  useEffect(() => {
    if (listOffersMade?.data?.length > 0) {
      const listStorefrontIds: string[] = [];
      const listUserIds: string[] = [];

      // eslint-disable-next-line no-unused-expressions
      listOffersMade?.data?.forEach((item) => {
        if (item?.storefrontId) {
          listStorefrontIds.push(item?.storefrontId);
        } else {
          listUserIds.push(item?.sellerId);
        }
      });

      if (listStorefrontIds?.length > 0) {
        const request = getStoresBasicInfo(uniq(listStorefrontIds));
        request
          .then((res) => {
            setListStoreFronts(res);
          })
          .catch(toastError);
      }
      if (listUserIds?.length > 0) {
        const request = getUsersBasicInfo(uniq(listUserIds));
        request
          .then((res) => {
            setListPersonals(res);
          })
          .catch(toastError);
      }
    }
  }, [listOffersMade]);

  // const renderTimeOffer = useCallback(
  //   (index: number): ReactElement => {
  //     if (index === 0) {
  //       return <div className={classes.dateUpdated}>{formatDateUsa(listOffersMade?.data[0]?.lastUpdate)}</div>;
  //     }
  //     if (
  //       formatDateUsa(listOffersMade?.data[index - 1]?.lastUpdate) !==
  //       formatDateUsa(listOffersMade?.data[index]?.lastUpdate)
  //     ) {
  //       return <div className={classes.dateUpdated}>{formatDateUsa(listOffersMade?.data[index]?.lastUpdate)}</div>;
  //     }
  //     return null;
  //   },
  //   [listOffersMade],
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
    if (listOffersMade?.data?.length === 0) {
      return <NotFoundItem title="You haven’t made any offers yet." />;
    }
    if (listOffersMade?.data?.length > 0) {
      return (
        <>
          {listOffersMade?.data?.map((offer: OfferModel, index: number) => (
            <>
              {/* {renderTimeOffer(index)} */}
              <OfferMadeItem
                offerItem={offer}
                key={offer.id}
                typeOffer="made"
                listPersonals={listPersonals}
                listStoreFronts={listStoreFronts}
              />
            </>
          ))}
          <Pagination
            totalPage={listOffersMade?.total_page}
            page={listOffersMade?.page}
            onChangePage={handleGetOffers}
          />
        </>
      );
    }
  }, [handleGetOffers, listOffersMade, listPersonals, listStoreFronts]);
  return <div>{loading ? renderSkeleton() : renderListOffers()}</div>;
}

export default OffersMade;
