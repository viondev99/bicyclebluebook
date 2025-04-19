import React, { FC, useState, useCallback } from 'react';
import Card from '@ui/Cards';
import { useRouter } from 'next/router';
import { formatCurrency } from 'helpers/string.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { cancelOrder } from 'api/store-front/order.api';
import { OrderDetailModel } from 'model/store/account/personal/orders.model';
import Button from '@ui/Buttons/Primary/Button';
import Textarea from '@ui/Textarea';
import classes from './cancel-form.module.scss';

interface Props {
  order: OrderDetailModel;
}

const CancelForm: FC<Props> = ({ order }) => {
  const [reason, setReason] = useState('');
  const router = useRouter();
  const handleSendCancelReq = useCallback(() => {
    cancelOrder({
      order_id: order?._id,
      reason,
    })
      .then((res) => {
        toastSuccess('Send request to cancel order successfully.');
        router.push(`/account/order/${order?._id}`);
      })
      .catch((err) => {
        toastError(err);
      });
  }, [order, reason, router]);
  return (
    <div>
      <div className={classes.title}>#{order?.order_code}</div>
      <div className={classes.price}>{formatCurrency(order?.amount?.total)}</div>
      <div className={classes.titleForm}>Reason for Cancelling</div>
      <div>
        <Textarea rows={6} onChange={(e) => setReason(e.target.value)} />
      </div>
      <div className={classes.wrapBtn}>
        <Button buttonType="danger" disabled={reason === ''} onClick={handleSendCancelReq}>
          Cancel Order
        </Button>
      </div>
    </div>
  );
};

export default CancelForm;
