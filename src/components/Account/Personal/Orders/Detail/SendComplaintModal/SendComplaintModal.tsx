import React, { FC, memo, useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import trim from 'lodash/trim';
import { useDispatch } from 'react-redux';

import { sendComplaintForBuyer } from 'api/account/personal/order.api';
import { getComplaintsOrder } from 'store/account/personal/orders/orders.action';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import classes from './send-complaint-modal.module.scss';

const SendComplaintSchema = Yup.object().shape({
  content: Yup.string().required(t('common.validateRequired')),
});

interface Props {
  orderId: string;
  isSeller: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface SendComplaintForm {
  content: string;
}

const initialForm: SendComplaintForm = {
  content: '',
};

const SendComplaintModal: FC<Props> = (props) => {
  const { orderId, isSeller, isOpen, onClose } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    (form: SendComplaintForm) => {
      setLoading(true);
      sendComplaintForBuyer({ order_id: orderId, name: '', content: trim(form.content) })
        .then(() => {
          toastSuccess('Complaint sent');
          setLoading(false);
          onClose();
          dispatch(
            getComplaintsOrder(
              {
                isSeller,
                page: 1,
                pageSize: -1,
                sort: 'date_created:-1',
                where: `order:${orderId}`,
              },
              {
                silentLoad: true,
              },
            ),
          );
        })
        .catch((error) => {
          setLoading(false);
          toastError(error);
        });
    },
    [orderId, isSeller, onClose, dispatch],
  );

  return (
    <Modal
      className={classes.sendComplaintModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      title={'Send Complaint'}>
      <Formik initialValues={initialForm} validationSchema={SendComplaintSchema} onSubmit={onSubmit}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <FormikTextarea name={'content'} rows={10} maxLength={1000} />
              <Button disabled={loading} className={classes.button} buttonSize={'m'} type={'submit'}>
                Send
              </Button>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default memo(SendComplaintModal);
