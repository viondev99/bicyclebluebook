import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { InputMask } from '@ui/Inputs/Input';
import { CartModel } from 'model/store/checkout/cart.model';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icMinus from 'assets/img/account/personal/ic_close_circle.svg';
import GooglePlacesAutocompleteInput, { InfoGooglePlacesAutocompleteInput } from '@ui/GooglePlacesAutocompleteInput';
import Image from 'next/image';
import useScreenDetect from 'hooks/useScreenDetect';
import FormikInput from '../../../Formik/Input/FormikInput';
import FormikSelect from '../../../Formik/Select/FormikSelect';
import { useListCommonState } from '../../../../hooks/useListCommonState';
import classes from './shipping-form.module.scss';

export interface CustomerShippingForm {
  customer: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    create: boolean;
    password: string;
    confirmPassword: string;
    subscription: boolean;
  };
  shipping: {
    address: string;
    city: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;
    zip: string;
    apartment?: string;
  };
}

export interface ShippingDeliveryInformation {
  customer: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    create: boolean;
    password: string;
    confirmPassword: string;
    subscription: boolean;
  };
  shipping: {
    address: string;
    city: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;
    zip: string;
    apartment?: string;
  };
  billing: BillingAddressForm;
}

export interface BillingAddressForm {
  sameAsShipping: boolean;
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
  ListCartShipping?: CartModel[];
  show?: boolean;
  setShow?: (show: boolean) => void;
}

export interface RefCustomer {
  resetCaptcha: () => void;
}

// eslint-disable-next-line react/display-name
const CustomerForm = forwardRef<RefCustomer, Props>(({ ListCartShipping, show, setShow }, ref) => {
  const state = useListCommonState();
  const { currentWidthScreen } = useScreenDetect();

  const recaptchaInstance = useRef(null);
  const resetCaptcha = () => {
    recaptchaInstance.current.reset();
  };
  useImperativeHandle(ref, () => ({
    resetCaptcha,
  }));
  const { values, setFieldValue } = useFormikContext<CustomerShippingForm>();

  const handleChangeAddressForm = useCallback(
    (valueGoogleForm: InfoGooglePlacesAutocompleteInput) => {
      setFieldValue('shipping.address', valueGoogleForm.address);
      setFieldValue('shipping.city', valueGoogleForm.city);
      setFieldValue('shipping.state', valueGoogleForm.state);
      setFieldValue('shipping.zip', valueGoogleForm.zip);
    },
    [setFieldValue],
  );

  const renderAddApartment = useMemo(() => {
    return (
      <div className={classes.formGroup}>
        <span className={classes.titleImg} onClick={() => setShow(!show)}>
          <div>
            {show && <Image src={icMinus} alt="" height={18} width={18} unoptimized={true} />}
            {!show && <Image src={icAdd} alt="" height={18} width={18} unoptimized={true} />}
          </div>
          <div className={classes.labelImg}>{show ? 'Remove' : 'Add'} Apartment/Suite Number</div>
        </span>
      </div>
    );
  }, [setShow, show]);

  return (
    <div className={classes.infoForm}>
      <h3 className={classes.title}>Customer Information</h3>
      <div className={classes.formGroup}>
        <label htmlFor={'customer.firstName'} className={classes.labelGroup}>
          <span className={classes.label}>First Name</span>
          <div className="w-100">
            <FormikInput name={'customer.firstName'} id={'customer.firstName'} className={classes.control} />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'customer.lastName'} className={classes.labelGroup}>
          <span className={classes.label}>Last Name</span>
          <div className="w-100">
            <FormikInput name={'customer.lastName'} id={'customer.lastName'} className={classes.control} />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'customer.email'} className={classes.labelGroup}>
          <span className={classes.label}>Email Address</span>
          <div className="w-100">
            <FormikInput name={'customer.email'} id={'customer.email'} className={classes.control} />
          </div>
        </label>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor={'customer.phoneNumber'} className={classes.labelGroup}>
          <span className={classes.label}>Phone Number</span>
          <div className="w-100">
            <FormikInput
              name={'customer.phoneNumber'}
              id={'customer.phoneNumber'}
              className={classes.control}
              mask={InputMask.phone}
            />
          </div>
        </label>
      </div>
      {ListCartShipping?.length !== 0 && (
        <>
          <h3 className={cx(classes.title, 'mt-5')}>Shipping Address</h3>
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.firstName'} className={classes.labelGroup}>
              <span className={classes.label}>First name</span>
              <div className="w-100">
                <FormikInput name={'shipping.firstName'} id={'shipping.firstName'} className={classes.control} />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.lastName'} className={classes.labelGroup}>
              <span className={classes.label}>Last name</span>
              <div className="w-100">
                <FormikInput name={'shipping.lastName'} id={'shipping.lastName'} className={classes.control} />
              </div>
            </label>
          </div>
          {renderAddApartment}
          {show && (
            <div className={classes.formGroup}>
              <label htmlFor={'apartment'} className={classes.labelGroup}>
                <span className={classes.labelApartment}>Apartment/{currentWidthScreen > 567 && <br />}Suite No.</span>
                <div className="w-100">
                  <FormikInput name={'shipping.apartment'} id={'apartment'} className={classes.control} />
                </div>
              </label>
            </div>
          )}
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.address'} className={classes.labelGroup}>
              <span className={classes.label}>Address</span>
              <div className="w-100">
                <GooglePlacesAutocompleteInput
                  name={'shipping.address'}
                  id={'address'}
                  className={classes.control}
                  handleChangeAddressForm={handleChangeAddressForm}
                  placeholder=""
                />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.city'} className={classes.labelGroup}>
              <span className={classes.label}>City</span>
              <div className="w-100">
                <FormikInput name={'shipping.city'} id={'shipping.city'} className={classes.control} />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.state'} className={classes.labelGroup}>
              <span className={classes.label}>State</span>
              <div className="w-100">
                <FormikSelect
                  inputId={'state-customer-form'}
                  isSearchable={true}
                  options={state}
                  name={'shipping.state'}
                  id={'shipping.state'}
                  className={classes.control}
                />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.zip'} className={classes.labelGroup}>
              <span className={classes.label}>Zip Code</span>
              <div className="w-100">
                <FormikInput name={'shipping.zip'} id={'shipping.zip'} className={classes.control} />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'shipping.phoneNumber'} className={classes.labelGroup}>
              <span className={classes.label}>Phone Number</span>
              <div className="w-100">
                <FormikInput
                  name={'shipping.phoneNumber'}
                  id={'shipping.phoneNumber'}
                  className={classes.control}
                  mask={InputMask.phone}
                />
              </div>
            </label>
          </div>
        </>
      )}
    </div>
  );
});

export default CustomerForm;
