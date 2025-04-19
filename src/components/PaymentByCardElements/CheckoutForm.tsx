import React, { FC, useEffect, useRef, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '@ui/Buttons/Primary/Button';

interface Props {
  clientSecret: string;
  ref: any;
  stripe: any;
  elements: any;
}

const CheckoutForm: FC<Props> = ({ clientSecret, ref, stripe, elements }) => {
  // const stripe = useStripe();
  // const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const refff = useRef();

  useEffect(() => {
    console.log('1312312412412412421', { elements });
  }, [elements]);

  console.log('reff1123', ref?.current);

  // useEffect(() => {
  //   if (stripe) {
  //     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
  //       console.log('paymentIntent123', paymentIntent);
  //     });
  //   }
  // }, [clientSecret, stripe]);

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await (stripe as any).confirmPayment({
      // `Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        shipping: {
          name: 'Johnny Johnson',
          address: {
            line1: '1 Street',
            city: 'Seattle',
            state: 'WA',
            postal_code: '95123',
            country: 'US',
          },
        },
      },
      redirect: 'if_required',
      // confirmParams: {
      //   return_url: 'https://example.com/order/123/complete',
      // },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      console.log('succdeesssssssssss');
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <>
      <PaymentElement />
      <Button disabled={!stripe} onClick={handleSubmit} innerRef={refff}>
        Submit
      </Button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </>
  );
};

export default CheckoutForm;
