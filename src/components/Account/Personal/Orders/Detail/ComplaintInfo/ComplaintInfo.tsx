import React, { FC, useEffect } from 'react';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import StoreState from 'model/store';
import { getComplaintsOrder } from 'store/account/personal/orders/orders.action';
import Card from '@ui/Cards';
import classes from './complaint-info.module.scss';
import SendResponseItem from './SendResponseItem';

interface Props {
  orderId: string;
  isSeller: boolean;
}

const ComplaintInfo: FC<Props> = ({ isSeller, orderId }) => {
  const dispatch = useDispatch();
  const { complaints } = useSelector((store: StoreState) => ({
    complaints: store.account.personal.orders.complaint.list,
  }));

  useEffect(() => {
    if (orderId) {
      dispatch(
        getComplaintsOrder({
          isSeller,
          page: 1,
          pageSize: -1,
          sort: 'date_created:-1',
          where: `order:${orderId}`,
        }),
      );
    }
  }, [orderId, isSeller, dispatch]);

  return (
    complaints.length > 0 && (
      <Card className={cx(classes.container, 'mt-4')}>
        <div className={classes.title}>Complaint from Buyer</div>
        <SendResponseItem />
      </Card>
    )
  );
};

export default ComplaintInfo;
