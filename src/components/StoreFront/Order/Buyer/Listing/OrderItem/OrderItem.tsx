import React, { FC } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import { formatCurrency } from 'helpers/string.helper';
import { OrderModel } from 'model/store/store-front/order.model';
import dayjs from 'dayjs';
import Link from 'next/link';
import classes from './order-item.module.scss';

interface Props {
  order: OrderModel;
}

const OrderItem: FC<Props> = ({ order }) => {
  return (
    <Card className={cx('mb-4', classes.card)}>
      <div className={classes.container}>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={classes.heading}>Order ID</div>
          <div className={classes.value}>
            <Link href={'/store-front/order-history/[id]'} as={`/store-front/order-history/${order._id}`}>
              <a className={classes.value}>{order.order_code}</a>
            </Link>
          </div>
        </div>
        <div className={cx('d-flex flex-row flex-md-column py-2 py-md-0', classes.column)}>
          <div className={classes.heading}>Date</div>
          <div className={classes.value}>{dayjs(order.date_created).format('DD MMMM YYYY')}</div>
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
      </div>
    </Card>
  );
};

export default OrderItem;
