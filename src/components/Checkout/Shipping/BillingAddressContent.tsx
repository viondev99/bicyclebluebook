/* eslint-disable no-unused-expressions */
import React, { FC } from 'react';
import PaymentForm from './PaymentForm/PaymentForm';
import { ShippingDeliveryInformation } from './ShippingForm/CustomerForm';

interface Props {
  values: ShippingDeliveryInformation;
  show?: boolean;
  setShow?: (show: boolean) => void;
}

const BillingAddressContent: FC<Props> = ({ values, show, setShow }) => {
  return <PaymentForm formValues={values} show={show} setShow={setShow} />;
};

export default BillingAddressContent;
