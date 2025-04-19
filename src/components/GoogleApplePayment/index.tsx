import Button from '@ui/Buttons/Primary/Button';
import ModalShowMessageUnconnectGoogleApplePay from '@ui/Modal/ModalShowMessageUnconnectGoogleApplePay';
import { GOOGLE_PAY_LOGO } from 'helpers/constraint.helper';
import { checkBrowserIsSafari, isProduction, isStaging } from 'helpers/utilities.helper';
import React, { FC, useEffect, useState } from 'react';
import { injectStripe, ReactStripeElements } from 'react-stripe-elements';
import classes from './google-apple-payment.module.scss';

export interface PaymentByStripeGoogleAppleCard {
  methodName: string;
  paymentMethodId: string;
  paymentRequestResponseData: any;
}

interface CProps {
  handlePaymentByStripeGoogleAppleCard: (values: PaymentByStripeGoogleAppleCard) => void;
  orderTotal: number;
}

type Props = CProps & ReactStripeElements.InjectedStripeProps;

const GoogleApplePayment: FC<Props> = ({ stripe, handlePaymentByStripeGoogleAppleCard, orderTotal }) => {
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [visibleButtonUnconnect, setVisibleButtonUnconnect] = useState(false);
  const [visibleModalUnconnect, setVisibleModalUnconnect] = useState(false);

  useEffect(() => {
    if (!stripe || !orderTotal) {
      return;
    }
    const _paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Order total',
        amount: !isProduction() && !isStaging() ? 1 : orderTotal * 100,
      },
      requestPayerName: true,
      requestShipping: false,
    });
    setPaymentRequest(_paymentRequest);
  }, [stripe, orderTotal]);

  useEffect(() => {
    if (paymentRequest) {
      const elements = stripe.elements();
      const prButton = elements.create('paymentRequestButton', {
        paymentRequest,
      });

      paymentRequest.canMakePayment().then((result: any) => {
        if (result) {
          prButton.mount('#payment-request-button');
          setVisibleButtonUnconnect(false);
        } else {
          document.getElementById('payment-request-button').style.display = 'none';
          setVisibleButtonUnconnect(true);
        }
      });

      paymentRequest.on('paymentmethod', async (data: any) => {
        return handlePaymentByStripeGoogleAppleCard({
          methodName: data?.methodName,
          paymentMethodId: data?.paymentMethod?.id,
          paymentRequestResponseData: data,
        });
      });
    }
  }, [handlePaymentByStripeGoogleAppleCard, orderTotal, paymentRequest, stripe]);

  return (
    <>
      <div id="payment-request-button" />
      {visibleButtonUnconnect && (
        <Button className={classes.customButtonPaymentByGoogleApplePay} onClick={() => setVisibleModalUnconnect(true)}>
          <img src={checkBrowserIsSafari() ? '' : GOOGLE_PAY_LOGO} alt="Apple" />
        </Button>
      )}

      {visibleModalUnconnect && (
        <ModalShowMessageUnconnectGoogleApplePay
          isOpen={visibleModalUnconnect}
          onClose={() => setVisibleModalUnconnect(false)}
          type={checkBrowserIsSafari() ? 'apple' : 'chrome'}
        />
      )}
    </>
  );
};

export default injectStripe(GoogleApplePayment);
