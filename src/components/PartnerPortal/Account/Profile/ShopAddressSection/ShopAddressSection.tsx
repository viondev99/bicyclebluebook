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
import { updatePartnerDetail } from 'api/partner/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import FormikSelect from '../../../../Formik/Select/FormikSelect';
import classes from './shop-address-section.module.scss';

const AddressSchema = Yup.object().shape({
  address: Yup.string().required(t('common.validateRequired')),
  city: Yup.string().required(t('common.validateRequired')),
  state: Yup.string().required(t('common.validateRequired')),
  zipCode: Yup.string()
    .required(t('common.validateRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  same: Yup.boolean(),
  mailingAddress: Yup.string().required(t('common.validateRequired')),
  mailingCity: Yup.string().required(t('common.validateRequired')),
  mailingState: Yup.string().required(t('common.validateRequired')),
  mailingZipCode: Yup.string()
    .required(t('common.validateRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
});

interface FormAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  same: boolean;
  mailingAddress: string;
  mailingCity: string;
  mailingState: string;
  mailingZipCode: string;
}

const ShopAddressSection: React.FC = () => {
  const { partnerId, detail, detailPartnerLocation } = useSelector((store: StoreState) => ({
    detail: store.partner.account.detail,
    partnerId: store.authenticate?.user?.partner,
    detailPartnerLocation: store.partner.account.detailPartnerLocation,
  }));
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const stateOptions = useListCommonState();

  const initialValues = useMemo(() => {
    return {
      address: detail?.shopAddress?.address || (detailPartnerLocation?.address ? detailPartnerLocation?.address : ''),
      city: detail?.shopAddress?.city || (detailPartnerLocation?.city ? detailPartnerLocation?.city : ''),
      state: detail?.shopAddress?.state || (detailPartnerLocation?.state ? detailPartnerLocation?.state : ''),
      zipCode: detail?.shopAddress?.zipCode || (detailPartnerLocation?.zip_code ? detailPartnerLocation?.zip_code : ''),
      same: false,
      mailingAddress: detail?.mailingAddress?.address || '',
      mailingCity: detail?.mailingAddress?.city || '',
      mailingState: detail?.mailingAddress?.state || '',
      mailingZipCode: detail?.mailingAddress?.zipCode || '',
    };
  }, [detail]);

  const handleFormSubmit = useCallback(
    (form: FormAddress) => {
      if (partnerId) {
        setLoading(true);
        const payload = new FormData();
        payload.append('address', trim(form.address));
        payload.append('city', trim(form.city));
        payload.append('state', trim(form.state));
        payload.append('zip_code', trim(form.zipCode));
        payload.append('address_mailing.address', form.same ? trim(form.address) : trim(form.mailingAddress));
        payload.append('address_mailing.city', form.same ? trim(form.city) : trim(form.mailingCity));
        payload.append('address_mailing.state', form.same ? trim(form.state) : trim(form.mailingState));
        payload.append('address_mailing.zip_code', form.same ? trim(form.zipCode) : trim(form.mailingZipCode));
        updatePartnerDetail(partnerId, payload)
          .then(() => {
            toastSuccess(t('partnerPortal.account.updateAccount'));
            setLoading(false);
            setEditable(false);
          })
          .catch((error) => {
            toastError(error);
            setLoading(false);
          });
      }
    },
    [partnerId],
  );

  return (
    <div className={classes.shopInfo}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={AddressSchema}>
        {({ isValid, values, handleSubmit }: FormikProps<any>) => (
          <>
            <div className={classes.headerForm}>
              <div className={classes.subTitle}>Shop Address</div>
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
                    inputId={'state-select-shop-address-section-1'}
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
                    label={'Mailing address is the same as shop address'}
                    disabled={!editable}
                  />
                </Col>
              </Row>
              {!values.same && editable && (
                <>
                  <div className={classes.headerForm} style={{ justifyContent: 'flex-start' }}>
                    <div className={classes.subTitle}>Mailing Address</div>
                  </div>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>Address*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikInput name="mailingAddress" disabled={!editable} />
                    </Col>
                  </Row>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>City*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikInput name="mailingCity" disabled={!editable} />
                    </Col>
                  </Row>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>State*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikSelect
                        inputId={'state-select-shop-address-section-2'}
                        disabled={!editable}
                        options={stateOptions}
                        name="mailingState"
                        isSearchable={true}
                      />
                    </Col>
                  </Row>
                  <Row className={classes.wrapperInput}>
                    <Col xs={12} sm={3}>
                      <div className={classes.label}>Zip Code*</div>
                    </Col>
                    <Col xs={12} sm={9}>
                      <FormikInput name="mailingZipCode" disabled={!editable} />
                    </Col>
                  </Row>
                </>
              )}
              <Button
                isLoading={loading}
                type="submit"
                className={classes.btnSave}
                disabled={!editable || !isValid || loading}>
                Save Changes
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default ShopAddressSection;
