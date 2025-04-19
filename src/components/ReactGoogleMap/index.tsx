import React, { useRef, useCallback, useMemo } from 'react';
// import Link from 'next/link';
import { ListPartnerResponse, PartnerInfoModel } from 'api/dealer-locator';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import CONFIG from 'config';
import { useRouter } from 'next/router';
import classes from './google-map.module.scss';
import icAdress from '../../assets/img/instant-payout/ic_address.svg';
import icPhone from '../../assets/img/instant-payout/ic_phone.svg';

interface Position {
  lat: number;
  lng: number;
}

interface Props {
  currentPosition?: Position;
  marker: ListPartnerResponse;
  zoom: number;
  markerClick?: (i: number) => void;
  onDragEnd: (e: google.maps.LatLng) => void;
  onDragStart: () => void;
  isMarkerShow?: number;
  height?: string;
}

const GoogleMapComponent = (props: Props) => {
  const mapRefs = useRef<GoogleMap>(null);
  const router = useRouter();
  const toggleOpenMaker = useCallback(() => {
    if (props.markerClick) {
      props.markerClick(-1);
    }
  }, [props]);
  const showInfo = useCallback(
    (i: number) => {
      if (props.markerClick) {
        props.markerClick(i);
      }
    },
    [props],
  );
  const showCenter = useCallback(() => {
    props.onDragEnd(mapRefs?.current?.getCenter());
  }, [mapRefs, props]);

  const showWebsiteSeeTradeIn = (item: PartnerInfoModel) => {
    if (item?.widget_enable === true && item?.widget_url) {
      if (item.widget_url.search('http') > -1 || item.website.search('http') > -1) {
        return (
          <a href={item.widget_url ? item.widget_url : item.website} className={classes.link}>
            Trade in here
          </a>
        );
      }
      return (
        <a href={`http://${item?.widget_url ? item?.widget_url : item?.website}`} className={classes.link}>
          Trade in here
        </a>
      );
    }
    return null;
  };
  const checkPath = useMemo(() => {
    if (router?.pathname.includes('dealer-locator')) {
      return true;
    }
    return false;
  }, [router]);
  return (
    <GoogleMap
      zoom={Number(props.zoom)}
      center={{
        lat: Number(props.currentPosition.lat),
        lng: Number(props.currentPosition.lng),
      }}
      ref={mapRefs}
      onDragEnd={showCenter}
      onDragStart={props.onDragStart}>
      {props?.marker
        ? props?.marker?.map((item: PartnerInfoModel, i: number) => (
            <Marker
              key={String(i)}
              icon="https://i.imgur.com/QLTYZtV.png"
              position={{
                lat: Number(item.location[1]),
                lng: Number(item.location[0]),
              }}
              onClick={() => showInfo(i)}>
              {props.isMarkerShow === i ? (
                <InfoWindow onCloseClick={() => toggleOpenMaker()} options={{ maxWidth: 260 }}>
                  <>
                    {/* <Link href={`/trade-in`}> */}
                    <a href={'/trade-in'} className={classes.linkTradeIn}>
                      {item.name}
                    </a>
                    {/* </Link> */}
                    {item?.state && item?.city && item?.zip_code ? (
                      <div className={classes.wrapItem}>
                        <img src={icAdress} alt="" />
                        <span
                          className={
                            classes.state
                          }>{`${item?.address}, ${item.city}, ${item.state}, ${item.zip_code}`}</span>
                      </div>
                    ) : null}
                    {item?.phone && (
                      <div className={classes.wrapItem}>
                        <img src={icPhone} alt="" />
                        <span className={classes.phone}>{item?.phone}</span>
                      </div>
                    )}
                    {checkPath && (
                      <a href={'/trade-in'} className={classes.btnTrade}>
                        Trade in here
                      </a>
                    )}
                    {checkPath && showWebsiteSeeTradeIn(item)}
                  </>
                </InfoWindow>
              ) : null}
            </Marker>
          ))
        : null}
    </GoogleMap>
  );
};

const MyMapComponent = withScriptjs(withGoogleMap(GoogleMapComponent));

const ReactGoogleMaps = (props: Props) => (
  <MyMapComponent
    {...props}
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${CONFIG.GG_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: props.height ? props.height : '350px' }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

export default ReactGoogleMaps;
