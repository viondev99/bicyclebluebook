import React, { FC, useEffect } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards';
import cartActions from 'store/checkout/cart/cart.action';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Stepper from 'components/Register/Stepper';
import OrderSummary from 'components/Checkout/Shipping/OrderSummary/OrderSummary';
import StoreState from 'model/store';
import { completeOrder, completeOrderGuest } from 'api/checkout/payment.api';
import { toastError } from 'helpers/utils.helper';
import paymentAction from 'store/checkout/payment/payment.action';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const steps = [
  { title: 'Delivery Information', step: 1, smallTitle: 'Delivery' },
  { title: 'Make Payment', step: 2, smallTitle: 'Payment' },
  { title: 'Order Confirmation', step: 3, smallTitle: 'Confirmed' },
];

const CompleteOrder: FC & ComponentStatic = () => {
  const router = useRouter();
  const { query } = router;
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  useEffect(() => {
    const body = {
      order_id: String(query.id || ''),
      payment_id: String(query.paymentId || ''),
      payer_id: String(query.PayerID || ''),
    };
    if (isLoggedIn) {
      completeOrder(body)
        .then(() => {
          dispatch(cartActions.getCarts());
          dispatch(paymentAction.setCheckoutSuccessId(body?.order_id));
          router.replace(`/checkout/success`);
        })
        .catch((err) => {
          dispatch(cartActions.getCarts());
          if (err.response) {
            if (err.response.data.name === 'PAYMENT_ALREADY_DONE') {
              dispatch(paymentAction.setCheckoutSuccessId(body?.order_id));
              router.replace(`/checkout/success`);
            } else {
              router.push(`/cart?noMessage=true`);
            }
          } else {
            router.push(`/cart?noMessage=true`);
          }
        });
    } else {
      completeOrderGuest(body)
        .then(() => {
          dispatch(cartActions.getCarts());
          dispatch(paymentAction.setCheckoutSuccessId(body?.order_id));
          router.replace(`/checkout/success`);
        })
        .catch((err) => {
          toastError(err);
          dispatch(cartActions.getCarts());
          if (err.response) {
            if (err.response.data.name === 'PAYMENT_ALREADY_DONE') {
              dispatch(paymentAction.setCheckoutSuccessId(body?.order_id));
              router.replace(`/checkout/success`);
            } else {
              router.push(`/cart?noMessage=true`);
            }
          } else {
            router.push(`/cart?noMessage=true`);
          }
        });
    }
  }, [dispatch, isLoggedIn, query, router]);
  return (
    <div className="wrapper-with-header extra-light-container">
      <Container>
        <Stepper showTitleSm={true} steps={steps} step={3} maxStep={3} showProgress={false} />
        <Row className="mt-3">
          <Col lg={8}>
            <Card style={{ height: 500, padding: 50 }}>
              <h3>Order Confirmation</h3>
              <p className="mt-5">We are completing your order</p>
            </Card>
          </Col>
          <Col lg={4}>
            <OrderSummary />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

CompleteOrder.renderLayout = renderMainLayout;

export default withInjectAllSaga(CompleteOrder);
