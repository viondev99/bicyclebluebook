import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import Recaptcha from 'react-recaptcha';
import { CartModel } from 'model/store/checkout/cart.model';
import CONFIG from 'config';
import FormikInput from '../../../Formik/Input/FormikInput';
import classes from './shipping-form.module.scss';
import FormikCheckbox from '../../../Formik/CheckBox/FormikCheckbox';

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
}

interface Props {
  onCaptchaChange: (captcha: string) => void;
  ListCartShipping?: CartModel[];
}

export interface RefCustomer {
  resetCaptcha: () => void;
}

// eslint-disable-next-line react/display-name
const CreateAcountCustomerForm = forwardRef<RefCustomer, Props>(({ onCaptchaChange, ListCartShipping }, ref) => {
  const recaptchaInstance = useRef(null);
  const [verifyCaptcha, setVerifyCaptcha] = useState(null);
  const verifyCaptchaCallback = (response: any) => {
    setVerifyCaptcha(response);
  };
  const expiredCaptchaCallback = () => {
    resetCaptcha();
  };
  const resetCaptcha = () => {
    recaptchaInstance.current.reset();
  };
  useEffect(() => {
    onCaptchaChange(verifyCaptcha);
  }, [onCaptchaChange, verifyCaptcha]);
  useImperativeHandle(ref, () => ({
    resetCaptcha,
  }));
  const callback = () => {};
  const { values, setFieldValue } = useFormikContext<CustomerShippingForm>();

  return (
    <div className={classes.createAccountForm}>
      <FormikCheckbox name={'customer.create'} label={'Create an account'} />
      {values.customer.create && (
        <>
          <div className={classes.formGroup}>
            <label htmlFor={'customer.username'} className={classes.labelGroup}>
              <span className={classes.label}>Username</span>
              <div className="w-100">
                <FormikInput name={'customer.username'} id={'customer.username'} className={classes.control} />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'customer.password'} className={classes.labelGroup}>
              <span className={classes.label}>Password</span>
              <div className="w-100">
                <FormikInput
                  type={'password'}
                  name={'customer.password'}
                  id={'customer.password'}
                  className={classes.control}
                />
              </div>
            </label>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor={'customer.confirmPassword'} className={classes.labelGroup}>
              <span className={classes.label}>Confirm Password</span>
              <div className="w-100">
                <FormikInput
                  type={'password'}
                  name={'customer.confirmPassword'}
                  id={'customer.confirmPassword'}
                  className={classes.control}
                />
              </div>
            </label>
          </div>
          <FormikCheckbox
            className={'mt-4'}
            name={'customer.subscription'}
            label={
              <span className={classes.subscriptionCheckboxLabel}>
                Check if you would like to receive marketing communications regarding Bicycle Blue Book products,
                services, and events. (You can unsubscribe in your preferences at any time.)
              </span>
            }
          />
          <Recaptcha
            ref={recaptchaInstance}
            render="explicit"
            verifyCallback={verifyCaptchaCallback}
            onloadCallback={callback}
            expiredCallback={expiredCaptchaCallback}
            sitekey={CONFIG.RECAPCHA_SITE_KEY}
            // size="compact"
          />
        </>
      )}
    </div>
  );
});

export default CreateAcountCustomerForm;
