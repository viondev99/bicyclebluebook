/* eslint-disable no-unused-expressions */
import React, { ComponentType, useState, useCallback, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Form, Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import filter from 'lodash/filter';
import * as yup from 'yup';
import Button from '@ui/Buttons/Primary/Button';
import { BillingAddress, ShippingAddress } from 'api/checkout/payment.api';
import StoreState from 'model/store';
import paymentAction, {
  ConfirmStripePaymentPayload,
  CreatePaypalPaymentPayload,
  CreateStripePaymentP2PPayload,
} from 'store/checkout/payment/payment.action';
import { toastError } from 'helpers/utils.helper';
import cartAction from 'store/checkout/cart/cart.action';
import { setCustomGaRequest } from 'helpers/customGaService.helper';
import CONFIG from 'config';
import useScreenDetect from 'hooks/useScreenDetect';
import { connectSocketPayment } from 'helpers/utilities.helper';
import t from 'helpers/language';
import ModalWaitingPaymentSuccess from '@ui/Modal/ModalWaitingPaymentSuccess';
import { getDetailOrderFailed, getDetailOrder } from 'store/account/personal/orders/orders.action';
import { OrderDetailResponse } from 'model/api/account/personal/orders.model';
import { getDetailOrder as getDetailOrderRequest } from 'api/account/personal/order.api';
import { handleClickReactGA } from 'helpers/constraint.helper';
import { AddPaymentInfoGA, triggerGA4ECommerceEvent, triggerGA4Purchase } from 'helpers/ga4.helper';
import Stepper from '../../Register/Stepper';
import OrderSummary from '../Shipping/OrderSummary/OrderSummary';
import PaymentForm, { PaymentFormModel } from './PaymentForm/PaymentForm';

const steps = [
  { title: 'Delivery Information', step: 1, smallTitle: 'Delivery' },
  { title: 'Make Payment', step: 2, smallTitle: 'Payment' },
  { title: 'Order Confirmation', step: 3, smallTitle: 'Confirmed' },
];

const initialForm: PaymentFormModel = {
  method: 'card',
  nameOnCard: '',
};

const PaymentContent: ComponentType = () => {
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardNumberElement);
  const dispatch = useDispatch();
  const router = useRouter();
  const { replace, query } = router;
  const { cs: clientSecret, od: orderId } = router.query;
  const [step, setStep] = useState(2);
  const { currentWidthScreen } = useScreenDetect();
  const shippingInfo = useSelector((state: StoreState) => state.checkout.cart.shipping);
  const billingInfo = useSelector((state: StoreState) => state.checkout.cart?.billingAddressForm);
  const customerInfo = useSelector((state: StoreState) => state.checkout.cart.customer);
  const carts = useSelector((state: StoreState) => state.checkout.cart.carts);
  const loadingCart = useSelector((state: StoreState) => state.checkout.cart.loading);
  const syncingCart = useSelector((state: StoreState) => state.checkout.cart.syncing);
  const checkoutSuccessId = useSelector((state: StoreState) => state.checkout.payment.checkoutSuccessId);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [loadingButton, setLoadingButton] = useState(false);
  const currentCoupon = useSelector((store: StoreState) => store.checkout.cart.couponCode);
  const socketConnection = useSelector((state: StoreState) => state.checkout.cart.socketConnection);

  const allLocalPickup = useMemo(() => {
    return carts.every((i) => i.local_pickup);
  }, [carts]);

  const isAllItemBBB = useMemo(() => {
    return carts.length > 0 && carts.every((i) => i.seller_is_bbb);
  }, [carts]);

  const validateSchema = yup.object().shape({
    method: yup.string(),
    nameOnCard:
      !isAllItemBBB &&
      yup.string().when('method', {
        is: 'paypal',
        then: yup.string(),
        otherwise: yup.string().required(t('cart.validate.nameOnCard')),
      }),
  });

  const formRef = useRef(null);

  useLayoutEffect(() => {
    if (currentCoupon) {
      dispatch(cartAction.applyCouponCode(currentCoupon));
    }
  }, [currentCoupon, dispatch]);

  useEffect(() => {
    const gaCartInfo = {
      master_listing_id: carts?.length ? carts.map((it) => it.master_listing_id).join() : '',
      inventory_id: carts?.length ? carts.map((it) => it.inventory_id).join() : '',
      inventory_name: '',
      order_id: '',
      order_code: '',
      bicycle_id: carts?.length ? carts.map((it) => it.bicycle_id).join() : '',
      bicycle_name: carts?.length ? carts.map((it) => it.bicycle_name).join() : '',
      trade_in: carts?.length ? carts.map((it) => it.type_id).join() : '',
    };
    setCustomGaRequest('page_view', {
      name: `${router.asPath}`,
      from: `${router.asPath}`,
      ...gaCartInfo,
    });
  }, [carts, router]);

  useEffect(() => {
    // This effect for confirming stripe with payment intent (authenticate require case)
    if (clientSecret && typeof clientSecret === 'string' && typeof orderId === 'string' && stripe) {
      if (!isAllItemBBB) {
        stripe
          .handleCardAction(clientSecret)
          .then((result) => {
            if (result?.paymentIntent?.id) {
              const payload: ConfirmStripePaymentPayload = {
                paymentIntentId: result?.paymentIntent?.id,
                orderId,
              };
              dispatch(paymentAction.confirmStripePaymentP2p(payload));
            }
            replace({ query: {} });
          })
          .catch(() => {
            toastError('Some thing when wrong when authenticate with bank account');
            replace({ query: {} });
          });
      }
    }
  }, [clientSecret, dispatch, isAllItemBBB, stripe, orderId, replace]);
  useEffect(() => {
    dispatch(cartAction.getCarts());
  }, [dispatch]);

  useEffect(() => {
    if (carts.length === 0 && !loadingCart && !syncingCart && !query.orderId) {
      router.replace('/cart');
    }
  }, [carts.length, loadingCart, query.orderId, router, syncingCart]);

  useEffect(() => {
    if (!userInfo && checkoutSuccessId) {
      const socketConnect = connectSocketPayment(null, checkoutSuccessId);
      dispatch(cartAction.saveSocketConnection(socketConnect));
    }
  }, [checkoutSuccessId, dispatch, userInfo]);

  // -------------------------------------------------------------------HAS ORDER ID PARAMS--------------------------------------------------------------------------- //
  const handleResetInfoPayment = useCallback(() => {
    dispatch(cartAction.saveCheckoutShipping(null));
    dispatch(cartAction.saveCheckoutBilling(null));
    dispatch(cartAction.applyCouponCode(''));
    dispatch(paymentAction.setDetailGiftCard(null));
    dispatch(cartAction.saveCheckoutCustomer({}));
    dispatch(getDetailOrderFailed());
  }, [dispatch]);

  useEffect(() => {
    if (!query.orderId) {
      return;
    }
    if (!socketConnection) {
      connectSocketPayment(userInfo?._id, `${query?.id}`);
    }
    let timer: NodeJS.Timeout;
    let tried = 0;
    const checkPaymentStatus = async () => {
      try {
        const response: OrderDetailResponse = await getDetailOrderRequest(`${query?.orderId}`);
        if (response?.status === 'completed') {
          dispatch(paymentAction.setCheckoutSuccessId(`${query?.orderId}`));
          return router.replace(`/checkout/success`);
        }
        router.replace(`/account/order/${`${query?.orderId}`}`);
      } catch (error) {
        //
      }
      if (tried < 6) {
        tried += 1;
        timer = setTimeout(checkPaymentStatus, 1000);
      } else {
        router.replace(`/account/order/${`${query?.orderId}`}`);
      }
    };
    checkPaymentStatus();

    return () => {
      clearTimeout(timer);
      handleResetInfoPayment();
    };
  }, [dispatch, handleResetInfoPayment, query, router, socketConnection, userInfo]);

  useEffect(() => {
    if (!query.orderId) {
      return;
    }
    return () => {
      if (socketConnection) {
        socketConnection.removeAllListeners();
        socketConnection.disconnect();
      }
    };
  }, [query.orderId, socketConnection]);

  useEffect(() => {
    if (query?.orderId) {
      dispatch(getDetailOrder(`${query?.orderId}`));
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (!query.orderId) {
      return;
    }
    if (socketConnection) {
      socketConnection.on('payment_succeeded', (msg: string) => {
        console.log('$ PAYMENT COMPLETED:', msg);
        dispatch(paymentAction.setCheckoutSuccessId(`${query?.orderId}`));

        socketConnection.removeAllListeners();
        socketConnection.disconnect();
        router.replace(`/checkout/success/`);
      });

      socketConnection.on('payment_failed', (msg: string) => {
        console.log('$ PAYMENT FAILED:', msg);
        toastError(msg);
        socketConnection.removeAllListeners();
        socketConnection.disconnect();
        router.replace(`/cart`);
      });
    }
  }, [dispatch, query, router, socketConnection]);

  // -------------------------------------------------------------------END ORDER ID PARAMS--------------------------------------------------------------------------- //

  const handlePaymentByCardelements = useCallback(async () => {
    if (!stripe || !elements) {
      return;
    }
    setLoadingButton(true);

    const { error } = await (stripe as any).confirmPayment({
      elements,
      confirmParams: {
        return_url: `${CONFIG.WEB_URL}checkout/payment?orderId=${checkoutSuccessId}`,
      },
      redirect: 'if_required',
    });
    setLoadingButton(false);

    if (error) {
      toastError(error);
    } else {
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(checkoutSuccessId);
      router.push(`${CONFIG.WEB_URL}checkout/payment?orderId=${checkoutSuccessId}`);
    }
  }, [checkoutSuccessId, elements, router, stripe]);

  const handlePaymentByP2P = useCallback(
    async (
      form: PaymentFormModel,
      shippingAddress: ShippingAddress | undefined,
      billingAddress: BillingAddress | undefined,
    ) => {
      try {
        setLoadingButton(true);
        const payload: any = {
          type: 'card',
          name: form.nameOnCard || '',
          address_city: billingInfo?.city || '',
          address_line1: billingInfo?.address || '',
          address_zip: billingInfo?.zip || '',
          address_state: billingInfo?.state || '',
        };

        const res = await stripe.createToken(cardElement, payload);
        if (res.error || !res.token?.id) {
          throw new Error(res.error.message || t('cart.payWithStripeError'));
        }
        const token = res.token?.id;
        const stripePayload: CreateStripePaymentP2PPayload = {
          token,
          billing_address: billingAddress,
          shipping_address: shippingAddress,
          customer: {
            email: customerInfo.email,
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
          },
          order_items: carts.map((i) => ({
            cart_type: 'manual',
            frame_size: i.frame_size,
            local_pickup: i.local_pickup,
            master_listing_id: i.master_listing_id,
            quantity: i.quantity,
          })),
        };
        dispatch(paymentAction.createStripePaymentP2p(stripePayload));
        setLoadingButton(false);
      } catch (e) {
        toastError(e);
        setLoadingButton(false);
      }
    },
    [
      billingInfo,
      cardElement,
      carts,
      customerInfo.email,
      customerInfo.firstName,
      customerInfo.lastName,
      dispatch,
      stripe,
    ],
  );

  const triggerAddPaymentInfoGA = useCallback(
    (payment_type = '') =>
      carts &&
      triggerGA4ECommerceEvent('add_payment_info', {
        currency: 'USD',
        value: carts.reduce((prev, crr) => prev + crr.current_listed_price, 0),
        coupon: currentCoupon,
        payment_type,
        items: [
          ...carts.map((cartItem, index) => ({
            item_id: String(cartItem.master_listing_id),
            item_name: cartItem.title,
            affiliation: '',
            coupon: '',
            discount: cartItem.current_listed_price - cartItem.discounted_price,
            index,
            item_brand: cartItem.bicycle_brand_name,
            item_category: cartItem.bicycle_type_name,
            item_category2: '',
            item_category3: '',
            item_category4: '',
            item_category5: '',
            item_list_id: '',
            item_list_name: '',
            item_variant: `${cartItem.bicycle_model_name} ${cartItem.bicycle_size_name}`,
            location_id: String(cartItem.location),
            price: cartItem.current_listed_price,
            quantity: cartItem.quantity,
          })),
        ],
      } as AddPaymentInfoGA),
    [carts, currentCoupon],
  );
  const handlePayment = useCallback(
    async (form: PaymentFormModel) => {
      const shippingAddress: ShippingAddress | undefined = allLocalPickup
        ? undefined
        : {
            recipient_name: filter([shippingInfo?.first_name, shippingInfo?.last_name]).join(' '),
            city: shippingInfo?.city,
            line1: shippingInfo?.line1,
            phone: shippingInfo?.phone,
            postal_code: shippingInfo?.postal_code,
            state: shippingInfo?.state,
            apartment: billingInfo?.apartment,
          };
      const billingAddress: BillingAddress | undefined = billingInfo?.sameAsShipping
        ? shippingAddress
        : {
            recipient_name: filter([billingInfo?.firstName, billingInfo?.lastName]).join(' '),
            city: billingInfo?.city,
            line1: billingInfo?.address,
            phone: billingInfo?.phoneNumber,
            postal_code: billingInfo?.zip,
            state: billingInfo?.state,
            apartment: billingInfo?.apartment,
          };
      // card
      if (form.method === 'card') {
        // card - normal
        if (isAllItemBBB) {
          handlePaymentByCardelements();
          triggerAddPaymentInfoGA('card');
          return;
        }
        // card - PTP
        handlePaymentByP2P(form, shippingAddress, billingAddress);
        triggerAddPaymentInfoGA('card');
        return;
      }

      // paypal
      setLoadingButton(true);
      const paypalPayload: CreatePaypalPaymentPayload = {
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        customer: {
          email: customerInfo?.email,
          first_name: customerInfo?.firstName,
          last_name: customerInfo?.lastName,
        },
        order_items: carts.map((i) => ({
          cart_type: 'manual',
          frame_size: i.frame_size,
          local_pickup: i.local_pickup,
          master_listing_id: i.master_listing_id,
          quantity: i.quantity,
        })),
      };
      dispatch(paymentAction.createPaypalPayment(paypalPayload));
      triggerAddPaymentInfoGA('paypal');
      setLoadingButton(false);
    },
    [
      allLocalPickup,
      shippingInfo,
      billingInfo,
      customerInfo,
      carts,
      dispatch,
      triggerAddPaymentInfoGA,
      isAllItemBBB,
      handlePaymentByP2P,
      handlePaymentByCardelements,
    ],
  );

  const handleChangeStep = useCallback(() => {
    router.push('/checkout/shipping');
  }, [router]);

  return (
    <Container className={'mb-5'}>
      <h2>Secure Checkout</h2>
      <Stepper
        showTitleSm={true}
        steps={steps}
        step={step}
        maxStep={3}
        showProgress={false}
        className={'my-4'}
        handleChangeStep={handleChangeStep}
      />
      <Formik validationSchema={validateSchema} initialValues={initialForm} onSubmit={handlePayment} innerRef={formRef}>
        {({ values, setValues, validateField, errors, touched }: FormikProps<PaymentFormModel>) => {
          return (
            <Form>
              {stripe && (
                <>
                  <Row className="mt-3 mb-4">
                    <Col lg={8} className={'mt-3'}>
                      <PaymentForm isAllItemBBB={isAllItemBBB} />
                    </Col>
                    <Col lg={4} className={'mt-3'}>
                      <OrderSummary initCollapseItems={true} />

                      {currentWidthScreen < 1000 ? (
                        <div className="d-flex justify-content-end">
                          <Button className="mt-4" type="submit" disabled={loadingButton} isLoading={loadingButton}>
                            Complete Payment
                          </Button>
                        </div>
                      ) : (
                        <Button className="mt-4 w-100" type="submit" disabled={loadingButton} isLoading={loadingButton}>
                          Complete Payment
                        </Button>
                      )}
                    </Col>
                  </Row>
                </>
              )}
            </Form>
          );
        }}
      </Formik>

      <ModalWaitingPaymentSuccess onClose={() => null} isOpen={!!query?.orderId} />
    </Container>
  );
};

export default PaymentContent;
