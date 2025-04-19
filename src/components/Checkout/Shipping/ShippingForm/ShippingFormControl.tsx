import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { InputMask } from '@ui/Inputs/Input';
import { useListCommonState } from 'hooks/useListCommonState';
import GooglePlacesAutocompleteInput, { InfoGooglePlacesAutocompleteInput } from '@ui/GooglePlacesAutocompleteInput';
import Image from 'next/image';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icMinus from 'assets/img/account/personal/ic_close_circle.svg';
import useScreenDetect from 'hooks/useScreenDetect';
import FormikInput from '../../../Formik/Input/FormikInput';
import FormikSelect from '../../../Formik/Select/FormikSelect';

import classes from './shipping-form.module.scss';

interface AddShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  apartment?: string;
}

interface Props {
  setFieldValue: (fieldName: string, value: string) => void;
  disabled?: boolean;
  address?: AddShippingForm;
  setShow?: (show: boolean) => void;
}

const ShippingFormControl: FC<Props> = ({ children, disabled, setFieldValue, setShow, address }) => {
  const state = useListCommonState();
  const { currentWidthScreen } = useScreenDetect();
  const [showApartment, setShowApartment] = useState<boolean>(false);

  useEffect(() => {
    if (address?.apartment) {
      setShowApartment(true);
    }
  }, []);

  useEffect(() => {
    if (showApartment) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [setShow, showApartment]);

  const handleChangeAddressForm = useCallback(
    (valueGoogleForm: InfoGooglePlacesAutocompleteInput) => {
      setFieldValue('address', valueGoogleForm.address);
      setFieldValue('city', valueGoogleForm.city);
      setFieldValue('state', valueGoogleForm.state);
      setFieldValue('zip', valueGoogleForm.zip);
    },
    [setFieldValue],
  );

  const renderAddApartment = useMemo(() => {
    return (
      <div className={classes.formGroup}>
        <span className={classes.titleImg} onClick={() => setShowApartment(!showApartment)}>
          <div>
            {showApartment && <Image src={icMinus} alt="" height={18} width={18} unoptimized={true} />}
            {!showApartment && <Image src={icAdd} alt="" height={18} width={18} unoptimized={true} />}
          </div>
          <div className={classes.labelImg}>{showApartment ? 'Remove' : 'Add'} Apartment/Suite Number</div>
        </span>
      </div>
    );
  }, [showApartment]);

  return (
    <>
      <div className={classes.formGroup}>
        <label htmlFor={'firstName'} className={classes.labelGroup}>
          <span className={classes.label}>First name</span>
          <div className="w-100">
            <FormikInput disabled={disabled} name={'firstName'} id={'firstName'} className={classes.control} />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'lastName'} className={classes.labelGroup}>
          <span className={classes.label}>Last name</span>
          <div className="w-100">
            <FormikInput disabled={disabled} name={'lastName'} id={'lastName'} className={classes.control} />
          </div>
        </label>
      </div>
      {renderAddApartment}
      {showApartment && (
        <div className={classes.formGroup}>
          <label htmlFor={'apartment'} className={classes.labelGroup}>
            <span className={classes.labelApartment}>
              Apartment/{currentWidthScreen > 567 && <br />}
              Suite No.
            </span>
            <div className="w-100">
              <FormikInput disabled={disabled} name={'apartment'} id={'apartment'} className={classes.control} />
            </div>
          </label>
        </div>
      )}
      <div className={classes.formGroup}>
        <label htmlFor={'address'} className={classes.labelGroup}>
          <span className={classes.label}>Address</span>
          <div className="w-100">
            <GooglePlacesAutocompleteInput
              disabled={disabled}
              name={'address'}
              id={'address'}
              className={classes.control}
              handleChangeAddressForm={handleChangeAddressForm}
              placeholder=""
            />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'city'} className={classes.labelGroup}>
          <span className={classes.label}>City</span>
          <div className="w-100">
            <FormikInput disabled={disabled} name={'city'} id={'city'} className={classes.control} />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'state'} className={classes.labelGroup}>
          <span className={classes.label}>State</span>
          <div className="w-100">
            <FormikSelect
              inputId={'state-shipping-checkout-form-control'}
              isSearchable={true}
              options={state}
              name={'state'}
              id={'state'}
              className={classes.control}
            />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'zip'} className={classes.labelGroup}>
          <span className={classes.label}>Zip Code</span>
          <div className="w-100">
            <FormikInput disabled={disabled} name={'zip'} id={'zip'} className={classes.control} />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'phoneNumber'} className={classes.labelGroup}>
          <span className={classes.label}>Phone Number</span>
          <div className="w-100">
            <FormikInput
              disabled={disabled}
              name={'phoneNumber'}
              id={'phoneNumber'}
              className={classes.control}
              mask={InputMask.phone}
            />
          </div>
        </label>
      </div>
    </>
  );
};

export default ShippingFormControl;
