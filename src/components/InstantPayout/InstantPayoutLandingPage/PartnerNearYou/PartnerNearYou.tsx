import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import SafeImage from 'components/Image/SafeImage';
import { useDispatch, useSelector } from 'react-redux';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import { PositionPartner } from 'model/store/dealer-locator';
import StoreState from 'model/store';
import { calculateDistance } from 'helpers/common.helper';
import Skeleton from 'react-loading-skeleton';
import { ListPartnerResponse, PartnerInfoModel } from 'api/dealer-locator';
import { getListPartner, cancelGetListPartner } from 'store/dealer-locator/dealer-locator.action';
import ReactGoogleMap from 'components/ReactGoogleMap';
import images from 'assets/images';
import FormikInput from 'components/Formik/Input/FormikInput';
import Button from '@ui/Buttons/Primary/Button';
import classes from './partner-near-you.module.scss';

interface Props {
  listPartner: ListPartnerResponse;
  distance: number;
  newPosition: PositionPartner;
  isActive: boolean;
}

const PartnerNearYou: FC<Props> = ({ isActive, listPartner, distance = 10, newPosition }) => {
  const loading = useSelector((store: StoreState) => store.dealerLocator.loading);
  const [listPartnerVisible, showListPartner] = useState(false);
  const [centerDefault, setCenterDefault] = useState<PositionPartner>({
    lat: 37.37024,
    lng: -121.87744,
  });
  const [marketShow, setMarkerShow] = useState<number>(-1);
  const [locationResult, setLocationResult] = useState<PositionPartner>({
    lat: 37.37024,
    lng: -121.87744,
  });
  const [currentZoom, setZoom] = useState<number>(11);
  const dispatch = useDispatch();
  useEffect(() => {
    if (newPosition) {
      setLocationResult(newPosition);
      setCenterDefault(newPosition);
    }
  }, [newPosition]);
  const handleGetListPartner = useCallback(
    (params: PositionPartner, position?: PositionPartner) => {
      dispatch(getListPartner({ ...params, is_instant_payout: true }));
      if (position) {
        setLocationResult(position);
        setCenterDefault(position);
      }
    },
    [dispatch],
  );

  const handleClickToMaker = useCallback((i: number) => {
    setMarkerShow(i);
  }, []);
  const onDragStartGoogleMap = useCallback(() => {
    dispatch(cancelGetListPartner());
  }, [dispatch]);
  const onDragGoogleMap = useCallback(
    (e: google.maps.LatLng) => {
      const positionDefault = {
        lat: e?.lat(),
        lng: e?.lng(),
        distance,
      };
      handleGetListPartner(positionDefault, positionDefault);
      setMarkerShow(-1);
    },
    [distance, handleGetListPartner],
  );

  const zoomInPartner = useCallback((lat: number, lng: number, i: number) => {
    setCenterDefault({
      lat,
      lng,
    });
    setMarkerShow(i);
  }, []);

  const renderListPartner = useMemo(() => {
    if (loading) {
      return new Array(3).fill(0).map((item, index: number) => (
        <div className={classes.partnerInfoItem} key={String(index)}>
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
          calculateDistance(locationResult, {
            lng: data.location[0],
            lat: data.location[1],
          }) <= distance,
      )
      .map((res: PartnerInfoModel) =>
        Object.assign(res, {
          distance: calculateDistance(locationResult, {
            lng: res.location[0],
            lat: res.location[1],
          }),
        }),
      )
      .map((partner: PartnerInfoModel, index: number) => (
        <div
          className={classes.partnerInfoItem}
          key={partner?._id}
          onClick={() => zoomInPartner(partner?.location[1], partner?.location[0], index)}>
          <Link href={`/trade-in`}>
            <a className={classes.name}>{partner?.name}</a>
          </Link>
          <div className={classes.location}>
            {partner?.address}, {partner?.city}, {partner?.state}, {partner?.zip_code}
          </div>
          <div className={classes.position}>{partner?.distance?.toFixed(2)} miles</div>
        </div>
      ));
  }, [distance, listPartner, loading, locationResult, zoomInPartner]);
  return (
    <div className={cx(classes.wrapMap, { [classes.disableMap]: isActive })}>
      <div className={cx(classes.partnerNearYou, { [classes.hideListPartner]: !listPartnerVisible })}>
        {renderListPartner}
      </div>
      <Button
        buttonType="clear"
        onClick={() => showListPartner(!listPartnerVisible)}
        className={cx(classes.btnMenu, { [classes.menuClose]: !listPartnerVisible })}>
        <SafeImage src={!listPartnerVisible ? images.common.iconList : images.iconClose} alt="icon close" />
      </Button>
      <div className={classes.ggMap}>
        <ReactGoogleMap
          height="100%"
          marker={listPartner}
          currentPosition={centerDefault}
          zoom={currentZoom}
          isMarkerShow={marketShow}
          markerClick={handleClickToMaker}
          onDragStart={onDragStartGoogleMap}
          onDragEnd={onDragGoogleMap}
        />
      </div>
    </div>
  );
};

export default PartnerNearYou;
