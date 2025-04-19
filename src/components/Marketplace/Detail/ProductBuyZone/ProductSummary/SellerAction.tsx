import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import filter from 'lodash/filter';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { getInventoryShipment } from 'api/store-front/listings.api';
import marketplaceActions from 'store/marketplace/marketplace.action';
import Button from '@ui/Buttons/Primary/Button';
import { isNewDataPrintLabel } from 'helpers/date.helper';
import { printLabel } from 'helpers/common.helper';
import { ShippingType } from 'model/common';
import { StageInventory } from 'model/store/common.model';
import Input from '@ui/Inputs/Input';
import Select from '@ui/Select/Select';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import StoreState from 'model/store';
import { StatusMarketListing } from 'constants/marketplace';
import { getShipping, reListProduct, shipToBuyer } from 'api/marketplace.api';
import { toastError } from 'helpers/utils.helper';
import classes from './product-summary.module.scss';

const carrierTypes = [
  {
    value: 'UPS',
    label: 'UPS',
  },
  {
    value: 'USPS',
    label: 'USPS',
  },
  {
    value: 'FEDEX',
    label: 'FEDEX',
  },
];

const SellerAction: FC = () => {
  const [carrier, setCarrier] = useState(carrierTypes[0].value);
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const { push } = useRouter();
  const isUserBBBStaff = useUserIsBBB();
  const disableAddCart = isUserBBBStaff;
  const {
    status,
    totalListings,
    stageInventory,
    inventoryId,
    shippingType,
    masterListingId,
    marketListingId,
    timeSold,
  } = useSelector((state: StoreState) => state.marketplace.detail);
  const isStorefront = useSelector((state: StoreState) => !!state.authenticate?.user?.storefront);
  useEffect(() => {
    if (stageInventory === StageInventory.ShippedToCustomer && shippingType === ShippingType.FLAT_RATE_TYPE) {
      getInventoryShipment(String(inventoryId))
        .then((res) => {
          setTrackingNumber(res?.trackingNumber);
          setCarrier(res?.manualCarrier);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  }, [stageInventory, shippingType, inventoryId]);
  const isSingleListing = totalListings === 1;
  const dispatch = useDispatch();
  const handleRenewListing = useCallback(() => {
    setLoading(true);
    return reListProduct(masterListingId)
      .then(() => {
        setLoading(false);
        dispatch(marketplaceActions.getDetailProduct(masterListingId));
      })
      .catch((err) => {
        setLoading(false);
        toastError(err);
      });
  }, [dispatch, masterListingId]);
  const handleSendToBuyer = useCallback(() => {
    setLoading(true);
    shipToBuyer({
      id: marketListingId,
      manualCarrier: carrier,
      manualTrackingNumber: trackingNumber,
    })
      .then(() => {
        setLoading(false);
        dispatch(marketplaceActions.getDetailProduct(masterListingId));
      })
      .catch((err) => {
        setLoading(false);
        toastError(err);
      });
  }, [carrier, dispatch, masterListingId, trackingNumber, marketListingId]);
  const handlePrintLabel = useCallback(async () => {
    if (!isUserBBBStaff && isNewDataPrintLabel(timeSold)) {
      push(`/marketplace/buy-now/${masterListingId}/print-label`);
    } else {
      const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
      try {
        const response = await getShipping(marketListingId);
        if (Array.isArray(response)) {
          printLabel(
            newWindow,
            response.map((i) => i.fullLinkLabel),
          );
        } else {
          printLabel(newWindow, response.fullLinkLabel);
        }
      } catch (e) {
        setTimeout(() => newWindow && newWindow.close(), 500);
      }
    }
  }, [isUserBBBStaff, masterListingId, marketListingId, timeSold, push]);

  const linkToEditListing = useMemo(() => {
    return `/${isStorefront ? 'store-front' : 'account'}/mylistings/edit/listed/${masterListingId}`;
  }, [isStorefront, masterListingId]);
  const renderContent = () => {
    if (status === StatusMarketListing.DE_LISTED) {
      return (
        <Col xs={12} style={{ marginTop: 20, padding: '0 5px' }}>
          <Button
            isLoading={loading}
            buttonType={'primary'}
            buttonSize={'l'}
            className={classes.buyButton}
            onClick={handleRenewListing}>
            Re-List
          </Button>
        </Col>
      );
    }
    if (status === StatusMarketListing.EXPIRED && isSingleListing) {
      return (
        <>
          <Col xs={'auto'} style={{ marginTop: 20, padding: '0 5px' }}>
            <Link href={linkToEditListing}>
              <Button buttonType={'primary'} buttonSize={'l'} className={classes.buyButton}>
                Edit Listing
              </Button>
            </Link>
          </Col>
          <Col xs={'auto'} style={{ marginTop: 20, padding: '0 5px' }}>
            <Button
              isLoading={loading}
              buttonType={'primary'}
              buttonSize={'l'}
              className={classes.buyButton}
              onClick={handleRenewListing}>
              Re-new
            </Button>
          </Col>
        </>
      );
    }
    if (status === StatusMarketListing.SOLD && isSingleListing) {
      const isShipped = stageInventory === StageInventory.ShippedToCustomer;
      return shippingType === ShippingType.FLAT_RATE_TYPE ? (
        <>
          <Col xs={12} style={{ marginTop: 20, padding: '0 5px' }}>
            <Select
              inputId={'select-carrier'}
              placeholder={'Select Carrier'}
              value={carrier}
              options={carrierTypes}
              disabled={isShipped}
              onChange={(value: { value: string; label: string }) => {
                setCarrier(value.value);
              }}
            />
            <Input
              className="mt-3 mb-3"
              placeholder={'Enter Tracking Number'}
              disabled={isShipped}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button
              isLoading={loading}
              buttonType={'primary'}
              buttonSize={'l'}
              className={classes.buyButton}
              disabled={disableAddCart || isShipped}
              onClick={handleSendToBuyer}>
              Send to buyer
            </Button>
          </Col>
        </>
      ) : (
        <>
          {!isUserBBBStaff && shippingType && (
            <Col xs={12} style={{ padding: '0 5px' }}>
              <Button
                buttonType={'primary'}
                buttonSize={'l'}
                className={classes.buyButton}
                disabled={disableAddCart}
                onClick={handlePrintLabel}>
                Print Label
              </Button>
            </Col>
          )}
        </>
      );
    }
    if (isSingleListing && status === StatusMarketListing.LISTED) {
      return (
        <Col xs={'auto'} style={{ marginTop: 30, padding: '0 5px' }}>
          <Link href={linkToEditListing}>
            <Button buttonType={'primary'} buttonSize={'l'} className={classes.buyButton} disabled={disableAddCart}>
              Edit Listing
            </Button>
          </Link>
        </Col>
      );
    }
    return null;
  };

  return <Row style={{ margin: '20px -5px 0' }}>{renderContent()}</Row>;
};
export default SellerAction;
