import React, { useCallback, useEffect, useMemo } from 'react';
import get from 'lodash/get';
import cx from 'classnames';
import { ShippingType } from 'model/common';
import ListingForm from 'components/Account/Personal/MyListing/Form/FormDraftListing';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import { getBaseComponent } from 'store/value-guide/value-guide.action';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './edit-listing.module.scss';

const EditListingContainer = () => {
  const dispatch = useDispatch();
  const detailListing = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingDraft);

  const findCompValue = useCallback(
    (idComp: number) => {
      // frame material = 11
      // gender = 8
      // brake type = 180
      // frame size = 178
      // Suspension = 12
      // Wheel Size =179
      if (detailListing?.compRequests?.length) {
        const compItem = detailListing?.compRequests.find((item) => item.compId === idComp);
        return compItem ? JSON.stringify({ compId: compItem?.compId, value: compItem?.value }) : null;
      }
      return null;
    },
    [detailListing],
  );

  useEffect(() => {
    dispatch(getBaseComponent());
  }, [dispatch]);

  const shippingMethod = useMemo(() => {
    if (detailListing?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE) {
      return 'bbbShipping';
    }
    if (detailListing?.shippingType === ShippingType.FLAT_RATE_TYPE) {
      return 'flatRate';
    }
    return null;
  }, [detailListing]);

  const carrier = useMemo(() => {
    if (detailListing?.carrierType) {
      return detailListing?.carrierType;
    }
    if (detailListing?.customCarrier) {
      return 'OTHER';
    }
    return '';
  }, [detailListing]);

  const initialValue: FormValue = {
    brand: detailListing?.brandName || '',
    model: detailListing?.modelName || '',
    year: detailListing?.yearName || '',
    yearPreviewImage: '',
    selectedSize: get(detailListing, 'bicycleSizeName', ''),
    selectedType: String(get(detailListing, 'bicycleTypeId', '')),
    description: detailListing?.description || '',
    emailPaypal: detailListing?.emailPaypal || '',
    flatRate: detailListing?.flatRate || null,
    componentFormData: [],
    enableAutoAcceptOffer: detailListing?.bestOffer || false,
    enableBestOfferAccept: !!detailListing?.bestOfferAutoAcceptPrice,
    enableMinimumOfferAccept: !!detailListing?.minimumOfferAutoAcceptPrice,
    localPickupShipping: detailListing?.localPickupShipping || false,
    minimumOfferAutoAcceptPrice: detailListing?.minimumOfferAutoAcceptPrice || null,
    bestOfferAutoAcceptPrice: detailListing?.bestOfferAutoAcceptPrice || null,
    requireInsuranceShipping: !!detailListing?.requireInsuranceShipping,
    enableShipping:
      detailListing?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE ||
      detailListing?.shippingType === ShippingType.FLAT_RATE_TYPE,
    zipCode: detailListing?.zipCode || '',
    city: detailListing?.cityName || '',
    state: detailListing?.state || '',
    country: detailListing?.country || 'US',
    addressLine: detailListing?.addressLine || '',
    countryCode: detailListing?.country || 'US',
    salePrice: detailListing?.salePrice,
    onDragOver: false,
    fileList:
      detailListing?.imageDrafts?.map((item) => ({
        id: String(item.id),
        url: String(item.image),
        file: null,
        initialImage: true,
      })) || [],
    selectedCondition: detailListing?.condition,
    shippingMethod,
    eBikeMileage: String(get(detailListing, 'eBikeMileage', '')),
    eBikeHours: String(get(detailListing, 'eBikeHours', '')),
    serialNumber: detailListing?.serialNumber || '',
    msrpPrice: detailListing?.msrpPrice || 0,
    isAcceptTerms: true,
    isAllowReturn: detailListing?.isAllowReturn || false,
    returnShippingPayer: detailListing?.returnShippingPayer,
    returnWithinDays: String(detailListing?.returnWithinDays) || '0',
    expireAfterDays: detailListing?.isExpirable ? String(detailListing?.expireAfterDays) : '0',
    carrier,
    otherCarrier: detailListing?.customCarrier || '',
    shipCost: detailListing?.flatRate || null,
    length: detailListing?.length || null,
    width: detailListing?.width || null,
    weight: detailListing?.weight || null,
    height: detailListing?.height || null,
    isFreeShip: detailListing?.isFreeShip || false,
    frameMaterial: findCompValue(11),
    gender: findCompValue(8),
    brakeType: findCompValue(180),
    frameSize: findCompValue(178),
    types: String(detailListing?.bicycleTypeId),
    suspensions:
      String(detailListing?.bicycleTypeId) === '5' || String(detailListing?.bicycleTypeId) === '6'
        ? findCompValue(12)
        : '',
    wheelSizes: findCompValue(179),
    hasDiagnosticReport: false,
    chargerIncluded: false,
    chargeCycles: null,
    hasKey: false,
    isTamperedWith: false,
    odometerReading: null,
    profitCalculator: detailListing?.profitCalculator
      ? {
          ...detailListing?.profitCalculator,
          calculatorType: detailListing?.profitCalculator?.calculatorType === 'CALCULATE_PROFIT' ? 'profit' : 'price',
          profitType: detailListing?.profitCalculator?.profitType === 'FIXED_PROFIT' ? 'fixed' : 'margin',
        }
      : null,
  };

  return (
    <div className={cx('container', classes.container)}>
      <div className={classes.header}>
        <h2>Edit Listing</h2>
        <p>Don’t forget to save your changes at the bottom of the page.</p>
      </div>
      <ListingForm initValues={initialValue} />
    </div>
  );
};

export default EditListingContainer;
