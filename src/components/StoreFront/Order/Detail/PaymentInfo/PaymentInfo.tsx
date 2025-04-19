import React, { FC, useCallback, useMemo } from 'react';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { formatCurrency } from 'helpers/string.helper';
import _get from 'lodash/get';
import toLower from 'lodash/toLower';
import cx from 'classnames';
import { DetailOrderModel } from 'model/store/store-front/order.model';
import classes from './payment-info.module.scss';

interface Props {
  order: DetailOrderModel;
}

const PaymentInfo: FC<Props> = ({ order }) => {
  const isBBBStaff = useUserIsBBB();

  const refundAmount = useMemo(() => {
    if (isBBBStaff) {
      return order.line_item.reduce(
        (acc, value) => acc + value.market_listings.reduce((a, v) => a + (Number(v.amount_refund) || 0), 0),
        0,
      );
    }
    return order.line_item.reduce((acc, value) => acc + value.amount_refund, 0);
  }, [isBBBStaff, order]);

  const refundInfo = useMemo(() => {
    const existItemRefund = order?.line_item?.find(
      (item) => toLower(item?.status) === 'refund' || toLower(item?.status) === 'refunded',
    );
    if (existItemRefund || order?.status === 'refunded') {
      return (
        <>
          <tr>
            <td className={classes.label}>Total Refund Amount</td>
            <td className={classes.total}>{formatCurrency(refundAmount, false)}</td>
          </tr>
          <tr>
            <td className={classes.label}>Funds on hold</td>
            <td className={classes.total}>{formatCurrency(_get(order, 'amount.total') - refundAmount, false)}</td>
          </tr>
        </>
      );
    }
  }, [order, refundAmount]);

  const renderPaymentMethod = useMemo(() => {
    if (order?.payment_method_stripe) {
      return order?.payment_method_stripe ? `${order?.payment_method_stripe}`.split('_').join(' ') : '';
    }
    if (order?.payment_method) {
      return order?.payment_method ? `${order?.payment_method}`.split('_').join(' ') : '';
    }
    return 'STRIPE';
  }, [order]);

  return (
    <Row>
      <Col xs={12}>
        <Card className={cx('mt-4', classes.card)}>
          <Row>
            <Col xs={12} md={6}>
              <span className={cx(classes.heading, classes.costHeading)}>Cost Summary</span>
              <table className={cx('table table-borderless p-0', classes.table)}>
                <tbody>
                  <tr>
                    <td className={classes.label}>Sub total</td>
                    <td className={classes.price}>{formatCurrency(_get(order, 'amount.details.subtotal'), false)}</td>
                  </tr>
                  <tr>
                    <td className={classes.label}>Shipping</td>
                    <td className={classes.price}>{formatCurrency(_get(order, 'amount.details.shipping'), false)}</td>
                  </tr>
                  <tr>
                    <td className={classes.label}>Insurance</td>
                    <td className={classes.price}>{formatCurrency(_get(order, 'amount.details.insurance'), false)}</td>
                  </tr>
                  <tr>
                    <td className={classes.label}>Sales tax</td>
                    <td className={classes.price}>{formatCurrency(_get(order, 'amount.details.tax'), false)}</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={classes.label}>Promo Code</span>
                      {order.coupon && <p className={classes.promoCode}>{order.coupon?.code}</p>}
                    </td>
                    <td className={classes.promoAmount}>-{formatCurrency(_get(order, 'discount', 0), false)}</td>
                  </tr>
                  <tr>
                    <td className={classes.label}>Order total</td>
                    <td className={classes.total}>{formatCurrency(_get(order, 'amount.total'), false)}</td>
                  </tr>
                  {refundInfo}
                </tbody>
              </table>
            </Col>
            <Col md={6} className={'d-none d-md-block'}>
              <div>
                <span className={classes.heading}>Shipping Address</span>

                <div className={classes.customerInfo}>
                  {order.shipping_address ? (
                    <>
                      <p>{order.shipping_address.recipient_name}</p>
                      <p>
                        {order.shipping_address?.apartment && `${order.shipping_address?.apartment}, `}
                        {`${order.shipping_address.line1}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.postal_code} `}
                      </p>
                    </>
                  ) : (
                    <p>Local pickup</p>
                  )}
                </div>

                <span className={classes.headingPayment}>Payment Method</span>
                <div className={classes.customerInfo}>
                  <p>{renderPaymentMethod}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={12} className={'d-block d-md-none '}>
        <Card className={cx('mt-4', classes.card)}>
          <span className={classes.heading}>Shipping Address</span>

          <div className={classes.customerInfo}>
            {order.shipping_address ? (
              <>
                <p>{order.shipping_address.recipient_name}</p>
                <p>
                  {order.shipping_address?.apartment && `${order.shipping_address?.apartment}, `}
                  {`${order.shipping_address.line1}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.postal_code} `}
                </p>
              </>
            ) : (
              <p>Local pickup</p>
            )}
          </div>
          {/* <span className={classes.heading}>Payment Method</span>
          <div className={classes.customerInfo}>
            {order.payment_method && (
              <>
                <p>Credit card (Visa, Mastercard, etc...)</p>
              </>
            )}
          </div> */}
        </Card>
      </Col>

      <Col xs={12} className={'d-block d-md-none '}>
        <Card className={cx('mt-4', classes.card)}>
          {/* <span className={classes.heading}>Shipping Address</span>

          <div className={classes.customerInfo}>
            {order.shipping_address ? (
              <>
                <p>{order.shipping_address.recipient_name}</p>
                <p>
                  {`${order.shipping_address.line1}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.postal_code} `}
                </p>
              </>
            ) : (
              <p>Local pickup</p>
            )}
          </div> */}
          <span className={classes.heading}>Payment Method</span>
          <div className={classes.customerInfo}>
            <p>{renderPaymentMethod}</p>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentInfo;
