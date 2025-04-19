import React, { useState, useMemo, useCallback } from 'react';
import trim from 'lodash/trim';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import { useListCommonState } from 'hooks/useListCommonState';
import StoreState from 'model/store';
import { updateStorefrontDetail } from 'api/store-front/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import FormikSelect from '../../../../Formik/Select/FormikSelect';
import classes from './address-section.module.scss';

const AddressSchema = Yup.object().shape({
  address: Yup.string().required(t('common.validateRequired')),
  city: Yup.string().required(t('common.validateRequired')),
  state: Yup.string().required(t('common.validateRequired')),
  zipCode: Yup.string()
    .required(t('common.validateRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  same: Yup.boolean(),
  shippingAddress: Yup.string().required(t('common.validateRequired')),
  shippingCity: Yup.string().required(t('common.validateRequired')),
  shippingState: Yup.string().required(t('common.validateRequired')),
  shippingZipCode: Yup.string()
    .required(t('common.validateRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
});

interface FormAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  same: boolean;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
}

const AddressSection: React.FC = () => {
  const { detail } = useSelector((store: StoreState) => ({
    detail: store.storeFront.account.detail,
  }));
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const stateOptions = useListCommonState();

  const initialValues = useMemo(() => {
    return {
      address: detail?.bindingAddress?.address || '',
      city: detail?.bindingAddress?.city || '',
      state: detail?.bindingAddress?.state || '',
      zipCode: detail?.bindingAddress?.zipCode || '',
      same: false,
      shippingAddress: detail?.shippingAddress?.address || '',
      shippingCity: detail?.shippingAddress?.city || '',
      shippingState: detail?.shippingAddress?.state || '',
      shippingZipCode: detail?.shippingAddress?.zipCode || '',
    };
  }, [detail]);

  const handleFormSubmit = useCallback(
    (form: FormAddress) => {
      if (detail?.id) {
        setLoading(true);
        const payload = new FormData();
        payload.append('binding_address.address', trim(form.address));
        payload.append('binding_address.city', trim(form.city));
        payload.append('binding_address.state', trim(form.state));
        payload.append('binding_address.zip_code', trim(form.zipCode));
        payload.append('shipping_address.address', form.same ? trim(form.address) : trim(form.shippingAddress));
        payload.append('shipping_address.city', form.same ? trim(form.city) : trim(form.shippingCity));
        payload.append('shipping_address.state', form.same ? trim(form.state) : trim(form.shippingState));
        payload.append('shipping_address.zip_code', form.same ? trim(form.zipCode) : trim(form.shippingZipCode));
        updateStorefrontDetail(detail.id, payload)
          .then(() => {
            toastSuccess(t('storeFront.account.updateAccount'), t('seoTitle.success'));
            setLoading(false);
            setEditable(false);
          })
          .catch((error) => {
            toastError(error);
            setLoading(false);
          });
      }
    },
    [detail],
  );

  return (
    <div className={classes.storefrontInfo}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={AddressSchema}>
        {({ isValid, values, handleSubmit }: FormikProps<any>) => (
          <>
            <div className={classes.headerForm}>
              <div className={classes.subTitle}>Storefront Address</div>
              <Button
                disabled={editable}
                buttonType="clear"
                className={cx(classes.editForm, classes.activeEdit)}
                onClick={() => setEditable(true)}>
                Edit
              </Button>
            </div>
            <Form onSubmit={handleSubmit}>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={3}>
                  <div className={classes.label}>Address*</div>
                </Col>
                <Col xs={12} sm={9}>
                  <FormikInput name="address" disabled={!editable} />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={3}>
                  <div className={classes.label}>City*</div>
                </Col>
                <Col xs={12} sm={9}>
                  <FormikInput name="city" disabled={!editable} />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={3}>
                  <div className={classes.label}>State*</div>
                </Col>
                <Col xs={12} sm={9}>
                  <FormikSelect
                    inputId={'state-select-storefront-address-section-1'}
                    disabled={!editable}
                    options={stateOptions}
                    name="state"
                    isSearchable={true}
                  />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={3}>
                  <div className={classes.label}>Zip Code*</div>
                </Col>
                <Col xs={12} sm={9}>
                  <FormikInput name="zipCode" disabled={!editable} />
                </Col>
              </Row>
              <Row className={classes.wrapperInput} style={{ marginTop: 50 }}>
                <Col xs={12} sm={12}>
                  <FormikCheckbox
                    name="same"
                    label={'Shipping address is the same as shop address'}
                    disabled={!editable}
                  />
                </Col>
              </Row>
              {!values.same && editable && (
                <>
                  <div className={classes.headerForm} style={{ justifyContent: 'flex-start' }}>
                    <div className={classes.subTitle}>Shipping Address</div>
                  </div>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>Address*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikInput name="shippingAddress" disabled={!editable} />
                    </Col>
                  </Row>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>City*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikInput name="shippingCity" disabled={!editable} />
                    </Col>
                  </Row>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>State*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikSelect
                        inputId={'state-select-storefront-address-section-2'}
                        disabled={!editable}
                        options={stateOptions}
                        name="shippingState"
                        isSearchable={true}
                      />
                    </Col>
                  </Row>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>Zip Code*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikInput name="shippingZipCode" disabled={!editable} />
                    </Col>
                  </Row>
                </>
              )}
              <Button type="submit" className={classes.btnSave} disabled={!editable || !isValid || loading}>
                Save Changes
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddressSection;
