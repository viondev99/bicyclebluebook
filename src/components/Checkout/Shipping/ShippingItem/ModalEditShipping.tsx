import React, { FC, useEffect, useState } from 'react';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import { Form, Formik, FormikProps } from 'formik';
import Card from '@ui/Cards';
import cx from 'classnames';
import * as yup from 'yup';
import ShippingFormControl from '../ShippingForm/ShippingFormControl';
import classes from './shipping-item.module.scss';
import t from '../../../../helpers/language';

interface AddShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  apartment?: string;
}

interface Props {
  onClose: () => void;
  open: boolean;
  disabled: boolean;
  onSave: (newShipping: AddShippingForm) => void;
  address: AddShippingForm;
  show: boolean;
  setShow?: (show: boolean) => void;
}

const initialValues = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phoneNumber: '',
  apartment: '',
};

const validateSchema = yup.object().shape({
  address: yup.string().required(t('common.validate.addressRequired')),
  city: yup.string().required(t('common.validate.cityRequired')),
  firstName: yup.string().required(t('common.validate.firstNameRequired')),
  lastName: yup.string().required(t('common.validate.lastNameRequired')),
  phoneNumber: yup
    .string()
    .required(t('common.validate.phoneNumberRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  state: yup.string().required(t('common.validate.stateRequired')),
  zip: yup
    .string()
    .required(t('common.validate.zipCodeRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
});

const ModalEditShipping: FC<Props> = ({ open, onClose, onSave, address, disabled, show, setShow }) => {
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      className={classes.editModal}
      contentClassName={classes.contentEditModal}
      header={null}>
      <Formik initialValues={address} onSubmit={onSave} validationSchema={validateSchema} enableReinitialize={true}>
        {({ handleSubmit, setFieldValue }: FormikProps<AddShippingForm>) => {
          return (
            <Form>
              <Card className={classes.shippingCard}>
                <h3 className={cx(classes.title, 'mb-4')}>Edit Address</h3>
                <ShippingFormControl
                  disabled={disabled}
                  address={address}
                  setFieldValue={setFieldValue}
                  setShow={setShow}
                />
                <div className={cx('text-right', 'mt-2', classes.formGroup)}>
                  <Button disabled={disabled} buttonType="outline" onClick={onClose} className="mr-4">
                    Cancel
                  </Button>
                  <Button disabled={disabled} type="submit">
                    Save Changes
                  </Button>
                </div>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default ModalEditShipping;
