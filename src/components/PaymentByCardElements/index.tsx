import React, { FC, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CONFIG from 'config';
import CheckoutForm from './CheckoutForm';

export const clientSecret = 'pi_3M5QAhJ2ZlRRHzIY0I5q5Aa4_secret_taJg4HbmglNh1nrIe9rfVnn4K';

interface Props {
  ref: any;
  stripe: any;
  elements: any;
}

const PaymentByCardElements: FC<Props> = ({ stripe, elements }) => {
  const stripePromise = loadStripe(CONFIG.STRIPE_API_KEY_B2C);
  const customRef = useRef();
  console.log('customRef123', customRef);

  const options = {
    // passing the client secret obtained in step 3
    clientSecret,
    // Fully customizable with appearance API.
    appearance: {},
    theme: 'stripe',
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
  };

  return (
    <>
      <CheckoutForm clientSecret={clientSecret} ref={customRef} stripe={stripe} elements={elements} />
      {/* {stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <div>
            <CheckoutForm clientSecret={clientSecret} ref={customRef} />
          </div>
        </Elements>
      )} */}
    </>
  );
};

export default PaymentByCardElements;
