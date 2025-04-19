import React, { ComponentType, FC, useCallback, useMemo } from 'react';
import config from '../config';
import withScript from './withScript';

export interface WithGoogleMapUtilsProps {
  geoCodeByZipCode: (address: string) => Promise<google.maps.GeocoderResult[]>;
  geoCodeByLatLng: (latLng: google.maps.LatLngLiteral) => Promise<google.maps.GeocoderResult[]>;
}

function withGoogleMapUtils<P = any, T = P & WithGoogleMapUtilsProps>(Wrapped: ComponentType<T>) {
  const WithGoogleMapUtilComponent: FC<T> = (props) => {
    const geocoder = useMemo(() => new window.google.maps.Geocoder(), []);
    const geoCodeByZipCode = useCallback(
      (address: string) => {
        return new Promise((resolve, reject) => {
          const { OK } = window.google.maps.GeocoderStatus;
          geocoder.geocode(
            {
              address,
            },
            (results, status) => {
              if (status !== OK) {
                reject(status);
              } else {
                resolve(results);
              }
            },
          );
        });
      },
      [geocoder],
    );
    const geoCodeByLatLng = useCallback(
      (latLng: google.maps.LatLngLiteral) => {
        return new Promise((resolve, reject) => {
          const { OK } = window.google.maps.GeocoderStatus;
          geocoder.geocode(
            {
              location: latLng,
            },
            (results, status) => {
              if (status !== OK) {
                reject(status);
              } else {
                resolve(results);
              }
            },
          );
        });
      },
      [geocoder],
    );
    return <Wrapped {...props} geoCodeByZipCode={geoCodeByZipCode} geoCodeByLatLng={geoCodeByLatLng} />;
  };
  return withScript<P>({
    src: `https://maps.googleapis.com/maps/api/js?key=${config.GG_MAP_API}&v=3.exp&libraries=geometry,drawing,places`,
  })(WithGoogleMapUtilComponent);
}

export default withGoogleMapUtils;
