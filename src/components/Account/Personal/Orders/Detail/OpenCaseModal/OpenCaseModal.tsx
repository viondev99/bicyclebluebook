import React, { FC, memo, useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { openCaseForBuyer } from 'api/account/personal/order.api';
import { getComplaintsOrder } from 'store/account/personal/orders/orders.action';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import classes from './open-case-modal.module.scss';

const SendComplaintSchema = Yup.object().shape({
  content: Yup.string().required(t('common.validateRequired')),
});

interface Props {
  orderId: string;
  isSeller: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface OpenCaseForm {
  content: string;
  reason: string;
}

const initialForm: OpenCaseForm = {
  content: '',
  reason: '',
};

const OpenCaseModal: FC<Props> = (props) => {
  const { orderId, isSeller, isOpen, onClose } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    (form: OpenCaseForm) => {
      setLoading(true);
      openCaseForBuyer({
        order_id: orderId,
        reason_case: {
          description: form.content,
          reason: form.reason,
        },
      })
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
      className={classes.openCaseModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      title={'Open a Case'}
      titleClassName={classes.title}>
      <Formik initialValues={initialForm} validationSchema={SendComplaintSchema} onSubmit={onSubmit}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <p className={classes.nameTitle}>Reason</p>
              <div className={classes.groupSelect}>
                <div className={classes.itemSelect}>
                  <Field type="radio" name="reason" value="item_not_received" className={classes.radio} />
                  <span>Item not received</span>
                </div>
                <div className={classes.itemSelect}>
                  <Field type="radio" name="reason" value="item_damaged" className={classes.radio} />
                  <span>Item damaged</span>
                </div>
                <div className={classes.itemSelect}>
                  <Field type="radio" name="reason" value="item_not_as_descril" className={classes.radio} />
                  <span>Item not as described</span>
                </div>
              </div>
              <p className={classes.nameTitle}>Description</p>
              <FormikTextarea name={'content'} rows={5} maxLength={1000} className={classes.description} />
              <div className={classes.rowBtn}>
                <Button
                  disabled={loading}
                  className={cx(classes.btnCancel, 'clear')}
                  buttonSize={'m'}
                  type={'submit'}
                  onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={loading} className={classes.button} buttonSize={'m'} type={'submit'}>
                  Open Case
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default memo(OpenCaseModal);
