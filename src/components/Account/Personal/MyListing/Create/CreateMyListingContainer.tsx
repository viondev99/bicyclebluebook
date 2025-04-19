import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { getStoreInfo, StoreInfoResponse } from 'api/common.api';
import { toastError } from 'helpers/utils.helper';
import ListingForm from 'components/Account/Personal/MyListing/Form/FormCreateListing';
import ListingFormPartsAccessories from 'components/Account/Personal/MyListing/Form/FormCreateListingPartsAccessories';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import { FormListingPartsAccessoriesValue } from 'components/Account/Personal/MyListing/Form/form-accessories';
import { getBaseComponent } from 'store/value-guide/value-guide.action';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getProfile } from 'api/account/personal/profile.api';
import { ProfileResponse } from 'store/account/personal/profile/profile.action';
import { decodeToken } from 'helpers/common.helper';
import Button from '@ui/Buttons/Primary/Button';
import classes from './create-container.module.scss';

const CreateMyListingContainer = () => {
  const dispatch = useDispatch();
  const authenticate = useSelector((store: StoreState) => store.authenticate);
  const { query } = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const [defaultLocation, setDefaultLocation] = useState({
    zipCode: '',
    city: '',
    state: '',
    country: 'US',
    addressLine: '',
    countryCode: 'US',
  });

  useEffect(() => {
    if (authenticate) {
      const user = decodeToken(authenticate.token);
      if (user?.storefront) {
        getStoreInfo(user?.storefront)
          .then((res: StoreInfoResponse) => {
            setDefaultLocation({
              zipCode: res.shipping_address.zip_code,
              city: res.shipping_address.city ?? '',
              state: res.shipping_address.state ?? '',
              country: res.shipping_address.country ?? 'US',
              addressLine: res.shipping_address.address,
              countryCode: res.shipping_address.country_code ?? 'US',
            });
          })
          .catch((err) => {
            toastError(err);
          });
      } else {
        getProfile(user?.account ? user?.account : user?._id)
          .then((res: ProfileResponse) => {
            setDefaultLocation({
              zipCode: res.zip_code,
              city: res.city ?? '',
              state: res.state ?? '',
              country: res.country ?? 'US',
              addressLine: res.address,
              countryCode: 'US',
            });
          })
          .catch((err) => {
            toastError(err);
          });
      }
    }
  }, [authenticate, dispatch]);

  useEffect(() => {
    dispatch(getBaseComponent());
  }, [dispatch]);

  const initialValue: FormValue = {
    listingType: undefined,
    listingTitle: undefined,
    isBuyerPaysSignatureFee: 'true',
    brand: '',
    model: '',
    year: '',
    yearPreviewImage: '',
    selectedSize: '',
    selectedType: '',
    description: '',
    emailPaypal: '',
    flatRate: null,
    componentFormData: [],
    enableAutoAcceptOffer: false,
    enableBestOfferAccept: false,
    enableMinimumOfferAccept: false,
    localPickupShipping: false,
    minimumOfferAutoAcceptPrice: null,
    bestOfferAutoAcceptPrice: null,
    requireInsuranceShipping: false,
    enableShipping: false,
    ...defaultLocation,
    salePrice: null,
    onDragOver: false,
    fileList: [],
    selectedCondition: '',
    shippingMethod: undefined,
    fillingForm: false,
    privatePartyPrice: null,
    eBikeMileage: '',
    eBikeHours: '',
    serialNumber: '',
    msrpPrice: 0,
    isAcceptTerms: false,
    isAllowReturn: false,
    returnShippingPayer: '',
    returnWithinDays: '',
    expireAfterDays: '0',
    carrier: '',
    otherCarrier: '',
    shipCost: null,
    length: null,
    width: null,
    weight: null,
    height: null,
    isFreeShip: false,
    frameMaterial: null,
    gender: null,
    brakeType: null,
    frameSize: null,
    types: null,
    suspensions: '',
    wheelSizes: null,
    hasDiagnosticReport: false,
    chargerIncluded: false,
    chargeCycles: null,
    hasKey: false,
    isTamperedWith: false,
    odometerReading: null,
  };

  const initialListingPartsAccessoriesValue: FormListingPartsAccessoriesValue = {
    listingType: 'PART_ACCESSORIES',
    listingTitle: '',
    isBuyerPaysSignatureFee: 'true',
    brand: '',
    model: '',
    year: '',
    yearPreviewImage: '',
    selectedSize: '',
    selectedType: '',
    description: '',
    emailPaypal: '',
    flatRate: null,
    componentFormData: [],
    enableAutoAcceptOffer: false,
    enableBestOfferAccept: false,
    enableMinimumOfferAccept: false,
    localPickupShipping: false,
    minimumOfferAutoAcceptPrice: null,
    bestOfferAutoAcceptPrice: null,
    requireInsuranceShipping: false,
    enableShipping: false,
    ...defaultLocation,
    salePrice: null,
    onDragOver: false,
    fileList: [],
    selectedCondition: '',
    shippingMethod: undefined,
    fillingForm: false,
    privatePartyPrice: null,
    eBikeMileage: '',
    eBikeHours: '',
    serialNumber: '',
    msrpPrice: 0,
    isAcceptTerms: false,
    isAllowReturn: false,
    returnShippingPayer: '',
    returnWithinDays: '',
    expireAfterDays: '0',
    carrier: '',
    otherCarrier: '',
    shipCost: null,
    length: null,
    width: null,
    weight: null,
    height: null,
    isFreeShip: false,
    frameMaterial: null,
    gender: null,
    brakeType: null,
    frameSize: null,
    types: null,
    suspensions: '',
    wheelSizes: null,
    hasDiagnosticReport: false,
    chargerIncluded: false,
    chargeCycles: null,
    hasKey: false,
    isTamperedWith: false,
    odometerReading: null,
  };

  const handleChangeTab = useCallback(
    (numberTab) => {
      if (window.confirm('Do you really want to leave?')) {
        setCurrentTab(numberTab);
      }
    },
    [currentTab],
  );

  return (
    <div className={cx('container', classes.container)}>
      <div className={classes.header}>
        <h2>Create a New Listing</h2>
        {/* <p>
          Create your advert to sell your bike on the <br />
          Bicycle Blue Book marketplace.
        </p> */}
      </div>
      <div className={classes.listingCreateCtn}>
        <div className={classes.tabMenus}>
          <Button
            type={'button'}
            className={`${classes.buttonTabs} ${currentTab === 0 && classes.active}`}
            onClick={() => handleChangeTab(0)}>
            <span>Bicycle</span>
          </Button>
          <Button
            type={'button'}
            className={`${classes.buttonTabs} ${currentTab === 1 && classes.active}`}
            onClick={() => handleChangeTab(1)}>
            <span>Parts & Accessories</span>
          </Button>
        </div>
        {currentTab === 0 ? (
          <ListingForm initValues={initialValue} />
        ) : (
          <ListingFormPartsAccessories initValues={initialListingPartsAccessoriesValue} />
        )}
      </div>
    </div>
  );
};

export default CreateMyListingContainer;
