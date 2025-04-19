import React, { useState, useCallback, useEffect, useMemo, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { sendRequestRefundForSeller } from 'api/account/personal/order.api';
import { isNotDateExpired } from 'helpers/date.helper';
import { formatCurrency } from 'helpers/string.helper';
import { toastError } from 'helpers/utils.helper';
import { useRouter } from 'next/router';
import Textarea from '@ui/Textarea';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import { AmountCustom } from 'model/store/store-front/order.model';
import cx from 'classnames';
import Card from '@ui/Cards';
import { prepareData } from 'components/StoreFront/Order/Refund/form';
import RefundOrderSkeleton from 'components/StoreFront/Order/Refund/RefundOrderSkeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Button from '@ui/Buttons/Primary/Button';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import { RefundGA, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import classes from './refund-order.module.scss';
import OrderRefundItem from './OrderRefundItem';
import PaymentInfo from '../PaymentInfo/PaymentInfo';

const RefundOrderContainer = () => {
  const [amounts, setAmounts] = useState<AmountCustom[]>([]);
  const [errors, setErrors] = useState<Array<{ id: string; message: string }>>([]);
  const [errorReason, setErrorReason] = useState<string>('');
  const [reasonCancel, setReasonCancel] = useState<string>('');
  const loading = useSelector((store: StoreState) => store.account.personal.orders.detail.loading);
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);
  const router = useRouter();

  const checkItemIsRefunded = useCallback(
    (item: LineItemModel) => {
      if (item) {
        const check = item.market_listings.filter((mkItem: any) => mkItem.is_seller_refund);
        if (check.length === item.quantity) {
          return true;
        }
        if (!item.seller_is_bbb && !item.is_allow_return) {
          return true;
        }
        if (!item.seller_is_bbb && !isNotDateExpired(order?.date_finish, item.return_within_days)) {
          return true;
        }
      }
      return false;
    },
    [order],
  );

  useEffect(() => {
    if (order?.line_item) {
      const initialAmount: AmountCustom[] = order?.line_item?.map((item, index) => {
        const subTotal =
          Number(item.fix_subtotal * item.quantity) +
          Number(item.fix_insurance) +
          Number(item.fix_shipping) +
          Number(item.fix_tax);
        return {
          refunded: checkItemIsRefunded(item),
          amountAccept: subTotal,
          amount: 0,
          id: item?._id,
          item,
        };
      });

      setAmounts(initialAmount);
    }
  }, [checkItemIsRefunded, order]);

  const onChangePriceRefund = useCallback(
    (params: AmountCustom) => {
      const checkExistListing = amounts.find((item) => item.id === params.id);
      if (checkExistListing) {
        const amountChange = amounts.map((item: AmountCustom) => {
          if (item.id === params.id) {
            return {
              ...item,
              amount: params.amount,
            };
          }
          return item;
        });
        setAmounts(amountChange);
      } else {
        setAmounts([...amounts, params]);
      }
      const filterErrors = errors.filter((e) => e?.id !== params?.id);
      setErrors(filterErrors);
    },
    [amounts, errors],
  );

  const handleRefundOrder = useCallback(async () => {
    const newErrors: Array<{ id: string; message: string }> = [];
    const sellerPersonal = router?.pathname?.includes('account/order');
    amounts.forEach((item) => {
      if (!item.amount && !item.refunded) {
        newErrors.push({
          id: item.id,
          message: 'Amount refund is required.',
        });
      } else if (item.amountAccept && item.amount > item.amountAccept) {
        newErrors.push({
          id: item.id,
          message: 'Amount refund cant be more than subtotal.',
        });
      }
    });
    let errorsReason = '';
    if (reasonCancel.length > 500) {
      errorsReason = 'Reason  cannot exceed 500 characters.';
    }
    if (!reasonCancel) {
      errorsReason = 'Reason cancel is required.';
    }
    if (errorsReason) {
      setErrorReason(errorsReason);
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (newErrors.length > 0 || errorsReason) {
      return;
    }

    const amountAccept = prepareData(order, amounts);

    const payload = {
      order_id: order._id,
      reason: reasonCancel,
      amounts: amountAccept,
    };
    try {
      await sendRequestRefundForSeller(payload);
      amounts &&
        triggerGA4ECommerceEvent('refund', {
          currency: order?.amount?.currency,
          value: order?.amount?.total,
          transaction_id: String(order?.order_code),
          coupon: order?.coupon?.code,
          shipping: order?.amount?.details?.shipping,
          tax: order?.amount?.details?.tax,
          items: [
            ...amounts
              .filter((item) => !item.refunded)
              .map(({ item: cartItem }, index) => ({
                item_id: String(cartItem.master_listing_id),
                item_name: cartItem.title,
                affiliation: '',
                coupon: order.coupon?.code,
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
        } as RefundGA);

      if (sellerPersonal) {
        router.push(`/account/order/${order._id}`);
      } else {
        router.push(`/store-front/order-history/${order._id}`);
      }
    } catch (error) {
      toastError(error);
    }
  }, [amounts, order, reasonCancel, router]);

  const findTotalAmount = useMemo(() => {
    let total = 0;
    amounts.forEach((item) => {
      if (item.quantityAllowRefund) {
        total += Number(item.amount) * Number(item.quantityAllowRefund);
      } else {
        total += Number(item.amount);
      }
    });
    return formatCurrency(total);
  }, [amounts]);

  const renderPage = useMemo((): ReactElement => {
    if (loading) {
      return <RefundOrderSkeleton />;
    }
    if (!loading && !order) {
      return <h1>This order was not found !.</h1>;
    }
    return (
      <div>
        <OrderRefundItem order={order} amounts={amounts} onChangePriceRefund={onChangePriceRefund} errors={errors} />
        <Card className={cx(classes.productCard, 'mt-4')}>
          <Row className={classes.groupTotal}>
            <Col xs={12} md={6}>
              <div className={classes.title}>Comment</div>
              <Textarea
                rows={4}
                onChange={(e) => {
                  setErrorReason('');
                  setReasonCancel(e.target.value);
                }}
              />
              <div className={classes.lineError}>{errorReason}</div>
            </Col>
            <Col xs={12} md={6} className={classes.calculateAmount}>
              <div className={classes.title}>Calculate refund amount: {findTotalAmount}</div>
            </Col>
          </Row>
        </Card>
        <div className={classes.btnRefund}>
          <Button buttonType="primary" onClick={handleRefundOrder}>
            Send Refund
          </Button>
        </div>
        <PaymentInfo order={order} />
      </div>
    );
  }, [amounts, errorReason, errors, findTotalAmount, handleRefundOrder, loading, onChangePriceRefund, order]);
  return (
    <div className={classes.container}>
      <Card className={cx('flex-row justify-content-start', classes.header)}>
        <Button buttonType="transparent" buttonSize={'s'} onClick={() => router.back()}>
          <img src={icLeftArrowBlack} alt={'Left Arrow'} />
          <span className={classes.back}>Back</span>
        </Button>
      </Card>
      {renderPage}
    </div>
  );
};

export default RefundOrderContainer;
