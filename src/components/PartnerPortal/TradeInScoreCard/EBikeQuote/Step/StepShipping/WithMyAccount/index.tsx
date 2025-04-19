/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import Card from '@ui/Cards';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import * as Yup from 'yup';
import classes from './with-my-account.module.scss';

interface Props {
  formStepForSelectTwoRef: any;
  isCompleted: boolean;
}

export interface FormStepFourSelectTwo {
  carrier: string;
  carrierTrackingNumber: string;
}

const FormSchema = () =>
  Yup.object().shape({
    carrier: Yup.string().required(t('partnerPortal.scorecard.validate.carrier')),
    carrierTrackingNumber: Yup.string().required(`Carrier Tracking Number is required.`),
  });

const WithMyAccount: FC<Props> = ({ formStepForSelectTwoRef, isCompleted }) => {
  const { currentWidthScreen } = useScreenDetect();
  const formRef = formStepForSelectTwoRef;
  const dataStepShippingAndCompleteStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepShippingAndCompleteStandardQuote,
  );

  const initialValues: FormStepFourSelectTwo = {
    carrier: dataStepShippingAndCompleteStandardQuote?.myAccount?.carrier,
    carrierTrackingNumber: dataStepShippingAndCompleteStandardQuote?.myAccount?.carrierTrackingNumber,
  };

  const renderFormTitle = useCallback(
    (title: string) => {
      return (
        <div
          style={{ opacity: !title && '0', display: !title && currentWidthScreen < 768 && 'none' }}
          className={classes.formTitle}>
          {title || '-'}
        </div>
      );
    },
    [currentWidthScreen],
  );

  const renderFormInput = useCallback(
    (title: string, formName: string, placeholder = '', hideTitle?: boolean) => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          <div className={classes.formItem}>
            {!hideTitle && renderFormTitle(title)}
            <FormikInput
              name={formName}
              className={classes.customButtonSize}
              placeholder={placeholder}
              disabled={isCompleted}
            />
          </div>
        </Col>
      );
    },
    [isCompleted, renderFormTitle],
  );

  const onSubmit = useCallback(async () => {}, []);

  return (
    <Formik
      innerRef={formRef}
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={() => FormSchema()}>
      {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormStepFourSelectTwo>) => {
        // const handleChangeValue = (data: object) => setValues({ ...values, ...data });
        return (
          <Form onSubmit={handleSubmit}>
            <Card className={classes.customCard}>
              <div className={classes.headerDescription}>
                Please enter your carrier and tracking number. This is used to verify and track your bicycle in transit.
              </div>
              <Row className={classes.customRow}>
                {renderFormInput('Carrier*', 'carrier')}
                {renderFormInput('Tracking Number*', 'carrierTrackingNumber')}
              </Row>
              <Row>
                <Col md={3}>
                  <div className={classes.formTitle}>Shipping Address</div>
                </Col>
                <Col md={9}>
                  <div className={classes.headerDescription}>
                    <div>BicycleBlueBook.com</div>
                    <div>2240 Paragon Drive</div>
                    <div>San Jose, CA 95131</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
};

export default WithMyAccount;
