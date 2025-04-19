import React, { FC, useCallback, useState } from 'react';
import MobileFullScreenModal, { Props as ModalProps } from '@ui/Modal/MobileFullScreenModal';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikInput from 'components/Formik/Input/FormikInput';
import Divider from '@ui/Divider';
import { Form, Formik, FormikProps } from 'formik';
import Button from '@ui/Buttons/Primary/Button';
import * as Yup from 'yup';
import t from 'helpers/language';
import { CalculateShipmentFee, calculateShipmentFee, CalculateShipmentFeeRequest } from 'api/shipment.api';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import { getMessageFromError } from 'helpers/common.helper';
import { toastError } from 'helpers/utils.helper';
import cx from 'classnames';
import classes from './shipping-calculator-modal.module.scss';

const CalculateSchema = Yup.object().shape({
  length: Yup.number().nullable().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  width: Yup.number().nullable().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  height: Yup.number().nullable().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  weight: Yup.number().nullable().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  destination: Yup.string()
    .notRequired()
    .typeError(t('common.validate.zipCodeRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
});

interface Form {
  length: number;
  width: number;
  height: number;
  weight: number;
  destination?: string;
}

interface Props {
  formValue: FormValue;
  setValues: (values: { length: string; width: string; weight: string; height: string }) => void;
}

const ShippingCalculatorModal: FC<Pick<ModalProps, 'onClose' | 'isOpen'> & Props> = ({
  onClose,
  isOpen,
  formValue,
  setValues,
}) => {
  const initValue: Form = {
    length: null,
    width: null,
    height: null,
    weight: null,
    destination: formValue.zipCode,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<CalculateShipmentFee[]>(null);
  const handleFormSubmit = useCallback(
    async (values: Form) => {
      setLoading(true);
      let params: CalculateShipmentFeeRequest = {
        length: String(values.length),
        width: String(values.width),
        height: String(values.height),
        weight: String(values.weight),
        fromCountryCode: formValue.countryCode,
        fromStateCode: formValue.state,
        fromCity: formValue.city,
        fromZipCode: formValue.zipCode,
        fromLine: formValue.addressLine,
      };
      if (values.destination) {
        params = {
          ...params,
          toCountryCode: 'US',
          toZipCode: values.destination,
        };
      }
      try {
        const res = await calculateShipmentFee(params);
        setResponse(res);
        setLoading(false);
        setValues({
          length: String(values.length),
          width: String(values.width),
          height: String(values.height),
          weight: String(values.weight),
        });
      } catch (error) {
        toastError(getMessageFromError(error));
        setLoading(false);
      }
    },
    [formValue.addressLine, formValue.city, formValue.countryCode, formValue.state, formValue.zipCode, setValues],
  );

  return (
    <MobileFullScreenModal onClose={onClose} isOpen={isOpen} title={'Shipping Calculator'}>
      <Formik initialValues={initValue} onSubmit={handleFormSubmit} validationSchema={CalculateSchema}>
        {({ handleSubmit }: FormikProps<Form>) => (
          <Form onSubmit={handleSubmit}>
            <p className={classes.description}>Your bike will ship by UPS Ground (1 to 5 business days).</p>
            <h3 className={classes.title}>Package Weight & Dimensions</h3>
            <Row>
              <Col xs={6} md={3}>
                <h4>Length</h4>
                <FormikInput
                  type={'number'}
                  name={'length'}
                  placeholder="0"
                  renderSuffix={<span className={classes.suffix}>in</span>}
                />
              </Col>
              <Col xs={6} md={3}>
                <h4>Width</h4>
                <FormikInput
                  type={'number'}
                  placeholder="0"
                  name={'width'}
                  renderSuffix={<span className={classes.suffix}>in</span>}
                />
              </Col>
              <Col xs={6} md={3}>
                <h4>Height</h4>
                <FormikInput
                  type={'number'}
                  name={'height'}
                  placeholder="0"
                  renderSuffix={<span className={classes.suffix}>in</span>}
                />
              </Col>
              <Col xs={6} md={3}>
                <h4>Weight</h4>
                <FormikInput
                  type={'number'}
                  name={'weight'}
                  placeholder="0"
                  renderSuffix={<span className={classes.suffix}>lbs</span>}
                />
              </Col>
            </Row>
            <Divider className={classes.divider} />
            <div className={classes.destination}>
              <h4>Destination (optional)</h4>
              <FormikInput name={'destination'} className={classes.input} placeholder={'Zip Code'} />
            </div>
            <div className={cx('d-flex align-items-center', classes.footer)}>
              <Button type="submit" disabled={loading}>
                Calculate
              </Button>
              {response && (
                <div className={'ml-4'}>
                  <h4>
                    Your UPS shipping estimate is <span className={classes.price}>{response[0].totalCharge}.</span>
                  </h4>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </MobileFullScreenModal>
  );
};

export default ShippingCalculatorModal;
