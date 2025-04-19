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
import { constTitleStepCustomQuote } from '../../constraint';
import { FormStepContact } from '../../formDefaultValue';
import classes from './step-contact.module.scss';

interface Props {
  formStepContactTwoRef: any;
  formStepContact: FormStepContact;
  isCompleteCustomQuote: boolean;
}

const FormSchema = () =>
  Yup.object().shape({
    employeeName: Yup.string().required(t('partnerPortal.scorecard.validate.employeeName')),
    employeeEmail: Yup.string()
      .required(t('partnerPortal.scorecard.validate.employeeEmailRequired'))
      .email(t('authenticate.validate.emailInvalid')),
    employeeLocation: Yup.string().required(`Shop Location is required`),
    ownerEmail: Yup.string().required(`Customer’s Email is required.`).email(t('authenticate.validate.emailInvalid')),
    ownerName: Yup.string().required(`Customer’s Name is required`),
    ownerPhone: Yup.string()
      .required(`Customer’s Phone is required.`)
      .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  });

const StepContact: FC<Props> = ({ formStepContactTwoRef, formStepContact, isCompleteCustomQuote }) => {
  const { listDataStepCustomQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  const dataStepContact = useMemo(() => {
    return listDataStepCustomQuote[indexScorecardSelected]?.dataStepContact;
  }, [indexScorecardSelected, listDataStepCustomQuote]);

  const initialValues: FormStepContact = {
    employeeEmail: formStepContact?.employeeEmail || dataStepContact?.employeeEmail || '',
    employeeLocation: formStepContact?.employeeLocation || dataStepContact?.employeeLocation || '',
    employeeName: formStepContact?.employeeName || dataStepContact?.employeeName || '',
    ownerEmail: formStepContact?.ownerEmail || dataStepContact?.ownerEmail || '',
    ownerName: formStepContact?.ownerName || dataStepContact?.ownerName || '',
    ownerPhone: formStepContact?.ownerPhone || dataStepContact?.ownerPhone || '',
  };

  const renderTitleForm = useCallback((title: string) => {
    return <div className={classes.formTitle}>{title}</div>;
  }, []);

  const renderFormInput = useCallback(
    (title: string, formName: string, placeholder = '') => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          {renderTitleForm(title)}
          <FormikInput
            name={formName}
            className={classes.customButtonSize}
            placeholder={placeholder}
            disabled={isCompleteCustomQuote}
            maxLength={255}
          />
        </Col>
      );
    },
    [isCompleteCustomQuote, renderTitleForm],
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
            disabled={isCompleteCustomQuote}
          />
        </Col>
      );
    },
    [isCompleteCustomQuote, renderTitleForm],
  );

  return (
    <>
      <Formik
        innerRef={formStepContactTwoRef}
        onSubmit={() => null}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={() => FormSchema()}>
        {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormStepContact>) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className={classes.headerStep}>{constTitleStepCustomQuote.StepOneSubStepFour}</div>
              <div className={classes.wrapSubStepTwo}>
                <div className={classes.formHeader}>Shop Details</div>
                <Row className={classes.customRow}>
                  {renderFormInput('Employee Name*', 'employeeName', '')}
                  {renderFormInput('Employee Email*', 'employeeEmail', '')}
                  {renderFormInput('Shop Location*', 'employeeLocation', '')}
                </Row>
                <hr className={classes.customHr} />
                <div className={classes.formHeader}>Customer Details</div>
                <Row className={classes.customRow}>
                  {renderFormInput('Customer’s Name*', 'ownerName', '')}
                  {renderFormInput('Customer’s Email*', 'ownerEmail', '')}
                  {renderFormInputPhone('Customer’s Phone Number*', 'ownerPhone')}
                </Row>
              </div>
            </Form>
          );
        }}
      </Formik>
      <div className={classes.wrapBottomPadding} />
    </>
  );
};

export default StepContact;
