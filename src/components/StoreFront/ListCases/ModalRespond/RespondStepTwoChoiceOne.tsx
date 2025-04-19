import React, { FC } from 'react';
import Textarea from '@ui/Textarea';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { FormStepTwo } from '.';
import classes from './modal-respond.module.scss';

interface Props {
  formStepTwo: FormStepTwo;
  handleChangeStepTwoForm: (key: string, value: string | number) => void;
}

const RespondStepTwoChoiceOne: FC<Props> = ({ formStepTwo, handleChangeStepTwoForm }) => {
  const { replace } = useRouter();
  const detailOrder = useSelector((store: StoreState) => store.storeFront.order.detail.order);
  const isRefunded = detailOrder?.status === 'refunded';

  const gotoPage = () => {
    return replace({
      pathname: `/store-front/order-history/${detailOrder?._id}`,
      query: {},
    });
  };
  return (
    <>
      {isRefunded && (
        <div className={classes.refundedView}>
          <div className={classes.text}>You have refunded this order already.</div>
          <div className={classes.text}>Total amount refunded:</div>
          <div className={classes.priceDetail}>
            <span className={classes.price}>{detailOrder?.amount?.total ? `$${detailOrder?.amount?.total}` : ''}</span>
            <span onClick={gotoPage} className={classes.link}>
              View details
            </span>
          </div>
        </div>
      )}
      <div className={classes.modalRespondFormTitle}>Note to buyer</div>
      <Textarea value={formStepTwo?.note} rows={6} onChange={(e) => handleChangeStepTwoForm('note', e.target.value)} />
    </>
  );
};

export default React.memo(RespondStepTwoChoiceOne);
