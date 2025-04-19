import React, { FC } from 'react';
import cx from 'classnames';
import classes from 'components/StoreFront/Order/Listing/OrderItem/order-item.module.scss';
import Card from '@ui/Cards';

interface Props {
  title: string;
}

const NotFoundItem: FC<Props> = ({ title }) => {
  return (
    <Card className={cx('mb-4', classes.card)}>
      <div className={classes.container}>
        <h3>{title}</h3>
      </div>
    </Card>
  );
};

export default NotFoundItem;
