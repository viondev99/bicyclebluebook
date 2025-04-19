/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import StoreState from 'model/store';
import React, { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import * as Yup from 'yup';
import { constTitleStepCustomQuote } from '../../../CustomQuote/constraint';
import { FormStepContact, TradeInScoreCardsProps } from '../../formDefaultValue';
import classes from './sub-step-seven.module.scss';

interface Props {
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  isCompleted: boolean;
  form: TradeInScoreCardsProps;
}

const FormSchema = () =>
  Yup.object().shape({
    employeeName: Yup.string().required(t('partnerPortal.scorecard.validate.employeeName')),
    employeeEmail: Yup.string()
      .required(t('partnerPortal.scorecard.validate.employeeEmailRequired'))
      .email(t('authenticate.validate.emailInvalid')),
    employeeLocation: Yup.string().required(`Shop Location is required`),
    ownerEmail: Yup.string().required(`Owner’s Email is required.`).email(t('authenticate.validate.emailInvalid')),
    ownerName: Yup.string().required(`Owner’s Name is required`),
    ownerPhone: Yup.string()
      .required(`Owner’s Phone is required.`)
      .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  });

const StepContact: FC<Props> = ({ isCompleted, onChangeForm, form }) => {
  const dataTradeInRequest = useSelector((store: StoreState) => store.partner.scorecard.dataTradeInRequest); // done

  const formatName = useMemo(() => {
    return dataTradeInRequest?.owner?.name.split(' ');
  }, [dataTradeInRequest]);

  const initialValues: FormStepContact = {
    ownerEmail: dataTradeInRequest?.owner?.email || '',
    ownerFirstName: formatName?.length ? formatName[0] : '',
    ownerLastName: formatName?.length > 1 ? formatName.slice(1, formatName.length).join(' ') : '',
    ownerPhone: form?.ownerDetails?.ownerPhone || '',
    employeeEmail: '',
    employeeLocation: '',
    employeeName: '',
  };

  const renderTitleForm = useCallback((title: string) => {
    return <div className={classes.formTitle}>{title}</div>;
  }, []);

  const handleChangeFormik = useCallback(
    (key: string, value: string) => {
      onChangeForm({
        ...form,
        ownerDetails: {
          ...form?.ownerDetails,
          [key]: value,
        },
      });
    },
    [form, onChangeForm],
  );

  const renderFormInput = useCallback(
    (title: string, formName: string, placeholder = '') => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          {renderTitleForm(title)}
          <FormikInput
            name={formName}
            className={classes.customButtonSize}
            placeholder={placeholder}
            disabled={!isCompleted}
            onChange={(e) => handleChangeFormik(formName, e?.currentTarget?.value)}
          />
        </Col>
      );
    },
    [handleChangeFormik, isCompleted, renderTitleForm],
  );

  const renderFormInputPhone = useCallback(
    (title: string, formName: string) => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          {renderTitleForm(title)}
          <FormikTextMask
            name={formName}
            typeMask="phone"
            inputClassName={classes.customInputNumber}
            className={classes.customButtonSize}
            disabled={!isCompleted}
            onChange={(e) => handleChangeFormik(formName, e?.currentTarget?.value)}
          />
        </Col>
      );
    },
    [handleChangeFormik, isCompleted, renderTitleForm],
  );

  return (
    <Formik
      onSubmit={() => null}
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={() => FormSchema()}>
      {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormStepContact>) => {
        return (
          <Form onSubmit={handleSubmit}>
            <div className={classes.headerStep}>{constTitleStepCustomQuote.StepOneSubStepFour}</div>
            <div className={classes.wrapSubStepTwo}>
              <div className={classes.formHeader}>Owner Details</div>
              <Row className={classes.customRow}>
                {renderFormInput('First Name*', 'ownerFirstName', '')}
                {renderFormInput('Last Name*', 'ownerLastName', '')}
                {renderFormInput('Owner’s Email*', 'ownerEmail', '')}
                {renderFormInputPhone('Owner’s Phone Number*', 'ownerPhone')}
              </Row>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default StepContact;
