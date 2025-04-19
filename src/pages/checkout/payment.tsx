import React, { FC, useEffect, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CONFIG from 'config';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { ComponentStatic } from '../../model/common';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';
import PaymentContent from '../../components/Checkout/Payment/PaymentContent';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const stripeFonts = [
  {
    cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans&display=swap',
  },
];

const Payment: FC & ComponentStatic = () => {
  const router = useRouter();
  const { query } = useRouter();
  const dataPaymentIntent = useSelector((state: StoreState) => state.checkout.payment.dataPaymentIntent);

  const carts = useSelector((store: StoreState) => store.checkout.cart.carts);
  const checkoutSuccessId = useSelector((state: StoreState) => state.checkout.payment.checkoutSuccessId);

  const isAllItemBBB = useMemo(() => {
    return carts.length > 0 && carts.every((i) => i?.seller_is_bbb);
  }, [carts]);
  const stripePromise = useMemo(() => {
    return loadStripe(isAllItemBBB ? CONFIG.STRIPE_API_KEY_B2C : CONFIG.STRIPE_API_KEY_P2P);
  }, [isAllItemBBB]);

  // const clientSecret = 'pi_3M5QAhJ2ZlRRHzIY0I5q5Aa4_secret_taJg4HbmglNh1nrIe9rfVnn4K';
  const clientSecret = useMemo(() => {
    if (query?.orderId && !dataPaymentIntent) {
      return checkExistLocalStorage() && localStorage.getItem('client_secret');
    }
    return dataPaymentIntent?.client_secret;
  }, [dataPaymentIntent, query]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    if (!checkoutSuccessId && !query?.orderId) {
      router.replace(`/`);
    }
  }, [checkoutSuccessId, query, router]);

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <div className="wrapper-with-header extra-light-container">
            <PaymentContent />
          </div>
        </Elements>
      ) : null}
    </>
  );
};

Payment.renderLayout = renderMainLayout;

export default withInjectAllSaga(Payment);
