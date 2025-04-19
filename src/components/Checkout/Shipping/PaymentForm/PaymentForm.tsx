import React, { FC, useCallback, useMemo, useState } from 'react';
import Collapse from 'reactstrap/lib/Collapse';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import cx from 'classnames';
import Card from '@ui/Cards';
import { InputMask } from '@ui/Inputs/Input';
import GooglePlacesAutocompleteInput, { InfoGooglePlacesAutocompleteInput } from '@ui/GooglePlacesAutocompleteInput';
import StoreState from 'model/store';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icMinus from 'assets/img/account/personal/ic_close_circle.svg';
import { useListCommonState } from 'hooks/useListCommonState';
import Image from 'next/image';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './payment-form.module.scss';
import FormikInput from '../../../Formik/Input/FormikInput';
import FormikCheckbox from '../../../Formik/CheckBox/FormikCheckbox';
import FormikSelect from '../../../Formik/Select/FormikSelect';
import { ShippingDeliveryInformation } from '../ShippingForm/CustomerForm';

interface Props {
  formValues: ShippingDeliveryInformation;
  show?: boolean;
  setShow?: (show: boolean) => void;
}

const PaymentForm: FC<Props> = ({ show, setShow }) => {
  const state = useListCommonState();
  const { currentWidthScreen } = useScreenDetect();
  const { values, setFieldValue } = useFormikContext<ShippingDeliveryInformation>();
  const carts = useSelector((store: StoreState) => store.checkout.cart.carts);
  const isLoggedIn = useSelector((store: StoreState) => !!store.authenticate.token);

  const allLocalPickup = useMemo(() => {
    return carts.every((i) => i.local_pickup);
  }, [carts]);

  const handleChangeAddressForm = useCallback(
    (valueGoogleForm: InfoGooglePlacesAutocompleteInput) => {
      setFieldValue('billing.address', valueGoogleForm.address);
      setFieldValue('billing.city', valueGoogleForm.city);
      setFieldValue('billing.state', valueGoogleForm.state);
      setFieldValue('billing.zip', valueGoogleForm.zip);
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
    <Card className={cx(classes.paymentCard)}>
      <div className={cx(isLoggedIn ? classes.paymentMethodGroup : classes.paymentMethodGroupNoLogin)}>
        <h3 className="mb-5">Billing Address</h3>
        {!allLocalPickup && (
          <FormikCheckbox name={'billing.sameAsShipping'} label={'Billing address is the same as shipping address'} />
        )}
        <Collapse isOpen={!values.billing.sameAsShipping}>
          <div id="idFirstName">
            <div className={classes.formGroup}>
              <label htmlFor={'firstName'} className={classes.labelGroup}>
                <span className={classes.label}>First name</span>
                <div className="w-100">
                  <FormikInput name={'billing.firstName'} id={'firstName'} className={classes.control} />
                </div>
              </label>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor={'lastName'} className={classes.labelGroup}>
                <span className={classes.label}>Last name</span>
                <div className="w-100">
                  <FormikInput name={'billing.lastName'} id={'lastName'} className={classes.control} />
                </div>
              </label>
            </div>
            {renderAddApartment}
            {show && (
              <div className={classes.formGroup}>
                <label htmlFor={'apartment'} className={classes.labelGroup}>
                  <span className={classes.labelApartment}>
                    Apartment/{currentWidthScreen > 567 && <br />}Suite No.
                  </span>
                  <div className="w-100">
                    <FormikInput name={'billing.apartment'} id={'apartment'} className={classes.control} />
                  </div>
                </label>
              </div>
            )}
            <div className={classes.formGroup}>
              <label htmlFor={'address'} className={classes.labelGroup}>
                <span className={classes.label}>Address</span>
                <div className="w-100">
                  <GooglePlacesAutocompleteInput
                    name={'billing.address'}
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
                  <FormikInput name={'billing.city'} id={'city'} className={classes.control} />
                </div>
              </label>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor={'state'} className={classes.labelGroup}>
                <span className={classes.label}>State</span>
                <div className="w-100">
                  <FormikSelect
                    inputId={'state-payment-form'}
                    isSearchable={true}
                    options={state}
                    name={'billing.state'}
                    id={'state'}
                    className={cx(classes.control, classes.stateSelect)}
                  />
                </div>
              </label>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor={'zip'} className={classes.labelGroup}>
                <span className={classes.label}>Zip Code</span>
                <div className="w-100">
                  <FormikInput name={'billing.zip'} id={'zip'} className={classes.control} />
                </div>
              </label>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor={'phoneNumber'} className={classes.labelGroup}>
                <span className={classes.label}>Phone Number</span>
                <div className="w-100">
                  <FormikInput
                    name={'billing.phoneNumber'}
                    id={'phoneNumber'}
                    className={classes.control}
                    mask={InputMask.phone}
                  />
                </div>
              </label>
            </div>
          </div>
        </Collapse>
      </div>
    </Card>
  );
};

export default PaymentForm;
