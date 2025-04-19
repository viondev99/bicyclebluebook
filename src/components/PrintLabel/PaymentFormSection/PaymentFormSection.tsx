import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ReactStripeElements, injectStripe } from 'react-stripe-elements';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';

import images from 'assets/images';

import StoreState from 'model/store';
import t from 'helpers/language';
import { formatCurrency } from 'helpers/string.helper';
import { toastError } from 'helpers/utils.helper';
import { getMessageFromError, printLabel } from 'helpers/common.helper';
import { getShippingCost, payWithPaypal, payWithStripe } from 'api/shipment.api';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import FormikInput from '../../Formik/Input/FormikInput';
import FormikRadio from '../../Formik/Radio/FormikRadio';
import { StripeCardCVV, StripeCardExpiry, StripeCardNumber } from '../../Stripe/CustomStripeElements';
import classes from './payment-form-section.module.scss';

const PaymentSchema = Yup.object().shape({
  fullName: Yup.string().when('payType', {
    is: 'paypal',
    then: Yup.string(),
    otherwise: Yup.string().required(t('common.validateRequired')),
  }),
});

interface FormPayment {
  payType: 'credit' | 'paypal';
  fullName: string;
}

const PaymentFormSection: React.FC = () => {
  const { masterListingId, addressLine, cityName, stateCode, zipCode, sale } = useSelector(
    (state: StoreState) => state.marketplace.detail,
  );
  const router = useRouter();
  const [cost, setCost] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardNumberElement);

  useEffect(() => {
    if (!cost && addressLine && cityName && stateCode && zipCode) {
      setLoading(true);
      getShippingCost(String(masterListingId), {
        toCountryCode: sale?.shippingCountryCode || 'US',
        toZipCode: sale?.shippingPostalCode,
        toStateCode: sale?.shippingState || undefined,
        toCity: sale?.shippingCity,
        toLine: sale?.shippingAddressLine,
      })
        .then((response) => {
          setCost(response.totalCharge);
          setLoading(false);
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          setLoading(false);
        });
    }
  }, [cost, masterListingId, sale, addressLine, cityName, stateCode, zipCode]);

  const initialValues = useMemo(() => {
    return {
      payType: 'credit',
      fullName: '',
    };
  }, []);

  const handlePayWithPaypal = useCallback(() => {
    const payload = {
      order_id: sale?.orderId,
      master_listing_id: String(masterListingId),
      shipping_fee: cost || sale?.shippingFee,
      shipping_address: {
        recipient_name: sale?.buyerDisplayName,
        line1: sale?.shippingAddressLine,
        city: sale?.shippingCity,
        state: sale?.shippingState,
        postal_code: sale?.shippingPostalCode,
        phone: sale?.shippingPhone,
      },
    };
    payWithPaypal(payload)
      .then((response) => {
        window.location.replace(response.link);
        setLoading(false);
      })
      .catch((error) => {
        toastError(getMessageFromError(error));
        setLoading(false);
      });
  }, [masterListingId, sale, cost]);

  const handlePayWithStripe = useCallback(
    (token: string) => {
      const payload = {
        token,
        order_id: sale?.orderId,
        master_listing_id: String(masterListingId),
        shipping_fee: cost || sale?.shippingFee,
        shipping_address: {
          recipient_name: sale?.buyerDisplayName,
          line1: sale?.shippingAddressLine,
          city: sale?.shippingCity,
          state: sale?.shippingState,
          postal_code: sale?.shippingPostalCode,
          phone: sale?.shippingPhone,
        },
      };
      payWithStripe(payload)
        .then((response) => {
          setLoading(false);
          const newWindow: any = window.open('', '_blank', 'width=1000,height=600,rel="noopener"');
          printLabel(newWindow, response.fullLinkLabel);
          router.replace('/marketplace/buy-now/[id]', `/marketplace/buy-now/${masterListingId}`);
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          setLoading(false);
        });
    },
    [masterListingId, sale, cost, router],
  );

  const handleFormSubmit = useCallback(
    (values: FormPayment) => {
      setLoading(true);
      if (values.payType === 'credit') {
        stripe
          .createToken(cardElement, {
            // type: 'card',
            name: values.fullName,
            address_line1: addressLine,
            address_city: cityName,
            address_state: stateCode,
            address_zip: zipCode,
          })
          .then((response) => {
            if (response.error) {
              toastError(response.error.message);
              setLoading(false);
            } else if (response.token) {
              const token = response.token.id;
              handlePayWithStripe(token);
            } else {
              toastError(t('cart.payWithStripeError'));
              setLoading(false);
            }
          })
          .catch((error) => {
            toastError(getMessageFromError(error));
            setLoading(false);
          });
      } else {
        handlePayWithPaypal();
      }
    },
    [stripe, cardElement, addressLine, cityName, stateCode, zipCode, handlePayWithStripe, handlePayWithPaypal],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={handleFormSubmit}
      validationSchema={PaymentSchema}>
      {({ handleSubmit, values, isValid }) => (
        <form onSubmit={handleSubmit}>
          <Card className={classes.paymentFormContainer}>
            <h1 className={classes.paymentFormTitle}>Payment</h1>
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-5">
              <FormikRadio
                name={'payType'}
                label={'Credit/Debit Card'}
                value={'credit'}
                className={classes.paymentRadio}
              />
              <div className={classes.imageGroup}>
                <img src={images.checkout.iconMasterCard} alt={'mastercard'} />
                <img src={images.checkout.iconVisa} alt={'visa'} />
                <img src={images.checkout.iconDiscovery} alt={'discovery'} />
                <img src={images.checkout.iconAmericanExpress} alt={'american_express'} />
              </div>
            </div>
            <div className={classes.paymentFormRow}>
              <h4 className={classes.inputLabel}>Full Name</h4>
              <div className={classes.input}>
                <FormikInput name={'fullName'} />
              </div>
            </div>
            <div className={classes.paymentFormRow}>
              <h4 className={classes.inputLabel}>Card Number</h4>
              <div className={classes.input}>
                <StripeCardNumber />
              </div>
            </div>
            <div className={classes.paymentFormRow}>
              <h4 className={classes.inputLabel}>Expiration Date</h4>
              <div className={classes.input}>
                <StripeCardExpiry />
              </div>
            </div>
            <div className={classes.paymentFormRow}>
              <h4 className={classes.inputLabel}>CVV</h4>
              <div className={classes.input}>
                <StripeCardCVV />
              </div>
            </div>
            <div className={classes.divider} />
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <FormikRadio name={'payType'} label={'Paypal'} value={'paypal'} className={classes.paymentRadio} />
              <div className={classes.imageGroup}>
                <img src={images.checkout.iconPaypal} alt={'paypal'} style={{ width: 100 }} />
              </div>
            </div>
            <div className={classes.divider} />
            <div className={classes.buttonGroup}>
              <div className={classes.shippingCost}>
                <p className={classes.label}>Total</p>
                <p className={classes.value}>{formatCurrency(cost, false)}</p>
              </div>
              <Button type="submit" disabled={loading || !isValid} buttonSize={'l'}>
                Pay
              </Button>
            </div>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default PaymentFormSection;
