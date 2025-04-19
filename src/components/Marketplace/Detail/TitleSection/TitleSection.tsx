import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import Tooltip from 'reactstrap/lib/Tooltip';
import { useStoreInfo } from 'hooks/useStoreInfo';
import { useUserInfo } from 'hooks/useUserInfo';
import AssembleAvailableBadge from '@ui/Product/AssebleAvailableBadge/AssembleAvailableBadge';
import BBBDirectBadge from '@ui/Product/BBBDirectBadge/BBBDirectBadge';
import { getLatLngByIp } from 'api/common.api';
import { getProfile } from 'api/account/personal/profile.api';
import { getShippingCost } from 'api/shipment.api';
import { BBBDirectId } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { ShippingType } from 'model/common';
import iconLocation from 'assets/img/marketplace/ic_location.svg';
import iconShipping from 'assets/img/marketplace/ic_shipping.svg';
import iconNotShipping from 'assets/img/marketplace/ic_not_shipping.svg';
import { formatCurrency } from 'helpers/string.helper';
import classes from './title-section.module.scss';

const TitleSectionSkeleton = () => {
  return (
    <div>
      <h1 className={classes.bikeName}>
        <Skeleton />
      </h1>
      <div className={classes.headInformation}>
        <div className={'d-flex my-2'}>
          <div className={classes.location}>
            <Skeleton width={100} />
          </div>
          <div className={classes.shippingType}>
            {' '}
            <Skeleton width={100} />
          </div>
        </div>
        <div className={'d-flex my-2'} />
      </div>
    </div>
  );
};
const TitleSection: FC = () => {
  const {
    masterListingId,
    title: bikeName,
    cityName,
    stateCode,
    allowLocalPickup,
    shippingType,
    shipping,
    shippingFee,
    status,
    isAvailableAssembled,
    sellerIsBBB,
    delete: deleted,
    loading,
    sellerId,
    storefrontId,
  } = useSelector((state: StoreState) => state.marketplace.detail);
  const user = useSelector((state: StoreState) => state.authenticate.user);
  const isOnlineStore = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const [shippingFromCurrentLocation, setShippingFromCurrentLocation] = useState(0);
  const isFreeShip = shipping?.isFreeShip;
  const userInfo = useUserInfo(sellerId);
  const storeInfo = useStoreInfo(storefrontId);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const isShowBBBDirect = useMemo(() => {
    // eslint-disable-next-line no-nested-ternary
    const BBBId: string = BBBDirectId;

    if (sellerIsBBB && storefrontId === BBBId) {
      return true;
    }
    return false;
  }, [sellerIsBBB, storefrontId]);

  const getShippingFee = useCallback(async () => {
    try {
      if (user && !user?.storefront && !user?.partner) {
        const response = await getProfile(user?.account);
        const shippingWithAddress = await getShippingCost(String(masterListingId), {
          toCountryCode: response.country || 'US',
          toZipCode: response.zip_code,
          toCity: response.city,
          toStateCode: response.state,
          toLine: response.address,
        });
        setShippingFromCurrentLocation(shippingWithAddress.totalCharge);
      } else {
        const response: any = await getLatLngByIp();
        const shippingWithIp = await getShippingCost(String(masterListingId), {
          toCountryCode: 'US',
          toZipCode: response.zip_code,
        });
        setShippingFromCurrentLocation(shippingWithIp.totalCharge);
      }
    } catch (e) {
      console.log(e);
    }
  }, [user, masterListingId]);

  useEffect(() => {
    if (!isFreeShip && !deleted) {
      if (shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE) {
        getShippingFee();
      } else {
        setShippingFromCurrentLocation(shippingFee);
      }
    }
  }, [deleted, isFreeShip, shippingType, status, shippingFee, getShippingFee]);

  const renderFee = () => {
    if (isFreeShip) {
      return 0;
    }
    return shippingFromCurrentLocation || shippingFee || 0;
  };

  const renderBackDropWareHousePickup = useMemo(() => {
    return (
      <h5>
        2240 Paragon Drive, San Jose California.
        <br />
        Warehouse Pickup hours Mon - Friday 10a - 4p
      </h5>
    );
  }, []);

  const renderShippingType = () => {
    if (!shippingType && allowLocalPickup) {
      if (sellerIsBBB) {
        return (
          <>
            <span
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              id="onHoveringTitleShiping">
              Warehouse Pickup Available
            </span>
            <Tooltip
              className={classes.customTooltipTitleSection}
              isOpen={tooltipOpen}
              target={`onHoveringTitleShiping`}>
              {renderBackDropWareHousePickup}
            </Tooltip>
          </>
        );
      }
      return 'Free local pickup';
    }
    return `Shipping fee: ${formatCurrency(renderFee())}`;
  };

  if (loading) {
    return <TitleSectionSkeleton />;
  }
  return (
    <div>
      <h1 className={classes.bikeName}>{bikeName}</h1>
      <div className={classes.headInformation}>
        <div className={'d-flex my-2'}>
          {isOnlineStore ? (
            <div className={classes.seller}>
              Visit the
              <Link
                href={`/marketplace/${storefrontId && storefrontId !== 'no_provider' ? 'online-store' : 'seller'}/[id]`}
                as={`/marketplace/${storefrontId && storefrontId !== 'no_provider' ? 'online-store' : 'seller'}/${
                  storefrontId && storefrontId !== 'no_provider' ? storefrontId : sellerId
                }`}>
                <a>{storefrontId && storefrontId !== 'no_provider' ? storeInfo?.name : userInfo?.name}</a>
              </Link>
            </div>
          ) : (
            <div className={classes.seller}>
              Sold by
              <Link
                href={`/marketplace/${storefrontId && storefrontId !== 'no_provider' ? 'online-store' : 'seller'}/[id]`}
                as={`/marketplace/${storefrontId && storefrontId !== 'no_provider' ? 'online-store' : 'seller'}/${
                  storefrontId && storefrontId !== 'no_provider' ? storefrontId : sellerId
                }`}>
                <a>{storefrontId && storefrontId !== 'no_provider' ? storeInfo?.name : userInfo?.name}</a>
              </Link>
            </div>
          )}
          {storefrontId && <div className={classes.isVerify}>Verified</div>}
        </div>
        <div className={'d-flex flex-wrap my-2'}>
          <div className={classes.location}>
            <img src={iconLocation} alt={'location'} />
            {cityName}, {stateCode}
          </div>
          <div className={classes.shippingType}>
            <img src={!shippingType && allowLocalPickup ? iconNotShipping : iconShipping} alt={'shipping'} />
            {renderShippingType()}
          </div>
          {isShowBBBDirect && (
            <div className={classes.badge}>
              <BBBDirectBadge />
              Verified
            </div>
          )}
          {isAvailableAssembled && (
            <div className={classes.badge}>
              <AssembleAvailableBadge />
              Assembled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
