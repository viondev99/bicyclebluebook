import React, { FC, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { formatDateUsa } from 'helpers/date.helper';
import { cancelOrder } from 'api/store-front/order.api';
import cx from 'classnames';
import { OrderDetailModel } from 'model/store/account/personal/orders.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import Card from '@ui/Cards';
import { DetailOrderModel } from 'model/store/store-front/order.model';
import Button from '@ui/Buttons/Primary/Button';
import Radio from '@ui/Radio';
import classes from './form-cancel.module.scss';

const ReasonsCancel = ['Out of stock or damaged', 'Buyer asked to cancel', 'Issue with buyer payment'];

interface Props {
  order: DetailOrderModel | OrderDetailModel;
}

const FormCancel: FC<Props> = ({ order }) => {
  const [reasonChecked, setReason] = useState(ReasonsCancel[0]);
  const router = useRouter();
  const handleCancelOrder = useCallback(() => {
    const bodyParams = {
      reason: order.buyer_request_cancel ? order?.buyer_reason_cancel : reasonChecked,
      order_id: order?._id,
    };
    cancelOrder(bodyParams)
      .then((res) => {
        toastSuccess('Cancel order successfully.');
        if (router?.pathname?.includes('seller-personal')) {
          router.push(`/account/order/${order._id}`);
        } else {
          router.push(`/store-front/order-history/${order._id}`);
        }
      })
      .catch((err) => {
        toastError(err);
      });
  }, [order, reasonChecked, router]);
  const isDisabledCancelOrder = useMemo((): boolean => {
    if (order?.buyer_request_cancel || reasonChecked) {
      return false;
    }

    return true;
  }, [order, reasonChecked]);

  const renderFormCancel = useMemo(() => {
    if (order?.buyer_request_cancel) {
      return (
        <>
          <h3>The buyer wants to cancel this order.</h3>
          <div className={classes.lineInfo}>
            <div className={classes.label}>
              <p>Reason:</p>
            </div>
            <div className={classes.content}>
              <p>{order?.buyer_reason_cancel}</p>
            </div>
          </div>
          <div className={cx(classes.lineInfo, 'mb-3 mt-0')}>
            <div className={classes.label}>
              <p>Date request:</p>
            </div>
            <div className={classes.content}>
              <p>{formatDateUsa(order?.date_cancel)}</p>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={classes.title}>Reason for Cancelling</div>
        <div className={classes.containRadio}>
          {ReasonsCancel.map((reason: string, index: number) => (
            <div key={String(index)} className={classes.radio}>
              <Radio
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                label={<span className={classes.titleRadio}>{reason}</span>}
                checked={reason === reasonChecked}
              />
            </div>
          ))}
        </div>
      </>
    );
  }, [order, reasonChecked]);
  return (
    <Card className={classes.containFormCancel}>
      {renderFormCancel}
      <Button
        disabled={isDisabledCancelOrder}
        buttonType="danger"
        className={classes.customBtn}
        onClick={handleCancelOrder}>
        Cancel Order
      </Button>
    </Card>
  );
};
export default FormCancel;
