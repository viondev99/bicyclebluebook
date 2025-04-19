import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import { getListPartner, cancelGetListPartner } from 'store/dealer-locator/dealer-locator.action';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards/index';
import Select from '@ui/Select/Select';
import { Option } from 'react-select/src/filters';
import useScreenDetect from 'hooks/useScreenDetect';
import ReactGoogleMap from 'components/ReactGoogleMap';
import { milesOptions } from 'constants/dealer-locator';
import { getLatLngByIp, geoCodeByZipCode, DetectLocationResponse } from 'api/common.api';
import { toastError } from 'helpers/utils.helper';
import Input from '@ui/Inputs/Input';
import { PositionPartner } from 'model/store/dealer-locator';
import StoreState from 'model/store';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import ListPartnerNearYou from './ListPartnerNearYou';
import classes from './dealer-locator.module.scss';

const DealerNearYou = () => {
  const [marketShow, setMarkerShow] = useState<number>(-1);
  const screen = useScreenDetect();
  const [centerDefault, setCenterDefault] = useState<PositionPartner>({
    lat: 37.37024,
    lng: -121.87744,
  });
  const [locationResult, setLocationResult] = useState<PositionPartner>({
    lat: 37.37024,
    lng: -121.87744,
  });
  const [zipCode, setZipCode] = useState<string>('');
  const [errorZipCode, setErrorZipCode] = useState<string>(null);
  const [distance, setDistance] = useState<number>(10);
  const [currentZoom, setZoom] = useState<number>(11);
  const listPartner = useSelector((store: StoreState) => store.dealerLocator.listPartner);
  const loading = useSelector((store: StoreState) => store.dealerLocator.loading);
  const dispatch = useDispatch();

  const handleClickToMaker = useCallback((i: number) => {
    setMarkerShow(i);
  }, []);

  const handleGetListPartner = useCallback(
    (params: PositionPartner, position?: PositionPartner) => {
      dispatch(getListPartner(params));
      if (position) {
        setLocationResult(position);
        setCenterDefault(position);
      }
    },
    [dispatch],
  );
  const findPartnerCurrentPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          distance,
        };
        handleGetListPartner(params, params);
      },
      (error) => {
        getLatLngByIp()
          .then((jsonData: DetectLocationResponse) => {
            const positionDefault = {
              lat: jsonData.latitude,
              lng: jsonData.longitude,
              distance,
            };
            handleGetListPartner(positionDefault, positionDefault);
          })
          .catch((err) => {
            const positionDefault = {
              lat: 37.37024,
              lng: -121.87744,
              distance,
            };
            handleGetListPartner(positionDefault, positionDefault);
          });
      },
    );
  }, [distance, handleGetListPartner]);
  useEffect(() => {
    setZipCode('');
    setErrorZipCode('');
    findPartnerCurrentPosition();
  }, [findPartnerCurrentPosition]);

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

  const filterPartnerByDistance = useCallback(
    (value: number) => {
      let zoomChange = 10;
      if (value === 10) zoomChange = 11;
      if (value === 25) zoomChange = 10;
      if (value === 50) zoomChange = 9;
      if (value === 100) zoomChange = 8;
      setDistance(value);
      setZoom(zoomChange);
      setMarkerShow(-1);
      handleGetListPartner({ ...locationResult, distance: value });
    },
    [handleGetListPartner, locationResult],
  );
  const handleSearchPartner = useCallback(() => {
    const rgxZipCode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    if (!zipCode) {
      setErrorZipCode(t('common.validate.zipCodeRequired'));
      return;
    }
    if (!rgxZipCode.test(zipCode.trim())) {
      setErrorZipCode('Your zip code is invalid.');
      return;
    }
    geoCodeByZipCode(zipCode)
      .then((results: google.maps.GeocoderResult[]) => {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const newPosition = { lat, lng };
        handleGetListPartner(newPosition, newPosition);
      })
      .catch(() => toastError('Your zip code is invalid.'));
  }, [handleGetListPartner, zipCode]);

  const renderGoogleMap = useMemo(() => {
    return (
      <ReactGoogleMap
        marker={listPartner}
        currentPosition={centerDefault}
        zoom={currentZoom}
        isMarkerShow={marketShow}
        markerClick={handleClickToMaker}
        onDragStart={onDragStartGoogleMap}
        onDragEnd={onDragGoogleMap}
      />
    );
  }, [centerDefault, currentZoom, handleClickToMaker, listPartner, marketShow, onDragGoogleMap, onDragStartGoogleMap]);

  const renderListPartner = useMemo(() => {
    return (
      <Card className={classes.listDealerContain}>
        <ListPartnerNearYou
          distance={distance}
          locationResult={locationResult}
          loading={loading}
          listPartner={listPartner}
          zoomInPartner={zoomInPartner}
        />
      </Card>
    );
  }, [distance, listPartner, loading, locationResult, zoomInPartner]);

  const findYourCurrentPosition = useCallback(() => {
    setZipCode('');
    setErrorZipCode('');
    findPartnerCurrentPosition();
  }, [findPartnerCurrentPosition]);
  const renderContent = useMemo(() => {
    return screen.currentWidthScreen >= 1024 ? (
      <>
        <Col lg={4}>{renderListPartner}</Col>
        <Col lg={8}>{renderGoogleMap}</Col>
      </>
    ) : (
      <>
        <Col lg={8} className={classes.mapMobile}>
          {renderGoogleMap}
        </Col>
        <Col lg={4}>{renderListPartner}</Col>
      </>
    );
  }, [renderGoogleMap, renderListPartner, screen]);
  return (
    <section className={classes.dealerNearYouWrap} id={'find-a-dealer-near-you'}>
      <Container>
        <h1 className={classes.titleDealer}>Find a Dealer Near You</h1>
        <Card className={classes.searchDealer}>
          <p className={classes.titleSearch}>Search within</p>
          <Select
            inputId={'Search-miles-within'}
            className={classes.select}
            selectSize={'l'}
            options={milesOptions}
            value={String(distance)}
            onChange={(option: Option) => filterPartnerByDistance(Number(option.value))}
          />
          <p className="mb-0">of</p>
          <div className={classes.groupSearch}>
            <div>
              <Input
                type="string"
                className={classes.inputSearch}
                value={zipCode}
                placeholder="Zip Code"
                isError={!!errorZipCode}
                onChange={(e) => {
                  setZipCode(e.target.value);
                  setErrorZipCode(null);
                }}
              />
              {errorZipCode && <div className={classes.errorLine}>{errorZipCode}</div>}
            </div>
            <Button buttonType="primary" onClick={handleSearchPartner} className={classes.btnSearch}>
              Search
            </Button>
          </div>
          <div>
            or,{' '}
            <Button buttonType="clear" className={classes.customBtn} onClick={findYourCurrentPosition}>
              find your location.
            </Button>
          </div>
        </Card>
        <Row>{renderContent}</Row>
      </Container>
    </section>
  );
};

export default DealerNearYou;
