import React, { FC } from 'react';
import Link from 'next/link';
import { formatCurrency, slugifyId } from '../../../../../helpers/string.helper';
import classes from './summary-cart-item.module.scss';

interface Props {
  bikeName: string;
  price: number;
  quantity: number;
  id: number;
}

const SummaryCartItem: FC<Props> = ({ bikeName, quantity, price, id }) => {
  const href = `/marketplace/buy-now/[id]`;
  const as = `/marketplace/buy-now/${slugifyId(bikeName, id)}`;
  return (
    <div className={classes.wrapper}>
      <Link href={href} as={as}>
        <a className={classes.title}>{bikeName}</a>
      </Link>
      <p className={classes.quantity}>Quantity: {quantity}</p>
      <p className={classes.price}>{formatCurrency(price)}</p>
    </div>
  );
};

export default SummaryCartItem;
