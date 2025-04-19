import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import { convertLocation } from 'helpers/utilities.helper';
import { Roles } from 'constants/roles';
import { ProfileResponse } from 'store/account/personal/profile/profile.action';
import { getProfile, getProfileWholeSaler } from 'api/account/personal/profile.api';
import get from 'lodash/get';
import { ShippingType } from 'model/common';
import { CalculateShipmentFee, getShippingCost } from 'api/shipment.api';
import { geocodeByLatLng, getLatLngByIp, GetLatLngByIpResponse } from 'api/common.api';
import classes from './product-shipping.module.scss';
import ProductShippingFee from './ProductShippingFee';

interface GetShippingCost {
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

interface GetShippingCostRequest {
  toCountryCode: string;
  toZipCode: string;
  toLine?: string;
  toCity?: string;
  toStateCode?: string;
}

const ProductShipping: FC = () => {
  const productDetail = useSelector((state: StoreState) => state.marketplace.detail);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [shippingAddress, setshippingAddress] = useState('United States');
  const [shippingCost, setshippingCost] = useState(0);

  const checkCondition = useMemo(() => {
    if (
      productDetail?.status === 'LISTED' &&
      !productDetail.delete &&
      !get(productDetail.shipping, 'isFreeShip', false) &&
      productDetail?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE &&
      productDetail?.masterListingId
    ) {
      return true;
    }
    return false;
  }, [productDetail]);

  const isFreeShipCheck = useMemo(() => {
    return productDetail?.shipping?.isFreeShip || productDetail?.shippingFee === 0;
  }, [productDetail]);

  useEffect(() => {
    getDefaultData();
  }, [userInfo]);

  const mapShippingCost = useCallback(
    async (payload: GetShippingCost) => {
      const id = productDetail?.masterListingId ? `${productDetail?.masterListingId}` : null;
      const { country, zip_code, address, city, state } = payload;

      let params: GetShippingCostRequest = {
        toCountryCode: country || 'US',
        toZipCode: zip_code,
      };

      if (address) {
        params = { ...params, toLine: address };
      }
      if (city) {
        params = { ...params, toCity: city };
      }
      if (state) {
        params = { ...params, toStateCode: state };
      }

      if (id) {
        const response: CalculateShipmentFee = await getShippingCost(id, params);
        setshippingCost(response?.totalCharge);
      }
    },
    [productDetail],
  );

  const mapShippingCostByLatLngByIp = useCallback(async () => {
    const response: GetLatLngByIpResponse = await getLatLngByIp();
    if (response?.zip_code) {
      mapShippingCost({
        country: response?.country_name,
        zip_code: response?.zip_code,
        address: response?.address,
        city: response?.city_name,
        state: response?.country_code,
      });
    }
  }, []);

  const getDefaultData = useCallback(async () => {
    if (userInfo) {
      let responsePersonalInfo: ProfileResponse;
      if (userInfo.role === Roles.PERSONAL) {
        responsePersonalInfo = await getProfile(userInfo?.account);
      }
      if (userInfo.role === Roles.WHOLESALER) {
        responsePersonalInfo = await getProfileWholeSaler(userInfo?.account);
      }

      if (!responsePersonalInfo) {
        return;
      }

      const { zip_code, address, city, state, country } = responsePersonalInfo;
      if (checkCondition) {
        if (zip_code) {
          mapShippingCost({
            address,
            city,
            state,
            country,
            zip_code,
          });
          return;
        }
        mapShippingCostByLatLngByIp();
      }
      setshippingAddress(convertLocation(address, city, state, country));
      return;
    }

    if (checkCondition) {
      mapShippingCostByLatLngByIp();
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const geoLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      geocodeByLatLng(geoLocation).then((results: google.maps.GeocoderResult[]) => {
        setshippingAddress(results?.length && results[0]?.formatted_address);
      });
    });
  }, [userInfo]);

  const renderItemLocation = useMemo(() => {
    return productDetail?.itemLocation || convertLocation(productDetail?.cityName, productDetail?.stateCode);
  }, [productDetail]);

  const renderShipTo = useMemo(() => {
    return productDetail.allowLocalPickup && !productDetail.shippingType ? 'Local pickup only' : shippingAddress;
  }, [productDetail, shippingAddress]);

  const renderShippingFee = useMemo(() => {
    if (isFreeShipCheck) {
      if (productDetail?.allowLocalPickup) {
        return <ProductShippingFee typeCondition={0} />;
      }
      return 'Free shipping';
    }

    switch (productDetail?.shippingType) {
      case ShippingType.BICYCLE_BLUE_BOOK_TYPE: {
        if (productDetail?.allowLocalPickup) {
          return <ProductShippingFee typeCondition={1} shippingCost={shippingCost} />;
        }
        return <ProductShippingFee typeCondition={2} shippingCost={shippingCost} />;
      }

      case ShippingType.FLAT_RATE_TYPE: {
        if (productDetail?.allowLocalPickup) {
          return <ProductShippingFee typeCondition={3} />;
        }
        return <ProductShippingFee typeCondition={4} />;
      }

      default: {
        if (productDetail?.allowLocalPickup) {
          if (productDetail?.shippingType) {
            return <ProductShippingFee typeCondition={5} />;
          }
          return 'Local pickup only. Seller will contact you once the purchase is complete to arrange the pickup.';
        }
        return <ProductShippingFee typeCondition={6} />;
      }
    }
  }, [productDetail]);

  return (
    <section className={'my-5'}>
      {/* <div className={classes.wrapHeader}>Shipping Options & Cost</div> */}
      <div className={classes.shippingInfo}>
        <div className={classes.wrapItem}>
          <div className={classes.title}>Item location</div>
          <div className={classes.description}>{renderItemLocation}</div>
        </div>

        <div className={classes.wrapItem}>
          <div className={classes.title}>Ship to</div>
          <div className={classes.description}>{renderShipTo}</div>
        </div>

        <div className={classes.wrapItem}>
          <div className={classes.title}>Shipping Fee</div>
          <div className={classes.description}>{renderShippingFee}</div>
        </div>
      </div>
    </section>
  );
};

export default ProductShipping;
