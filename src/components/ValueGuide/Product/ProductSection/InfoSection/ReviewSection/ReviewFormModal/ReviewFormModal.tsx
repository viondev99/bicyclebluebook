import React, { FC, useCallback } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Form, Formik, FormikProps } from 'formik';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import * as Yup from 'yup';
import { storeRating } from 'store/value-guide/value-guide.action';
import t from 'helpers/language';
import Rating from '../../../Rating/Rating';
import classes from './reviewFormModal.module.scss';

interface FormValues {
  rate: number;
  title: string;
  comment: string;
}

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .required(t('marketplace.validate.reviewTitleRequired'))
    .max(100, 'Name cannot exceed 100 characters.'),
  comment: Yup.string().max(2000, 'Comment cannot exceed 2000 characters.'),
});

const initialValues: FormValues = {
  rate: 5,
  title: '',
  comment: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewFormModal: FC<Props> = ({ isOpen, onClose }) => {
  const bicycle = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.bicycle);
  const dispatch = useDispatch();
  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      dispatch(
        storeRating({
          bicycleId: bicycle?.id,
          ...values,
        }),
      );
      onClose();
    },
    [bicycle, dispatch, onClose],
  );

  return (
    <MobileFullScreenModal onClose={onClose} isOpen={isOpen} title={bicycle?.name}>
      <h2 className={classes.title}>Review</h2>
      <Formik
        enableReinitialize={true}
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={FormSchema}>
        {({ handleSubmit, values, setFieldValue }: FormikProps<FormValues>) => (
          <Form onSubmit={handleSubmit} className={classes.form}>
            <div className="d-flex">
              <h3>Overall Rating</h3>
              <Rating
                initialRating={values.rate}
                onChange={(value) => {
                  setFieldValue('rate', value);
                }}
                className={classes.rating}
              />
            </div>
            <div className={cx('form-group', classes.formGroup)}>
              <div>
                <h3>Summary</h3>
              </div>
              <FormikInput name="title" placeholder="Overall opinion on the bike." className={classes.input} />
            </div>
            <div className={cx('form-group', classes.formGroup, classes.textAreaWrapper)}>
              <div>
                <h3>Your Review</h3>
              </div>
              <FormikTextarea
                name="comment"
                placeholder="Give any information you think other people should know."
                className={cx(classes.textArea, classes.input)}
                rows={5}
              />
            </div>

            <div className={classes.btn}>
              <Button type="submit">Submit Review</Button>
            </div>
          </Form>
        )}
      </Formik>
    </MobileFullScreenModal>
  );
};

export default ReviewFormModal;
