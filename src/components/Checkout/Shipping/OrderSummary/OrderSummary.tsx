/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Collapse from 'reactstrap/lib/Collapse';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import Card from '@ui/Cards';
import icDropDown from 'assets/img/common/ic_dropdown.svg';
import StoreState from 'model/store';
import { formatCurrency, formatNumberDecimal } from 'helpers/string.helper';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import cartAction from 'store/checkout/cart/cart.action';
import { useRouter } from 'next/router';
import Switch from '@ui/Switch/Switch';
import paymentAction from 'store/checkout/payment/payment.action';
import SummaryCartItem from './SummaryCartItem/SumaryCartItem';
import classes from './order-summary.module.scss';

interface Props {
  loading?: boolean;
  onlyShow?: boolean;
  lineItem?: LineItemModel[];
  initCollapseItems?: boolean;
}

const OrderSummary: FC<Props> = ({ lineItem, initCollapseItems = false, onlyShow = false, loading = false }) => {
  const { pathname } = useRouter();
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(initCollapseItems);
  const [checked, setChecked] = useState<boolean>(false);
  const { cartStore, loadingPayment } = useSelector((state: StoreState) => ({
    cartStore: state.checkout.cart.carts,
    loadingPayment: state.checkout.payment.loading,
  }));
  const [visibleModalApplyTradeInCreditForPurchase, setVisibleModalApplyTradeInCreditForPurchase] = useState(false);

  const detailGiftCard = useSelector((state: StoreState) => state.checkout.payment.detailGiftCard);
  const carts = lineItem || cartStore;

  const toggleCollapse = useCallback(() => {
    setCollapse((p) => !p);
  }, []);

  const renderCartItems = useMemo(() => {
    return carts.map((i) => (
      <SummaryCartItem
        key={i.master_listing_id + i.frame_size}
        price={i.subtotal}
        quantity={i.quantity}
        bikeName={i.title}
        id={i.master_listing_id}
      />
    ));
  }, [carts]);

  const isAllItemBBB = useMemo(() => {
    return carts.length > 0 && carts.every((i) => i.seller_is_bbb);
  }, [carts]);

  useEffect(() => {
    if (
      detailGiftCard?.gift_card_value > 0 &&
      detailGiftCard?.giftcard_code !== '' &&
      detailGiftCard?.gift_card_status &&
      !detailGiftCard.isHideModal &&
      isAllItemBBB &&
      pathname?.includes('shipping') &&
      (detailGiftCard?.gift_card_online_store_id === '' ||
        carts.some((it) => it.storefront_id === detailGiftCard?.gift_card_online_store_id))
    ) {
      setVisibleModalApplyTradeInCreditForPurchase(true);
    }
  }, [carts, detailGiftCard, dispatch, isAllItemBBB, pathname]);

  const subTotalOfStorefrontHasGiftCard = useMemo(() => {
    if (detailGiftCard?.gift_card_online_store_id === '') {
      return carts.reduce((acc, item) => acc.plus(item.subtotal || 0), new BigNumber(0));
    }
    return carts
      ?.filter((it) => it?.storefront_id === detailGiftCard?.gift_card_online_store_id)
      .reduce((acc, item) => acc.plus(item.subtotal || 0), new BigNumber(0));
  }, [carts, detailGiftCard]);

  const totalGiftCardDiscount = useMemo(() => {
    return detailGiftCard?.gift_card_value;
  }, [detailGiftCard]);

  const maxDiscountValue = useMemo(() => {
    return totalGiftCardDiscount > subTotalOfStorefrontHasGiftCard?.toNumber()
      ? subTotalOfStorefrontHasGiftCard?.toNumber()
      : totalGiftCardDiscount;
  }, [subTotalOfStorefrontHasGiftCard, totalGiftCardDiscount]);

  const subTotal = useMemo(() => carts.reduce((acc, item) => acc.plus(item.subtotal || 0), new BigNumber(0)), [carts]);
  const shipping = useMemo(() => carts.reduce((acc, item) => acc.plus(Number(item.shipping) || 0), new BigNumber(0)), [
    carts,
  ]);
  const insurance = useMemo(() => carts.reduce((acc, item) => acc.plus(item.insurance || 0), new BigNumber(0)), [
    carts,
  ]);
  const tax = useMemo(() => carts.reduce((acc, item) => acc.plus(item.tax || 0), new BigNumber(0)), [carts]);
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);
  const discounted = useMemo(() => carts.reduce((acc, item) => acc.plus(item.discount || 0), new BigNumber(0)), [
    carts,
  ]);
  const orderTotal = useMemo(
    () => subTotal.decimalPlaces(0).plus(shipping).plus(insurance).plus(tax).minus(discounted),
    [insurance, shipping, subTotal, tax, discounted],
  );
  const currentCoupon = useSelector((store: StoreState) => store.checkout.cart.couponCode);

  const handleTradeInCreditForPurchase = useCallback(() => {
    if (checked) {
      dispatch(
        paymentAction.setDetailGiftCard({
          ...detailGiftCard,
          discountValue: 0,
          isHideModal: true,
        }),
      );
      setChecked(false);
    } else {
      dispatch(
        paymentAction.setDetailGiftCard({
          ...detailGiftCard,
          discountValue: maxDiscountValue,
          isHideModal: true,
        }),
      );
      setChecked(true);
    }
  }, [checked, detailGiftCard, dispatch, maxDiscountValue]);

  return (
    <>
      <Card className={classes.summaryCard}>
        <div className={classes.summarySection}>
          <h4>Order Summary</h4>
          <button className={classes.itemsButton} type="button" onClick={toggleCollapse}>
            Items
            <img
              alt={collapse ? 'expand' : 'collapse'}
              src={icDropDown}
              className={cx({
                [classes.rotate]: !collapse,
              })}
            />
          </button>
          <Collapse isOpen={collapse}>{renderCartItems}</Collapse>
        </div>
        <div className={classes.summarySection}>
          <Row>
            <Col xs={6}>
              <p className={classes.totalSummaryTitle}>Sub total</p>
            </Col>
            <Col xs={6}>
              <p className={classes.totalSummaryValue}>{formatCurrency(subTotal.toNumber())}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <p className={classes.totalSummaryTitle}>Shipping</p>
            </Col>
            <Col xs={6}>
              <p className={classes.totalSummaryValue}>{formatCurrency(shipping.toNumber(), false)}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <p className={classes.totalSummaryTitle}>Insurance</p>
            </Col>
            <Col xs={6}>
              <p className={classes.totalSummaryValue}>{formatCurrency(insurance.toNumber(), false)}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <p className={classes.totalSummaryTitle}>Sales tax</p>
            </Col>
            <Col xs={6}>
              <p className={classes.totalSummaryValue}>{formatCurrency(tax.toNumber(), false)}</p>
            </Col>
          </Row>
        </div>
        {(Number(detailGiftCard?.discountValue) > 0 || currentCoupon !== '' || !!order?.discount) && (
          <div className={classes.summarySection}>
            <Row>
              <Col xs={6}>
                <p className={cx(classes.totalSummaryTitle, 'mb-0')}>Promo Code</p>
              </Col>
              <Col xs={6}>
                <p className={cx(classes.totalSummaryValue, classes.discount)}>
                  {detailGiftCard?.discountValue
                    ? `$${formatNumberDecimal(detailGiftCard?.discountValue)}`
                    : order?.discount
                    ? formatCurrency(order?.discount)
                    : formatCurrency(discounted.multipliedBy(-1).toNumber())}
                </p>
              </Col>
            </Row>
          </div>
        )}
        <div className={classes.summarySection}>
          <Row>
            <Col xs={6}>
              <p className={classes.totalSummaryTitle}>Order total</p>
            </Col>
            <Col xs={6}>
              <p className={cx(classes.totalSummaryValue, classes.totalOrder)}>
                {formatCurrency(orderTotal.toNumber() - Number(detailGiftCard?.discountValue || 0), false)}
              </p>
            </Col>
          </Row>
        </div>
      </Card>
      {visibleModalApplyTradeInCreditForPurchase && (
        <Card className={classes.tradeInContainer}>
          <div className={classes.titleTradeIn}>
            You have a remaining trade-in credit balance of{' '}
            <span className={classes.valueTradeIn}>${maxDiscountValue}</span>.
          </div>
          <div className="d-flex justyfy-content-between">
            <div className={classes.selectTradeIn}>
              <Switch checked={checked} onChange={handleTradeInCreditForPurchase} />
            </div>
            <div className={classes.subText}>Use balance on this purchase and deduct from order total?</div>
          </div>
        </Card>
      )}
    </>
  );
};

export default OrderSummary;
