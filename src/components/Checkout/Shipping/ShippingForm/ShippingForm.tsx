/* eslint-disable no-unused-expressions */
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import { Form, Formik, FormikProps, useFormikContext } from 'formik';
import shippingAction from 'store/checkout/shipping/shipping.action';
import cartAction from 'store/checkout/cart/cart.action';
import StoreState from 'model/store';
import { ShippingSingle } from 'model/store/checkout/shipping.model';
import t from 'helpers/language';
import ShippingItem from '../ShippingItem/ShippingItem';
import ShippingFormControl from './ShippingFormControl';
import classes from './shipping-form.module.scss';

export interface AddShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  apartment?: string;
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

const ResetFormOnShippingChange: FC = () => {
  const { resetForm, setErrors } = useFormikContext();
  const shipping = useSelector((store: StoreState) => store.checkout.shipping.shippingList.data);
  const selected = useSelector((store: StoreState) => store.checkout.cart.shipping?._id);

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipping]);
  useEffect(() => {
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  return null;
};

const ShippingForm: FC = () => {
  const dispatch = useDispatch();
  const shipping = useSelector((store: StoreState) => store.checkout.shipping.shippingList.data);
  const loading = useSelector((store: StoreState) => store.checkout.shipping.adding);
  const checkoutShippingId = useSelector((store: StoreState) => store.checkout.cart?.shipping?._id);
  const isLogging = useSelector((store: StoreState) => !!store.authenticate.token);
  const [apartmentShipping, setApartmentShipping] = useState<boolean>(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (isLogging) {
      dispatch(shippingAction.getShipping());
    }
  }, [dispatch, isLogging]);
  const handleSubmitForm = useCallback(
    (form: AddShippingForm) => {
      dispatch(shippingAction.addShipping(form));
    },
    [dispatch],
  );

  const handleSubmitFormByClick = useCallback(() => {
    const values: AddShippingForm = formRef?.current?.values;
    if (!apartmentShipping) {
      delete values?.apartment;
    }
    if (
      values?.address !== '' &&
      values?.city !== '' &&
      values?.firstName !== '' &&
      values?.lastName !== '' &&
      values?.phoneNumber !== '' &&
      values?.state !== '' &&
      values?.zip !== ''
    ) {
      dispatch(shippingAction.addShipping(values));
    } else {
      formRef?.current?.handleSubmit();
    }
  }, [dispatch, apartmentShipping]);

  const handleSelectShipping = useCallback(
    (item: ShippingSingle) => {
      dispatch(cartAction.saveCheckoutShipping(item));
      dispatch(cartAction.getCarts());
    },
    [dispatch],
  );
  const handleRemoveShipping = useCallback(
    (shippingId: string) => {
      dispatch(shippingAction.removeShipping(shippingId));
      dispatch(cartAction.getCarts());
    },
    [dispatch],
  );

  const handleEditShipping = useCallback(
    (shippingId: string, address: AddShippingForm) => {
      const payload = address;
      if (!apartmentShipping) {
        payload.apartment = '';
      }
      dispatch(shippingAction.editShipping(shippingId, payload));
      dispatch(cartAction.getCarts());
    },
    [dispatch, apartmentShipping],
  );

  return (
    <>
      {shipping.map((i) => (
        <ShippingItem
          onRemove={() => handleRemoveShipping(i._id)}
          onEdit={(info) => handleEditShipping(i._id, info)}
          show={apartmentShipping}
          setShow={setApartmentShipping}
          key={i._id}
          checked={i._id === checkoutShippingId}
          onSelect={() => handleSelectShipping(i)}
          name={`${i.first_name} ${i.last_name}`}
          address={{
            phoneNumber: i.phone,
            zip: i.postal_code,
            state: i.state,
            city: i.city,
            address: i.line1,
            firstName: i.first_name,
            lastName: i.last_name,
            apartment: i?.apartment,
          }}
        />
      ))}
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        validationSchema={validateSchema}
        enableReinitialize={true}
        innerRef={formRef}>
        {({ handleSubmit, setFieldValue }: FormikProps<AddShippingForm>) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Card className={classes.shippingCard}>
                <ResetFormOnShippingChange />
                <h3 className={classes.title}>Add a New Address</h3>
                <ShippingFormControl setFieldValue={setFieldValue} setShow={setApartmentShipping} />
                <div className={cx('text-right', classes.formGroup)}>
                  <Button onClick={handleSubmitFormByClick} disabled={loading}>
                    Add Address
                  </Button>
                </div>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ShippingForm;
