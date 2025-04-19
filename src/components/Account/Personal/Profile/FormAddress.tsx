/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icClose from 'assets/img/account/personal/ic_close_circle.svg';
import classes from './profile.module.scss';
import { PersonalInfo } from '../../../../model/store/account/personal/profile.model';
import { useListCommonState } from '../../../../hooks/useListCommonState';
import FormikSelect from '../../../Formik/Select/FormikSelect';
import * as profileAction from '../../../../store/account/personal/profile/profile.action';
import StoreState from '../../../../model/store/index';

const AddressSchema = Yup.object().shape({
  apartment: Yup.string().notRequired(),
  address: Yup.string().notRequired(),
  city: Yup.string().notRequired(),
  state: Yup.string().notRequired(),
  zip_code: Yup.string()
    .notRequired()
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
});
interface AddressForm {
  apartment?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}
const valueForm: AddressForm = {
  apartment: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
};
interface Props {
  personalAccount: PersonalInfo;
}
function FormAddress(props: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [editForm, enableEditForm] = useState(false);
  const [initialValues, setInitialValue] = useState(valueForm);
  const error = useSelector((store: StoreState) => store.account.personal.profile.error);
  const update_from = useSelector((store: StoreState) => store.account.personal.profile.updateFrom);
  const dispatch = useDispatch();
  const { personalAccount } = props;

  const formikRef = useRef<FormikProps<AddressForm>>();

  function handleFormSubmit(values: AddressForm): void {
    dispatch(profileAction.updatePersonalProfile({ ...values, update_from: 'formAddress' }));
    enableEditForm(false);
  }
  useEffect(() => {
    if (personalAccount) {
      setInitialValue({
        ...valueForm,
        apartment: personalAccount.apartment,
        address: personalAccount.address,
        city: personalAccount.city,
        state: personalAccount.state,
        zip_code: personalAccount.zip_code,
      });
    }
    if (personalAccount && personalAccount?.apartment) {
      setShowOptions(true);
    }
    if (personalAccount && personalAccount?.apartment === '') {
      setShowOptions(false);
    }
  }, [personalAccount]);
  useEffect(() => {
    if (error && update_from === 'formAddress') {
      enableEditForm(true);
    }
  }, [error, update_from]);

  const handleClose = useCallback(() => {
    setShowOptions((prev) => !prev);
    formikRef.current && formikRef.current.setFieldValue('apartment', '');
  }, []);

  const stateOptions = useListCommonState();
  return (
    <div className={classes.accountInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Your Address</div>
        <Button
          disabled={editForm}
          buttonType="clear"
          className={cx(classes.editForm, classes.activeEdit)}
          onClick={() => enableEditForm(true)}>
          Edit
        </Button>
      </div>
      {!!editForm && (
        <Button className={classes.wrapOptions} onClick={handleClose} disabled={!editForm}>
          {!showOptions ? (
            <img src={icAdd} alt="" width={28} height={28} />
          ) : (
            <img src={icClose} alt="" width={28} height={28} />
          )}
          <h4>{!showOptions ? 'Add' : 'Remove'} Apartment/Suite Number</h4>
        </Button>
      )}
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        innerRef={formikRef}
        validationSchema={AddressSchema}>
        {({ isValid, handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            {!!((showOptions && personalAccount?.apartment) || showOptions) && (
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={4}>
                  <div className={classes.labelOptions}>
                    Apartment/
                    <br />
                    Suite No.
                  </div>
                  <div className={classes.labelOptionsMobile}>Apartment/Suite No.</div>
                </Col>
                <Col xs={12} sm={8}>
                  <FormikInput name="apartment" disabled={!editForm} />
                </Col>
              </Row>
            )}
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Address</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="address" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>City</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="city" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>State</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikSelect
                  inputId={'select-state-address'}
                  disabled={!editForm}
                  options={stateOptions}
                  name="state"
                  className={cx(classes.input)}
                  isSearchable={true}
                />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Zip Code</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="zip_code" disabled={!editForm} />
              </Col>
            </Row>
            <Button type="submit" className={classes.btnSave} disabled={!editForm || !isValid}>
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FormAddress;
