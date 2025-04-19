import React, { useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { ShippingType } from 'model/common';
import ListingFormPartsAccessories from 'components/Account/Personal/MyListing/Form/FormCreateListingPartsAccessories';
import { FormListingPartsAccessoriesValue } from 'components/Account/Personal/MyListing/Form/form-accessories';
import { getBaseComponent } from 'store/value-guide/value-guide.action';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './sell-similar.module.scss';

const SellSimilarPartAndAccessoriesContainer = () => {
  const dispatch = useDispatch();
  const detailListing = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingListed);
  const authenticate = useSelector((store: StoreState) => store.authenticate);

  const findCompValue = useCallback(
    (idComp: number) => {
      // frame material = 11
      // gender = 8
      // brake type = 180
      // frame size = 178
      // Suspension = 12
      // Wheel Size =179
      if (detailListing?.inventoryComponents) {
        const compItem = detailListing?.inventoryComponents.find((item) => item.id.inventoryCompTypeId === idComp);
        return compItem ? JSON.stringify({ compId: compItem?.id?.inventoryCompTypeId, value: compItem?.value }) : null;
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

  const initialValue: FormListingPartsAccessoriesValue = {
    ignoreStripe: false,
    isBuyerPaysSignatureFee: detailListing?.isBuyerPaysSignatureFee ? 'true' : 'false',
    listingTitle: detailListing?.title || '',

    brand: detailListing?.bicycleBrandName || '',
    model: detailListing?.bicycleModelName || '',
    year: detailListing?.bicycleYearName || '',
    yearPreviewImage: '',
    selectedSize: detailListing?.bicycleSizeName || '',
    selectedType: detailListing?.bicycleTypeName || '',
    description: detailListing?.description || '',
    emailPaypal: detailListing?.paypalEmailSeller || '',
    flatRate: detailListing?.flatRate || null,
    componentFormData: [],
    enableAutoAcceptOffer: detailListing?.bestOffer || false,
    enableBestOfferAccept: !!detailListing?.bestOfferAutoAcceptPrice,
    enableMinimumOfferAccept: !!detailListing?.minimumOfferAutoAcceptPrice,
    localPickupShipping: detailListing?.allowLocalPickup || false,
    minimumOfferAutoAcceptPrice: detailListing?.minimumOfferAutoAcceptPrice || null,
    bestOfferAutoAcceptPrice: detailListing?.bestOfferAutoAcceptPrice || null,
    requireInsuranceShipping: detailListing?.insurance === true,
    enableShipping:
      detailListing?.shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE ||
      detailListing?.shippingType === ShippingType.FLAT_RATE_TYPE,
    zipCode: detailListing?.zipCode || '',
    city: detailListing?.cityName || '',
    state: detailListing?.stateCode || '',
    country: detailListing?.countryName || 'US',
    addressLine: detailListing?.addressLine || '',
    countryCode: detailListing?.countryCode || 'US',
    salePrice: detailListing?.currentListedPrice,
    onDragOver: false,
    fileList: detailListing?.inventoryImages
      ? detailListing?.inventoryImages?.map((item) => ({
          id: String(item.id),
          url: String(item.image),
          file: null,
          initialImage: true,
          inventoryId: item.inventoryId,
        }))
      : [],
    selectedCondition: detailListing?.condition,
    shippingMethod,
    eBikeMileage: detailListing?.eBikeMileage || '',
    eBikeHours: detailListing?.eBikeHours || '',
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
        <h2>Create a New Listing</h2>
        <p>
          Create your advert to sell your bike on the <br />
          Bicycle Blue Book marketplace.
        </p>
      </div>
      <ListingFormPartsAccessories initValues={initialValue} />
    </div>
  );
};

export default SellSimilarPartAndAccessoriesContainer;
