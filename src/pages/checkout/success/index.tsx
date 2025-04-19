import React, { FC, useCallback, useEffect, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Card from '@ui/Cards';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addTag } from 'helpers/common.helper';
import Button from '@ui/Buttons/Primary/Button';
import cartAction from 'store/checkout/cart/cart.action';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Stepper from 'components/Register/Stepper';
import OrderSummary from 'components/Checkout/Shipping/OrderSummary/OrderSummary';
import { getDetailOrder, getDetailOrderFailed } from 'store/account/personal/orders/orders.action';
import StoreState from 'model/store';
import { setCustomGaRequest } from 'helpers/customGaService.helper';
// import { PurchaseGA, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import images from '@images';
import classes from './success.module.scss';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const steps = [
  { title: 'Delivery Information', step: 1, smallTitle: 'Delivery' },
  { title: 'Make Payment', step: 2, smallTitle: 'Payment' },
  { title: 'Order Confirmation', step: 3, smallTitle: 'Confirmed' },
];

const CheckoutSuccess: FC & ComponentStatic = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((store: StoreState) => store.account.personal.orders.detail.loading);
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);
  const checkoutSuccessId = useSelector((state: StoreState) => state.checkout.payment.checkoutSuccessId);

  const orderCode = useMemo(() => {
    return order?.order_code;
  }, [order]);
  const isLoggedIn = useSelector((store: StoreState) => store.authenticate.token);
  const linkToDetailOrder = `/${isLoggedIn ? 'account' : 'checkout'}/order/${checkoutSuccessId}`;
  const allLocalPickup = useMemo(() => {
    return order?.line_item?.every((i) => i.local_pickup);
  }, [order]);
  const allShipped = useMemo(() => {
    return order?.line_item?.every((i) => !i.local_pickup);
  }, [order]);

  useEffect(() => {
    if (order) {
      const gaCartInfo = {
        master_listing_id: order?.line_item?.length ? order?.line_item?.map((it) => it.master_listing_id).join() : '',
        inventory_id: order?.line_item?.length ? order?.line_item?.map((it) => it.inventory_id).join() : '',
        inventory_name: '',
        order_id: '',
        order_code: orderCode,
        bicycle_id: order?.line_item?.length ? order?.line_item.map((it) => it.bicycle_id).join() : '',
        bicycle_name: order?.line_item?.length ? order?.line_item.map((it) => it.bicycle_name).join() : '',
        trade_in: order?.line_item?.length ? order?.line_item.map((it) => it.type_id).join() : '',
        checkoutSuccessId: order?._id || checkoutSuccessId,
      };
      setCustomGaRequest('page_view', {
        name: `${router.asPath}`,
        from: `${router.asPath}`,
        ...gaCartInfo,
      });
    }
  }, [checkoutSuccessId, order, orderCode, router]);

  const checkDefaultParams = useCallback(() => {
    if (checkoutSuccessId === '') {
      return router.replace(`/marketplace/buy-now`);
    }
  }, [checkoutSuccessId, router]);

  useEffect(() => {
    dispatch(cartAction.getCarts());
  }, [dispatch]);

  useEffect(() => {
    localStorage.removeItem('client_secret');
    return () => dispatch(getDetailOrderFailed());
  }, [dispatch]);

  useEffect(() => {
    checkDefaultParams();
  }, [checkDefaultParams]);

  useEffect(() => {
    return () => {
      dispatch(cartAction.removeCouponCode());
    };
  }, [dispatch]);

  useEffect(() => {
    addTag({
      event: 'checkoutSuccess',
      ecommerce: {
        purchase: {
          actionField: {
            id: orderCode,
          },
          products: order?.line_item?.map((item) => ({
            id: item.master_listing_id,
            price: item.current_listed_price || 0,
            quantity: item.quantity,
          })),
        },
      },
    });
  }, [orderCode, order]);

  // useEffect(() => {
  //   if (order?.line_item?.length && order.status === 'completed') {
  //     triggerGA4ECommerceEvent('purchase', {
  //       currency: order.amount?.currency,
  //       value: order.amount?.total,
  //       transaction_id: String(order.order_code),
  //       coupon: order.coupon?.code,
  //       shipping: order?.amount?.details?.shipping,
  //       tax: order?.amount?.details?.tax,
  //       items: [
  //         ...order?.line_item.map((cartItem, index) => ({
  //           item_id: String(cartItem.master_listing_id),
  //           item_name: cartItem.title,
  //           affiliation: '',
  //           coupon: order.coupon?.code,
  //           discount: cartItem.current_listed_price - cartItem.discounted_price,
  //           index,
  //           item_brand: cartItem.bicycle_brand_name,
  //           item_category: cartItem.bicycle_type_name,
  //           item_category2: '',
  //           item_category3: '',
  //           item_category4: '',
  //           item_category5: '',
  //           item_list_id: '',
  //           item_list_name: '',
  //           item_variant: `${cartItem.bicycle_model_name} ${cartItem.bicycle_size_name}`,
  //           location_id: String(cartItem.location),
  //           price: cartItem.current_listed_price,
  //           quantity: cartItem.quantity,
  //         })),
  //       ],
  //     } as PurchaseGA);
  //   }
  // }, [orderCode, order]);

  const renderShippingContent = useCallback(() => {
    if (allLocalPickup) {
      return (
        <>
          <p className="mt-5 color-grey">
            Thanks for shopping! Your payment was successful. The seller will get in touch shortly to arrange pickup.
          </p>
          <p className="mt-4 color-grey mb-0">
            Your order number is{' '}
            <Link href={linkToDetailOrder}>
              <a>{orderCode || checkoutSuccessId}</a>
            </Link>
            .
          </p>
        </>
      );
    }
    return (
      <>
        <p className="mt-5 color-grey">
          Thanks for shopping! Your payment was successful. Your order number is{' '}
          <Link href={linkToDetailOrder}>
            <a>{orderCode || checkoutSuccessId}</a>
          </Link>
          .
        </p>
        <Row className="mt-4 mb-0 color-grey">
          <Col sm={2} className={classes.setPickuptext}>
            <span className="color-black d-inline-block" style={{ minWidth: 95 }}>
              Delivery
            </span>
          </Col>
          <Col sm={10} className={classes.setPickuptext}>
            We will let you know when your order is being shipped.
          </Col>
        </Row>

        <Row className="mt-4 color-grey mb-0">
          <Col sm={2} className={classes.setPickuptext}>
            <span className="color-black  d-inline-block" style={{ minWidth: 95 }}>
              Pickup
            </span>
          </Col>
          <Col sm={10} className={classes.setPickuptext}>
            The seller will get in touch shortly to arrange pickup.
          </Col>
        </Row>
      </>
    );
  }, [allLocalPickup, checkoutSuccessId, linkToDetailOrder, orderCode]);

  const renderPaymentMethod = useMemo(() => {
    if (order?.payment_method_stripe) {
      return order?.payment_method_stripe ? `${order?.payment_method_stripe}`.split('_').join(' ') : '';
    }
    if (order?.payment_method) {
      return order?.payment_method ? `${order?.payment_method}`.split('_').join(' ') : '';
    }
    return 'STRIPE';
  }, [order]);

  useEffect(() => {
    if (checkoutSuccessId) {
      dispatch(getDetailOrder(checkoutSuccessId));
    }
  }, [dispatch, checkoutSuccessId]);
  if (loading || !order) {
    return null;
  }
  return (
    <div className="wrapper-with-header extra-light-container">
      {checkoutSuccessId !== '' && (
        <Container>
          <h2>Secure Checkout</h2>
          <Stepper showTitleSm={true} steps={steps} step={3} maxStep={3} showProgress={false} className={'my-4'} />
          <Row className="mt-3 mb-4 row-space-8">
            <Col lg={8}>
              <Card style={{ padding: 50 }}>
                <h3>
                  <img src={images.checkout.iconTickCircel} className={'mr-3'} alt="error" />
                  Your order is confirmed!
                </h3>
                {renderShippingContent()}
                <div className={'divider mt-5 mb-1'} />
                <Row>
                  {order.shipping_address ? (
                    <Col xs={12} sm={5} width={203} className="mt-4">
                      <p className={'mb-0'}>Shipping Address</p>

                      <>
                        <p className={'mb-0 color-grey'}>{order.shipping_address.recipient_name}</p>
                        <p className={'mb-0 color-grey'}>
                          {order.shipping_address?.apartment && `${order.shipping_address?.apartment}, `}
                          {order.shipping_address.line1}
                        </p>
                        <p className={'mb-0 color-grey'}>
                          {order.shipping_address.city}, {order.shipping_address.state}{' '}
                          {order.shipping_address.postal_code}
                        </p>
                      </>
                    </Col>
                  ) : null}
                  <Col xs={12} sm={5} width={203} className="mt-4">
                    <p className={'mb-0'}>Billing Address</p>
                    {order.billing_address ? (
                      <>
                        <p className={'mb-0 color-grey'}>{order.billing_address.recipient_name}</p>
                        <p className={'mb-0 color-grey'}>
                          {order.billing_address?.apartment && `${order.billing_address?.apartment}, `}
                          {order.billing_address.line1}
                        </p>
                        <p className={'mb-0 color-grey'}>
                          {order.billing_address.city}, {order.billing_address.state}{' '}
                          {order.billing_address.postal_code}
                        </p>
                      </>
                    ) : (
                      <p className={'mb-0 color-grey'}>No Billing Address</p>
                    )}
                  </Col>
                  <Col xs={12} sm={5} width={203} className="mt-4">
                    <p className={'mb-0'}>Payment method</p>
                    <p className="mb-0 color-grey">{renderPaymentMethod}</p>
                  </Col>
                </Row>

                <div className={'divider my-5'} />
                <div>
                  <p>Need help with your order?</p>
                  <Link
                    scroll={false}
                    href={{
                      pathname: router.pathname,
                      query: { contact: true, backOnClose: true, redirectUrl: router.asPath, ...router.query },
                    }}
                    as={'/contact'}>
                    <Button buttonType="outline">Get in Touch</Button>
                  </Link>
                </div>
              </Card>
            </Col>
            <Col lg={4}>
              <OrderSummary lineItem={order?.line_item} onlyShow={true} />
              <Link href={linkToDetailOrder}>
                <Button className={'mt-4 w-100'}>Manage Your Order</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

CheckoutSuccess.renderLayout = renderMainLayout;

export default withInjectAllSaga(CheckoutSuccess);
