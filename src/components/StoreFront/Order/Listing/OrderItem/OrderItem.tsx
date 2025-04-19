import React, { FC, useCallback, useMemo } from 'react';
import { OrderModel } from 'model/store/store-front/order.model';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import { formatCurrency } from 'helpers/string.helper';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import toLower from 'lodash/toLower';
import cx from 'classnames';
import { isNotDateExpired } from 'helpers/date.helper';
import Link from 'next/link';
import { useUserInfo } from 'hooks/useUserInfo';
import Card from '@ui/Cards';
import MenuCustom from '@ui/CustomMenu';
import Button from '@ui/Buttons/Primary/Button';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import classes from './order-item.module.scss';

interface Props {
  order: OrderModel;
}

const OrderItem: FC<Props> = ({ order }) => {
  const buyerInfo = useUserInfo(order.user);
  const isBBBStaff = useUserIsBBB();
  const allowRefundOrder = useMemo((): boolean => {
    const sellerIsBBB = order?.line_item[0]?.seller_is_bbb;
    if (order?.status === 'refunded') {
      return false;
    }
    if (order?.status !== 'refund') {
      if (sellerIsBBB) {
        return true;
      }
      if (!sellerIsBBB) {
        const existItemAllowRefund = order.line_item.find((i: LineItemModel) => {
          const itemNotExpired = isNotDateExpired(order?.date_finish, i?.return_within_days);
          return i?.is_allow_return && toLower(i?.status) !== 'refund' && itemNotExpired;
        });

        if (existItemAllowRefund) return true;
      }
    }
    return false;
  }, [order]);

  const showPaymentStatus = useMemo(() => {
    if (order.status === 'refunded') {
      return 'Refunded';
    }
    switch (order.payment_method) {
      case 'NO_PAYMENT':
        return '-';

      case 'STRIPE':
        if (order.is_payout_to_seller) {
          return 'Paid';
        }
        return 'Funds in escrow';

      default:
        break;
    }
  }, [order]);

  const renderListMenu = useCallback(() => {
    const allowCancelOrder = order?.status === 'completed';
    return (
      <>
        <li>
          <Link href={'/store-front/order-history/[id]'} as={`/store-front/order-history/${order._id}`}>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
              <span>View Order</span>
            </Button>
          </Link>
        </li>
        <li>
          <Link href={'/store-front/order-history/buyer/[id]'} as={`/store-front/order-history/buyer/${order.user}`}>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
              <span>View Buyer History</span>
            </Button>
          </Link>
        </li>
        {allowRefundOrder && (
          <li>
            <Link href={'/store-front/order-history/[id]/refund'} as={`/store-front/order-history/${order._id}/refund`}>
              <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                <span>Refund this order</span>
              </Button>
            </Link>
          </li>
        )}
        {allowCancelOrder && (
          <li>
            <Link href={'/store-front/order-history/[id]/cancel'} as={`/store-front/order-history/${order._id}/cancel`}>
              <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                <span>Cancel Order</span>
              </Button>
            </Link>
          </li>
        )}
      </>
    );
  }, [allowRefundOrder, order]);
  const renderBuyerRequest = useMemo(() => {
    if (order?.buyer_request_cancel && !order?.seller_cancel && order?.status !== 'refunded') {
      return <div className={classes.buyerRequest}>Buyer requested to cancel this order</div>;
    }
    return null;
  }, [order]);
  return (
    <Card className={cx('mb-4', classes.card)}>
      <div className={classes.container}>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={classes.heading}>Order ID</div>
          <Link href={'/store-front/order-history/[id]'} as={`/store-front/order-history/${order._id}`}>
            <a className={classes.value}>
              <span className={classes.customerLink}>{order.order_code}</span>
            </a>
          </Link>
        </div>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={classes.heading}>Buyer</div>
          <Link
            href={{ pathname: `/store-front/order-history/buyer/[id]` }}
            as={{ pathname: `/store-front/order-history/buyer/${order.user}` }}>
            <a className={classes.value}>
              <span className={classes.customerLink}>{buyerInfo?.displayName || order.customer_name}</span>
            </a>
          </Link>
        </div>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={classes.heading}>Items</div>
          <div className={classes.value}>{order.line_item.length}</div>
        </div>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={classes.heading}>Total</div>
          <div className={classes.value}>{formatCurrency(order.amount.total)}</div>
        </div>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={cx(classes.heading)}>Status</div>
          <div className={classes.value}>
            <span className={cx(classes.status)}>{startCase(camelCase(order.status))}</span>
          </div>
        </div>
        {!isBBBStaff && (
          <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
            <div className={cx(classes.heading)}>Payment status</div>
            <div className={classes.value}>{showPaymentStatus}</div>
          </div>
        )}
        <div className={'d-none d-md-block'}>
          <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
        </div>
        <div className={classes.showWhenMobile}>{renderBuyerRequest}</div>
      </div>
      <div className={cx('py-2', classes.mobileMenu)}>
        <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
      </div>
      <div className={classes.hideWhenMobile}>{renderBuyerRequest}</div>
    </Card>
  );
};

export default OrderItem;
