import React, { FC, useCallback } from 'react';
import Link from 'next/link';
import { PositionPartner } from 'model/store/dealer-locator';
import Skeleton from 'react-loading-skeleton';
import Button from '@ui/Buttons/Primary/Button';
import { ListPartnerResponse, PartnerInfoModel } from 'api/dealer-locator';
import classes from './dealer-locator.module.scss';

interface Props {
  loading: boolean;
  listPartner: ListPartnerResponse;
  distance: number;
  locationResult: PositionPartner;
  zoomInPartner: (lat: number, lng: number, index: number) => void;
}
const ListPartnerNearYou: FC<Props> = ({ distance, zoomInPartner, locationResult, loading, listPartner }) => {
  const rad = useCallback((x: number) => {
    return (x * Math.PI) / 180;
  }, []);
  const getDistance = useCallback(
    (p1: PositionPartner, p2: PositionPartner) => {
      const R = 6378137; // Earth’s mean radius in meter
      const dLat = rad(p2.lat - p1.lat);
      const dLong = rad(p2.lng - p1.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c) / 1609.344; // returns the distance in meter
    },
    [rad],
  );

  const renderListPartner = useCallback(() => {
    if (loading) {
      return new Array(3).fill(0).map((item, index: number) => (
        <div className={classes.dealerInfoItem} key={String(index)}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ));
    }
    if (listPartner?.length === 0) {
      return <div className={classes.noPartner}>No Trade-In Partner Near You</div>;
    }
    return listPartner
      ?.filter(
        (data: PartnerInfoModel) =>
          getDistance(locationResult, {
            lng: data.location[0],
            lat: data.location[1],
          }) <= distance,
      )
      .map((res: PartnerInfoModel) =>
        Object.assign(res, {
          distance: getDistance(locationResult, {
            lng: res.location[0],
            lat: res.location[1],
          }),
        }),
      )
      .map((partner: PartnerInfoModel, index: number) => (
        <Button
          className={classes.dealerInfoItem}
          buttonType="clear"
          key={partner?._id}
          onClick={() => zoomInPartner(partner?.location[1], partner?.location[0], index)}>
          <div className={classes.wrapInfo}>
            <div className={classes.nameDealer}>{partner?.name}</div>
            <div className={classes.wrapInfoDealer}>
              <div className={classes.distance}>{partner?.distance?.toFixed(2)} miles away</div>
              <div>
                <Link href={`/trade-in`}>
                  <a className={classes.btnTrade}>Trade in here</a>
                </Link>
              </div>
            </div>
          </div>
        </Button>
      ));
  }, [distance, getDistance, listPartner, loading, locationResult, zoomInPartner]);
  return <div>{renderListPartner()}</div>;
};

export default ListPartnerNearYou;
