/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik, FormikProps } from 'formik';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import Head from 'next/head';
import Button from '@ui/Buttons/Primary/Button';
import StoreState from 'model/store';
import t from 'helpers/language';
import cartAction from 'store/checkout/cart/cart.action';
import { ShippingSingle } from 'model/store/checkout/shipping.model';
import { CustomerInfoModel } from 'model/store/checkout/cart.model';
import { toastError } from 'helpers/utils.helper';
import { setCustomGaRequest } from 'helpers/customGaService.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import {
  createOrder,
  createOrderGuest,
  CreateOrderResponse,
  CreatePaymentIntentNewLogic,
  createPaymentIntentNewLogic,
} from 'api/checkout/payment.api';
import cx from 'classnames';
// import ModalConfirmApplyGiftCard from '@ui/Modal/ModalConfirmApplyGiftCard';
import { Roles } from 'constants/roles';
import paymentAction from 'store/checkout/payment/payment.action';
import Input from '@ui/Inputs/Input';
import Card from '@ui/Cards';
import { CreatePaymentIntentNewLogicResponse } from 'model/store/cart.model';
import { checkExistLocalStorage, kountConfigEnv } from 'helpers/utilities.helper';
import { BeginCheckoutGA, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import { uuid } from 'uuidv4';
import BillingAddressContent from './BillingAddressContent';
import Stepper from '../../Register/Stepper';
import ShippingForm from './ShippingForm/ShippingForm';
import OrderSummary from './OrderSummary/OrderSummary';
import CustomerForm, { RefCustomer, ShippingDeliveryInformation } from './ShippingForm/CustomerForm';
import classes from './shipping-content.module.scss';
import CreateAcountCustomerForm from './ShippingForm/CreateAcountCustomerForm';

const steps = [
  { title: 'Delivery Information', step: 1, smallTitle: 'Delivery' },
  { title: 'Make Payment', step: 2, smallTitle: 'Payment' },
  { title: 'Order Confirmation', step: 3, smallTitle: 'Confirmed' },
];

const ShippingContent: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [captcha, setCaptcha] = useState('');
  const customerForm = useRef<RefCustomer>(null);
  const { currentWidthScreen } = useScreenDetect();
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const shippingInfo = useSelector((state: StoreState) => state.checkout.cart.shipping);
  const billingInfo = useSelector((state: StoreState) => state.checkout.cart.billingAddressForm);
  const customerInfo = useSelector((state: StoreState) => state.checkout.cart.customer);
  const detailGiftCard = useSelector((state: StoreState) => state.checkout.payment.detailGiftCard);
  // const canCheckout = useSelector((state: StoreState) => !!state.checkout.cart.shipping?._id);
  const currentCoupon = useSelector((store: StoreState) => store.checkout.cart.couponCode);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const carts = useSelector((state: StoreState) => state.checkout.cart.carts);
  const loadingCart = useSelector((state: StoreState) => state.checkout.cart.loading);
  const syncingCart = useSelector((state: StoreState) => state.checkout.cart.syncing);
  const createGuestStatus = useSelector((state: StoreState) => state.checkout.cart.createGuestStatus);

  const allLocalPickup = useMemo(() => {
    return carts.every((i) => i.local_pickup);
  }, [carts]);

  const isAllItemBBB = useMemo(() => {
    return carts.length > 0 && carts.every((i) => i.seller_is_bbb);
  }, [carts]);
  const [visibleShippingInfo, setVisibleShippingInfo] = useState(false);
  const [visibleBillingInfo] = useState(false);
  const [scrollToBillingError, setScrollToBillingError] = useState(true);
  const [coupon, setCoupon] = useState('');
  // const [visibleModalApplyTradeInCreditForPurchase, setVisibleModalApplyTradeInCreditForPurchase] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [apartmentBilling, setApartmentBilling] = useState<boolean>(false);
  const [apartmentShipping, setApartmentShiping] = useState<boolean>(false);

  const [payloadSubmitGuestOrder, setPayloadSubmitGuestOrder] = useState<{
    form: ShippingDeliveryInformation;
    payload: any;
    isWaiting: boolean;
  }>();

  const initialValues: ShippingDeliveryInformation = {
    customer: {
      email: customerInfo?.email || '',
      username: customerInfo?.username || '',
      firstName: customerInfo?.firstName || '',
      lastName: customerInfo?.lastName || '',
      phoneNumber: customerInfo?.phoneNumber || '',
      create: false,
      password: customerInfo?.password || '',
      confirmPassword: customerInfo?.confirmPassword || '',
      subscription: false,
    },
    shipping: {
      address: shippingInfo?.line1 || '',
      city: shippingInfo?.city || '',
      firstName: shippingInfo?.first_name || '',
      lastName: shippingInfo?.last_name || '',
      phoneNumber: shippingInfo?.phone || '',
      state: shippingInfo?.state || '',
      zip: shippingInfo?.postal_code || '',
      apartment: shippingInfo?.apartment || '',
    },
    billing: {
      sameAsShipping: billingInfo?.sameAsShipping || false,
      firstName: billingInfo?.firstName || '',
      lastName: billingInfo?.lastName || '',
      address: billingInfo?.address || '',
      city: billingInfo?.city || '',
      state: billingInfo?.state || '',
      zip: billingInfo?.zip || '',
      phoneNumber: billingInfo?.phoneNumber || '',
      apartment: billingInfo?.apartment || '',
    },
  };

  const ListCartShipping = carts?.filter((item) => !item?.local_pickup && item?.seller_is_bbb);

  const validateSchema = useMemo(
    () =>
      yup.object().shape({
        customer:
          !isLoggedIn &&
          yup.object().shape({
            email: yup.string().required(t('common.validate.emailRequired')).email(t('common.validate.emailInvalid')),
            firstName: yup.string().required(t('common.validate.firstNameRequired')),
            lastName: yup.string().required(t('common.validate.lastNameRequired')),
            phoneNumber: yup
              .string()
              .required(t('common.validate.phoneNumberRequired'))
              .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
            create: yup.boolean(),
            username: yup.string().when('create', {
              is: true,
              then: yup.string().required(t('common.validate.userNameRequired')),
            }),
            password: yup.string().when('create', {
              is: true,
              then: yup
                .string()
                .min(8, t('common.validate.passwordLength'))
                .required(t('common.validate.passwordRequired')),
            }),
            confirmPassword: yup.string().when('create', {
              is: true,
              then: yup
                .string()
                .required(t('common.validate.confirmPasswordRequired'))
                .oneOf([yup.ref('password')], t('common.validate.confirmPasswordMatch')),
            }),
            subscription: yup.boolean(),
          }),
        shipping:
          !isLoggedIn &&
          ListCartShipping?.length !== 0 &&
          yup.object().shape({
            address: yup.string().required(t('common.validate.addressRequired')),
            city: yup.string().required(t('common.validate.cityRequired')),
            firstName: yup.string().required(t('common.validate.firstNameRequired')),
            lastName: yup.string().required(t('common.validate.lastNameRequired')),
            phoneNumber: yup
              .string()
              .required(t('common.validate.phoneNumberRequired'))
              .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
            state: yup.string().required(t('common.validate.stateRequired')),
            zip: yup
              .string()
              .required(t('common.validate.zipCodeRequired'))
              .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
          }),
        billing: yup.object().shape({
          firstName: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required('First name is required'),
          }),
          lastName: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required('Last name is required'),
          }),
          address: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required(t('common.validate.addressRequired')),
          }),
          city: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required(t('common.validate.cityRequired')),
          }),
          state: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required(t('common.validate.stateRequired')),
          }),
          zip: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required(t('cart.validate.postalCode')),
          }),
          phoneNumber: yup.string().when('sameAsShipping', {
            is: true,
            then: yup.string(),
            otherwise: yup.string().required(t('common.validate.phoneNumberRequired')),
          }),
        }),
      }),
    [ListCartShipping, isLoggedIn],
  );

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
    if (carts?.length) {
      triggerGA4ECommerceEvent('begin_checkout', {
        currency: 'USD',
        value: carts.reduce((prev, crr) => prev + crr.current_listed_price, 0),
        coupon: currentCoupon,
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
      } as BeginCheckoutGA);
    }
  }, [carts, currentCoupon]);

  useEffect(() => {
    if (!shippingInfo) {
      dispatch(cartAction.getCarts());
    }
  }, [dispatch, shippingInfo]);
  useEffect(() => {
    if (carts.length === 0 && !loadingCart && !syncingCart) {
      router.replace('/cart');
    }
  }, [carts.length, loadingCart, router, syncingCart]);

  useLayoutEffect(() => {
    if (!currentCoupon) {
      // change input to blank when remove current coupon
      setCoupon('');
    }
    dispatch(cartAction.applyCouponCode(currentCoupon));
  }, [currentCoupon, dispatch]);

  // useEffect(() => {
  //   if (
  //     detailGiftCard?.gift_card_value > 0 &&
  //     detailGiftCard?.giftcard_code !== '' &&
  //     detailGiftCard?.gift_card_status &&
  //     !detailGiftCard.isHideModal &&
  //     isAllItemBBB &&
  //     (detailGiftCard?.gift_card_online_store_id === '' ||
  //       carts.some((it) => it.storefront_id === detailGiftCard?.gift_card_online_store_id))
  //   ) {
  //     setVisibleModalApplyTradeInCreditForPurchase(true);
  //   }
  // }, [carts, detailGiftCard, dispatch, isAllItemBBB]);

  useEffect(() => {
    if (userInfo?.role === Roles.PERSONAL && isAllItemBBB) {
      dispatch(
        paymentAction.getDetailGiftCard({
          customer: userInfo?.account,
          need_more: 'gift_card',
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // create guest order after register
  useEffect(() => {
    const createOrderGuestEff = async () => {
      dispatch(cartAction.changeCreateGuestStatus('idle'));
      const { form, payload } = payloadSubmitGuestOrder;
      try {
        setLoadingButton(true);
        const createOrderFn = payloadSubmitGuestOrder.isWaiting ? createOrder : createOrderGuest;
        const responseCreateOrder: CreateOrderResponse = await createOrderFn(payload);
        if (responseCreateOrder?.session_id !== undefined) {
          import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
            kountSDK(kountConfigEnv(), responseCreateOrder?.session_id);
          });
        }
        const payloadCreatePaymentIntent: CreatePaymentIntentNewLogic = {
          order_id: responseCreateOrder?._id,
          email: form?.customer?.email,
          shipping_address: payload?.shipping_address,
        };
        const responseCreatePaymentIntent: CreatePaymentIntentNewLogicResponse = await createPaymentIntentNewLogic(
          payloadCreatePaymentIntent,
        );
        dispatch(paymentAction.setDataPaymentIntent(responseCreatePaymentIntent));
        dispatch(paymentAction.setCheckoutSuccessId(responseCreateOrder._id));
        localStorage.setItem('client_secret', responseCreatePaymentIntent?.client_secret);
        setLoadingButton(false);

        router.push('/checkout/payment');
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
      }
    };
    if (payloadSubmitGuestOrder) {
      if (payloadSubmitGuestOrder.isWaiting && createGuestStatus !== 'success') {
        return;
      }
      createOrderGuestEff();
    }
  }, [dispatch, payloadSubmitGuestOrder, router, createGuestStatus]);

  const validateForm = useCallback(
    (formValues: ShippingDeliveryInformation) => {
      if (!allLocalPickup && !shippingInfo?._id) {
        toastError('Please select your shipping address to continue');
        setVisibleShippingInfo(false);
        window.scroll({ top: 20, behavior: 'smooth' });
        return;
      }
      if (
        !formValues.billing.sameAsShipping &&
        (formValues?.billing.firstName === '' ||
          formValues?.billing.lastName === '' ||
          formValues?.billing.address === '' ||
          formValues?.billing.city === '' ||
          formValues?.billing.state === '' ||
          formValues?.billing.zip === '' ||
          formValues?.billing.phoneNumber === '') &&
        scrollToBillingError
      ) {
        setScrollToBillingError(false);
        document?.querySelector('#idFirstName')?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    },
    [allLocalPickup, scrollToBillingError, shippingInfo],
  );

  // const handleCloseModalApplyTradeInCreditForPurchase = useCallback(() => {
  //   setVisibleModalApplyTradeInCreditForPurchase(false);
  //   dispatch(
  //     paymentAction.setDetailGiftCard({
  //       ...detailGiftCard,
  //       discountValue: 0,
  //       isHideModal: true,
  //     }),
  //   );
  // }, [detailGiftCard, dispatch]);

  // const handleApplyTradeInCreditForPurchase = useCallback(
  //   (_discountValue: number) => {
  //     setVisibleModalApplyTradeInCreditForPurchase(false);
  //     dispatch(
  //       paymentAction.setDetailGiftCard({
  //         ...detailGiftCard,
  //         isHideModal: true,
  //         discountValue: _discountValue,
  //       }),
  //     );
  //   },
  //   [detailGiftCard, dispatch],
  // );

  const applyCoupon = useCallback(() => {
    dispatch(cartAction.applyCouponCode(coupon?.trim()));
  }, [coupon, dispatch]);
  const removeCoupon = useCallback(() => {
    dispatch(cartAction.applyCouponCode(''));
  }, [dispatch]);

  const handleSubmitFormNotLogin = useCallback(
    async (form: ShippingDeliveryInformation) => {
      try {
        const shipping: Partial<ShippingSingle> =
          ListCartShipping?.length !== 0
            ? {
                _id: '_',
                postal_code: form.shipping.zip,
                line1: form.shipping.address,
                state: form.shipping.state,
                city: form.shipping.city,
                last_name: form.shipping.lastName,
                first_name: form.shipping.firstName,
                phone: form.shipping.phoneNumber,
                apartment: form?.shipping?.apartment,
              }
            : null;

        if (form.customer.create) {
          if (!captcha) {
            return toastError('Please verify captcha');
          }
          let sessionId: string;
          if (!localStorage.getItem('sessionIDForKount')) {
            sessionId = uuid().replace(/-/g, '');
            localStorage.setItem('sessionIDForKount', sessionId);
          }
          sessionId = checkExistLocalStorage() && localStorage.getItem('sessionIDForKount');
          import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
            kountSDK(kountConfigEnv(), sessionId);
          });
          const customer: CustomerInfoModel = { ...form.customer, captcha };
          dispatch(cartAction.createCustomerOnCheckout(customer, shipping, sessionId));
          if (customerForm.current) {
            customerForm.current.resetCaptcha();
          }
        } else {
          ListCartShipping?.length !== 0 && dispatch(cartAction.saveCheckoutShipping(shipping));
          dispatch(cartAction.saveCheckoutCustomer(form.customer));
        }

        let payload = {
          shipping_address: {
            recipient_name: `${shipping?.first_name} ${shipping?.last_name}`,
            line1: shipping?.line1,
            city: shipping?.city,
            state: shipping?.state,
            postal_code: shipping?.postal_code,
            phone: shipping?.phone,
            apartment: shipping?.apartment,
          },
          billing_address: {
            recipient_name: form?.billing?.sameAsShipping
              ? `${shipping?.first_name} ${shipping?.last_name}`
              : `${form?.billing?.firstName} ${form?.billing?.lastName}`,
            line1: form?.billing?.sameAsShipping ? shipping?.line1 : form?.billing?.address,
            city: form?.billing?.sameAsShipping ? shipping?.city : form?.billing?.city,
            state: form?.billing?.sameAsShipping ? shipping?.state : form?.billing?.state,
            postal_code: form?.billing?.sameAsShipping ? shipping?.postal_code : form?.billing?.zip,
            phone: form?.billing?.sameAsShipping ? shipping?.phone : form?.billing?.phoneNumber,
            apartment: form?.billing?.sameAsShipping ? shipping?.apartment : form?.billing?.apartment,
          },
          gift_card_amount: Number(detailGiftCard?.discountValue),
          coupon_code:
            currentCoupon && currentCoupon !== ''
              ? currentCoupon
              : detailGiftCard?.discountValue
              ? detailGiftCard?.giftcard_code
              : null,
          customer: {
            email: form?.customer?.email,
            user_name: form?.customer?.username,
            first_name: form?.customer?.firstName,
            last_name: form?.customer?.lastName,
            phone_number: form?.customer?.phoneNumber,
            create: form?.customer?.create,
            password: form?.customer?.password,
            subscription: form?.customer?.subscription,
          },
          order_items: carts.map((i) => ({
            cart_type: 'manual',
            frame_size: i.frame_size,
            local_pickup: i.local_pickup,
            master_listing_id: i.master_listing_id,
            quantity: i.quantity,
          })),
        };
        if (allLocalPickup) {
          payload = {
            ...payload,
            shipping_address: payload?.billing_address,
          };
          if (!apartmentBilling) {
            if (form?.billing?.sameAsShipping && apartmentShipping) {
              payload.billing_address.apartment = shipping?.apartment;
            } else {
              delete payload?.billing_address?.apartment;
            }
          }
        }
        if (!allLocalPickup) {
          if (!apartmentBilling) {
            if (form?.billing?.sameAsShipping && apartmentShipping) {
              payload.billing_address.apartment = shipping?.apartment;
            } else {
              delete payload?.billing_address?.apartment;
            }
          }
          if (!apartmentShipping) {
            delete payload?.shipping_address?.apartment;
          }
        }

        const payloadSaveCheckoutShipping = {
          city: payload?.shipping_address?.city,
          first_name: payload?.customer?.first_name,
          last_name: payload?.customer?.last_name,
          line1: payload?.shipping_address?.line1,
          phone: payload?.shipping_address?.phone,
          postal_code: payload?.shipping_address?.postal_code,
          state: payload?.shipping_address?.state,
          user: payload?.customer?.user_name,
          _id: '-',
        };

        dispatch(cartAction.saveCheckoutShipping(payloadSaveCheckoutShipping));
        dispatch(cartAction.saveCheckoutBilling(form.billing));

        setPayloadSubmitGuestOrder({ payload, form, isWaiting: form.customer.create });

        // move to use effect for waiting create user
        // setLoadingButton(true);
        // const responseCreateOrder: CreateOrderResponse = await createOrderGuest(payload);
        // if (responseCreateOrder?.session_id !== undefined) {
        //   import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        //     kountSDK(kountConfigEnv(), responseCreateOrder?.session_id);
        //   });
        // }
        // const payloadCreatePaymentIntent: CreatePaymentIntentNewLogic = {
        //   order_id: responseCreateOrder?._id,
        //   email: form?.customer?.email,
        //   shipping_address: payload?.shipping_address,
        // };
        // const responseCreatePaymentIntent: CreatePaymentIntentNewLogicResponse = await createPaymentIntentNewLogic(
        //   payloadCreatePaymentIntent,
        // );
        // dispatch(paymentAction.setDataPaymentIntent(responseCreatePaymentIntent));
        // dispatch(paymentAction.setCheckoutSuccessId(responseCreateOrder._id));
        // localStorage.setItem('client_secret', responseCreatePaymentIntent?.client_secret);
        // setLoadingButton(false);
        // router.push('/checkout/payment');
      } catch (error) {
        toastError(error);
      }
    },
    [
      ListCartShipping,
      allLocalPickup,
      apartmentBilling,
      apartmentShipping,
      captcha,
      carts,
      currentCoupon,
      detailGiftCard,
      dispatch,
    ],
  );

  const handleSubmitForm = useCallback(
    async (form: ShippingDeliveryInformation) => {
      try {
        let payload = {
          shipping_address: {
            recipient_name: `${shippingInfo?.first_name} ${shippingInfo?.last_name}`,
            line1: shippingInfo?.line1,
            city: shippingInfo?.city,
            state: shippingInfo?.state,
            postal_code: shippingInfo?.postal_code,
            phone: shippingInfo?.phone,
            apartment: shippingInfo?.apartment,
          },
          billing_address: {
            recipient_name: form?.billing?.sameAsShipping
              ? `${shippingInfo?.first_name} ${shippingInfo?.last_name}`
              : `${form?.billing?.firstName} ${form?.billing?.lastName}`,
            line1: form?.billing?.sameAsShipping ? shippingInfo?.line1 : form?.billing?.address,
            city: form?.billing?.sameAsShipping ? shippingInfo?.city : form?.billing?.city,
            state: form?.billing?.sameAsShipping ? shippingInfo?.state : form?.billing?.state,
            postal_code: form?.billing?.sameAsShipping ? shippingInfo?.postal_code : form?.billing?.zip,
            phone: form?.billing?.sameAsShipping ? shippingInfo?.phone : form?.billing?.phoneNumber,
            apartment: form?.billing?.sameAsShipping ? shippingInfo?.apartment : form?.billing?.apartment,
          },
          gift_card_amount: Number(detailGiftCard?.discountValue),
          coupon_code:
            currentCoupon && currentCoupon !== ''
              ? currentCoupon
              : detailGiftCard?.discountValue
              ? detailGiftCard?.giftcard_code
              : null,
        };
        if (allLocalPickup) {
          payload = {
            ...payload,
            shipping_address: payload?.billing_address,
          };
        }
        if (!apartmentBilling) {
          if (form?.billing?.sameAsShipping && shippingInfo.apartment) {
            payload.billing_address.apartment = shippingInfo?.apartment;
          } else {
            delete payload?.billing_address?.apartment;
          }
        }
        if (allLocalPickup) {
          dispatch(cartAction.saveCheckoutShipping(payload?.shipping_address));
        }
        dispatch(cartAction.saveCheckoutBilling(form.billing));
        setLoadingButton(true);
        const responseCreateOrder: CreateOrderResponse = await createOrder(payload);
        if (responseCreateOrder?.session_id !== undefined) {
          import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
            kountSDK(kountConfigEnv(), responseCreateOrder?.session_id);
          });
        }
        const payloadCreatePaymentIntent: CreatePaymentIntentNewLogic = {
          order_id: responseCreateOrder?._id,
          email: userInfo ? userInfo?.email : '',
          shipping_address: payload?.shipping_address,
        };
        const responseCreatePaymentIntent: CreatePaymentIntentNewLogicResponse = await createPaymentIntentNewLogic(
          payloadCreatePaymentIntent,
        );
        dispatch(paymentAction.setDataPaymentIntent(responseCreatePaymentIntent));
        dispatch(paymentAction.setCheckoutSuccessId(responseCreateOrder._id));
        localStorage.setItem('client_secret', responseCreatePaymentIntent?.client_secret);
        setLoadingButton(false);
        router.push('/checkout/payment');
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
      }
    },
    [allLocalPickup, apartmentBilling, currentCoupon, detailGiftCard, dispatch, router, shippingInfo, userInfo],
  );

  const renderPromocode = useMemo(() => {
    return (
      <div>
        {isAllItemBBB && (
          <div className={cx(classes.paymentMethodGroupNoLogin, 'mt-5')}>
            <Card style={{ padding: isLoggedIn ? '50px' : '0 0 50px 0' }}>
              <h3 className={classes.title}>Promo Code</h3>
              {currentCoupon ? (
                <div className="d-sm-flex d-block">
                  <p className="flex-grow-1 m-0" style={{ lineHeight: '55px' }}>
                    {currentCoupon}
                  </p>
                  <Button
                    buttonType={'danger'}
                    className="ml-0 ml-sm-2 mt-3 mt-sm-0 w-auto px-3"
                    onClick={removeCoupon}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="d-sm-flex d-block">
                  <Input className="flex-grow-1" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <div>
                    <Button
                      disabled={!coupon || detailGiftCard?.discountValue > 0}
                      className="ml-0 ml-sm-2 mt-3 mt-sm-0 w-auto"
                      type="button"
                      onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    );
  }, [applyCoupon, coupon, currentCoupon, detailGiftCard, isAllItemBBB, isLoggedIn, removeCoupon]);

  const renderButtonSubmit = useMemo(() => {
    return (
      <>
        {currentWidthScreen < 1000 ? (
          <div className="d-flex justify-content-end">
            <Button className="mt-4 mb-4" type="submit" disabled={loadingButton} isLoading={loadingButton}>
              {allLocalPickup ? 'Continue to Payment' : 'Deliver to this Address'}
            </Button>
          </div>
        ) : (
          <Button className="mt-4 w-100 mb-4" type="submit" disabled={loadingButton} isLoading={loadingButton}>
            {allLocalPickup ? 'Continue to Payment' : 'Deliver to this Address'}
          </Button>
        )}
      </>
    );
  }, [allLocalPickup, currentWidthScreen, loadingButton]);

  if (!isLoggedIn) {
    return (
      <Formik
        validationSchema={validateSchema}
        initialValues={initialValues}
        onSubmit={handleSubmitFormNotLogin}
        enableReinitialize={true}>
        {({ values, setValues, validateField, errors, touched }: FormikProps<ShippingDeliveryInformation>) => {
          return (
            <Form>
              <Head>
                <script src="https://www.google.com/recaptcha/api.js" async defer />
              </Head>
              <Container>
                <Stepper showTitleSm={true} steps={steps} step={1} maxStep={1} showProgress={false} />
                <Row className="mt-3">
                  <Col lg={8}>
                    <Card className={classes.shippingCard1}>
                      <CustomerForm
                        show={apartmentShipping}
                        setShow={setApartmentShiping}
                        ref={customerForm}
                        ListCartShipping={ListCartShipping}
                      />
                      <div className={visibleBillingInfo && classes.addOpacity}>
                        <hr />

                        <BillingAddressContent values={values} show={apartmentBilling} setShow={setApartmentBilling} />
                      </div>
                      <hr />
                      {renderPromocode}
                      <hr />
                      <CreateAcountCustomerForm
                        ref={customerForm}
                        onCaptchaChange={setCaptcha}
                        ListCartShipping={ListCartShipping}
                      />
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <OrderSummary />
                    {renderButtonSubmit}
                  </Col>
                </Row>
              </Container>
            </Form>
          );
        }}
      </Formik>
    );
  }

  return (
    <div style={{ marginBottom: 50 }}>
      <Container>
        <h2>Secure Checkout</h2>
        <Stepper showTitleSm={true} steps={steps} step={1} maxStep={1} showProgress={false} className={'my-4'} />

        <Formik
          validationSchema={validateSchema}
          initialValues={initialValues}
          onSubmit={handleSubmitForm}
          validate={validateForm}
          enableReinitialize={true}>
          {({ values, setValues, validateField, errors, touched }: FormikProps<ShippingDeliveryInformation>) => {
            return (
              <Form>
                <Row className="mt-3">
                  <Col lg={8}>
                    {!allLocalPickup && (
                      <div className={visibleShippingInfo && classes.addOpacity}>
                        <ShippingForm />
                      </div>
                    )}
                    <div className={visibleBillingInfo && classes.addOpacity}>
                      <BillingAddressContent values={values} show={apartmentBilling} setShow={setApartmentBilling} />
                    </div>
                    {!isLoggedIn && <hr />}
                    {renderPromocode}
                  </Col>
                  <Col lg={4}>
                    <OrderSummary />
                    {renderButtonSubmit}
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Container>
      {/* 
      <ModalConfirmApplyGiftCard
        isOpen={visibleModalApplyTradeInCreditForPurchase}
        onClose={handleCloseModalApplyTradeInCreditForPurchase}
        onSubmit={handleApplyTradeInCreditForPurchase}
      /> */}
    </div>
  );
};

export default ShippingContent;
