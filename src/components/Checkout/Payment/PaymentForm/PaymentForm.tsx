import React, { FC, useEffect, useState } from 'react';
import Collapse from 'reactstrap/lib/Collapse';
import { useDispatch, useSelector } from 'react-redux';
import { useField, useFormikContext } from 'formik';
import classNames from 'classnames';
import { verifyStripeAccountBySellerId } from 'api/checkout/payment.api';
import Card from '@ui/Cards';
import FormikErrorNotifier from 'components/Formik/FocusField/FormikFocusError';
import config from 'config';
import cartAction from 'store/checkout/cart/cart.action';
import StoreState from 'model/store';
import FormikInput from 'components/Formik/Input/FormikInput';
import { StripeCardCVV, StripeCardExpiry, StripeCardNumber } from 'components/Stripe/CustomStripeElements';
import { PaymentElement } from '@stripe/react-stripe-js';
import images from '@images';
import FormikRadio from '../../../Formik/Radio/FormikRadio';
import classes from './payment-form.module.scss';

export interface PaymentFormModel {
  method: 'card' | 'paypal' | 'googleApplePay';
  nameOnCard: string;
}

interface Props {
  isAllItemBBB: boolean | undefined;
}

const PaymentForm: FC<Props> = ({ isAllItemBBB }) => {
  const [hiddenPaypal, setHiddenPaypal] = useState<boolean>(false);
  const { values, setFieldValue } = useFormikContext<PaymentFormModel>();
  const [{ value: method }] = useField('method');
  const dispatch = useDispatch();
  const carts = useSelector((store: StoreState) => store.checkout.cart.carts);

  useEffect(() => {
    const p2pItems = carts.filter((item) => !item.seller_is_bbb);
    if (p2pItems.length) {
      const payload = {
        seller_id:
          !!p2pItems[0].storefront_id && p2pItems[0].storefront_id !== 'no_provider'
            ? p2pItems[0].storefront_id
            : p2pItems[0].seller_id,
        is_storefront: !!p2pItems[0].storefront_id && p2pItems[0].storefront_id !== 'no_provider',
      };
      verifyStripeAccountBySellerId(payload)
        .then((response) => {
          setHiddenPaypal(!!response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [carts]);
  useEffect(() => {
    if (method === 'paypal') {
      dispatch(cartAction.applyCouponCode(''));
    }
  }, [dispatch, method]);

  return (
    <Card className={classNames(classes.paymentCard)}>
      <FormikErrorNotifier />
      <>
        <div className={classes.paymentMethodGroup}>
          <h3 className={classes.title}>Payment Method</h3>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <FormikRadio name={'method'} label={'Credit/Debit Card'} value={'card'} className={classes.paymentRadio} />
            <div className={classes.imageGroup}>
              <img src={images.checkout.iconMasterCard} alt={'mastercard'} />
              <img src={images.checkout.iconVisa} alt={'visa'} />
              <img src={images.checkout.iconDiscovery} alt={'discovery'} />
              <img src={images.checkout.iconAmericanExpress} alt={'american_express'} />
            </div>
          </div>
          <Collapse isOpen={values.method === 'card'}>
            {isAllItemBBB ? (
              <PaymentElement />
            ) : (
              <div>
                <div className={classes.formGroup}>
                  <label htmlFor={'nameOnCard'} className={classes.labelGroup}>
                    <span className={classes.label}>Full Name</span>
                    <div className={classes.inputWrapper}>
                      <FormikInput
                        name={'nameOnCard'}
                        id={'nameOnCard'}
                        className={classes.control}
                        placeholder={'Name on card'}
                      />
                    </div>
                  </label>
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor={'customer.firstName'} className={classes.labelGroup}>
                    <span className={classes.label}>Card Number</span>
                    <div className={classes.inputWrapper}>
                      <StripeCardNumber />
                    </div>
                  </label>
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor={'customer.firstName'} className={classes.labelGroup}>
                    <span className={classes.label}>Expiration Date</span>
                    <div className={classes.inputWrapper}>
                      <StripeCardExpiry />
                    </div>
                  </label>
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor={'customer.firstName'} className={classes.labelGroup}>
                    <span className={classes.label}>CVV</span>
                    <div className={classes.inputWrapper}>
                      <StripeCardCVV />
                    </div>
                  </label>
                </div>
              </div>
            )}
            {config.NAME === 'DEV' && (
              <div id="demo" className="mt-5">
                <p className="label">Demo in test mode</p>
                <p className="note">You can copy and paste the following test cards to trigger different scenarios:</p>
                <table className="note">
                  <tbody>
                    <tr>
                      <td>Default US card:</td>
                      <td className="card-number">
                        4242
                        <span />
                        4242
                        <span />
                        4242
                        <span />
                        4242
                      </td>
                    </tr>
                    <tr>
                      <td>Insufficient funds:</td>
                      <td className="card-number">
                        4000
                        <span />
                        0000
                        <span />
                        0000
                        <span />
                        9995
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          href="https://stripe.com/guides/strong-customer-authentication"
                          target="_blank"
                          rel="noreferrer noopener">
                          Authentication
                        </a>{' '}
                        required:
                      </td>
                      <td className="card-number">
                        4000
                        <span />
                        0027
                        <span />
                        6000
                        <span />
                        3184
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="note">
                  See the{' '}
                  <a href="https://stripe.com/docs/testing#cards" target="_blank" rel="noreferrer noopener">
                    docs
                  </a>{' '}
                  for a full list of test cards. Non-card payments will redirect to test pages.
                </p>
                <style jsx>
                  {`
                    #demo {
                      padding: 15px;
                      margin: -15px -15px 0;
                      background: #f6f9fc;
                      border-radius: 5px;
                    }

                    #demo a {
                      font-size: 16px !important;
                    }
                    #demo p.label {
                      margin: 0 0 10px;
                      color: #666ee8;
                    }

                    #demo .note {
                      display: block;
                      margin: 10px 0 0;
                      font-size: 14px;
                    }

                    #demo p.note a,
                    #demo p.note em {
                      font-size: 14px;
                    }

                    #demo p.note a:hover {
                      text-decoration: none;
                    }
                    .card-number {
                      padding-left: 8px;
                      white-space: nowrap;
                      font-family: Source Code Pro, monospace;
                      color: #0d2b3e;
                      font-weight: 500;
                    }
                    .card-number span {
                      display: inline-block;
                      width: 8px;
                    }
                  `}
                </style>
              </div>
            )}
          </Collapse>
        </div>
        <hr />
      </>
      {!hiddenPaypal && (
        <>
          <div className={classes.or}>Or</div>
          <div className={classes.paymentMethodGroup}>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <FormikRadio name={'method'} label={'Paypal'} value={'paypal'} className={classes.paymentRadio} />
              <div className={classes.imageGroup}>
                <img src={images.checkout.iconPaypal} alt={'paypal'} style={{ width: 100 }} />
              </div>
            </div>
          </div>
          <hr />
        </>
      )}
    </Card>
  );
};

export default PaymentForm;
