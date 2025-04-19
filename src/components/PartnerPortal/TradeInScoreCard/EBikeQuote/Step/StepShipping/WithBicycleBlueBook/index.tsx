/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import { CalculateShippingRequest, calculateShippingRequest } from 'api/partner/scorecard.api';
import cx from 'classnames';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import { exceptionKeyInputNumber } from 'helpers/utilities.helper';
import { toastError } from 'helpers/utils.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import trim from 'lodash/trim';
import StoreState from 'model/store';
import { CalculateShippingResponse } from 'model/store/partner/scorecard.model';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getStates } from 'store/common/common.action';
import * as Yup from 'yup';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import images from '@images';
import classes from './with-bicycle-blue-book.module.scss';

const ModalOverSize = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalOverSize'),
);

interface Props {
  formStepForSelectOneRef: any;
  isCompleted: boolean;
}

export interface FormStepFourSelectOne {
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZipCode: string;
  height: string | number;
  length: string | number;
  weight: string | number;
  width: string | number;
}

const FormSchema = () =>
  Yup.object().shape({
    fromAddress: Yup.string().required(t('common.validate.addressRequired')),
    fromCity: Yup.string().required(t('common.validate.cityRequired')),
    fromState: Yup.string().required(t('common.validate.stateRequired')),
    fromZipCode: Yup.string()
      .required(t('common.validate.zipCodeRequired'))
      .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
    height: Yup.string().required(t('partnerPortal.scorecard.validate.height')),
    length: Yup.string().required(t('partnerPortal.scorecard.validate.length')),
    weight: Yup.string().required(t('partnerPortal.scorecard.validate.weight')),
    width: Yup.string().required(t('partnerPortal.scorecard.validate.width')),
  });

const WithBicycleBlueBook: FC<Props> = ({ formStepForSelectOneRef, isCompleted }) => {
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const states = useSelector((store: StoreState) => store.common.states.state);
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const detailPartner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataStepShippingAndCompleteStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepShippingAndCompleteStandardQuote,
  );

  const formRef = formStepForSelectOneRef;
  const [calculateShippingValue, setCalculateShippingValue] = useState<CalculateShippingResponse>({
    totalCharge: 0,
    carrierType: '',
  });
  const [loadingButton, setLoadingButton] = useState(false);
  const [visibleModalOverSize, setVisibleModalOverSize] = useState(false);
  const [precededOverSize, setPrecededOverSize] = useState(false);

  const initialValues: FormStepFourSelectOne = {
    fromAddress: isCompleted
      ? dataStepShippingAndCompleteStandardQuote?.blueBook?.fromAddress
      : detailPartner?.address || '',
    fromCity: isCompleted ? dataStepShippingAndCompleteStandardQuote?.blueBook?.fromCity : detailPartner?.city || '',
    fromState: isCompleted ? dataStepShippingAndCompleteStandardQuote?.blueBook?.fromState : detailPartner?.state || '',
    fromZipCode: isCompleted
      ? dataStepShippingAndCompleteStandardQuote?.blueBook?.fromZipCode
      : detailPartner?.zip_code || '',
    height: isCompleted ? dataStepShippingAndCompleteStandardQuote?.blueBook?.height : '',
    length: isCompleted ? dataStepShippingAndCompleteStandardQuote?.blueBook?.length : '',
    weight: isCompleted ? dataStepShippingAndCompleteStandardQuote?.blueBook?.weight : '',
    width: isCompleted ? dataStepShippingAndCompleteStandardQuote?.blueBook?.width : '',
  };

  useEffect(() => {
    if (!states || states?.length === 0) {
      dispatch(getStates());
    }
    if (userInfo && !detailPartner) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch]);

  const stateOptions = useMemo(() => {
    return Array.isArray(states) && states.length
      ? states.map((it) => {
          return {
            value: it.abbreviation,
            label: it.name,
          };
        })
      : [];
  }, [states]);

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

  const renderFormSelect = useCallback(
    (title: string, formName: string, placeholder = '', options: { label: string; value: string | number }[]) => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          <div className={classes.formItem}>
            {renderFormTitle(title)}
            <FormikSelect
              inputId={'select-state'}
              options={options}
              className={classes.formSize}
              placeholder={placeholder}
              name={formName}
              isSearchable={true}
              selectStyles={{
                control: {
                  minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                },
              }}
              disabled={isCompleted}
            />
          </div>
        </Col>
      );
    },
    [currentWidthScreen, isCompleted, renderFormTitle],
  );

  const checkOverSize = useCallback(() => {
    const values = formRef?.current?.values;
    const { height, length, width } = values || {};
    const UPSsize =
      (height !== '' ? Number(height) * 2 : 0) +
      (width !== '' ? Number(width) * 2 : 0) +
      (length !== '' ? Number(length) : 0);
    if (UPSsize > 130) {
      if (!precededOverSize) {
        setVisibleModalOverSize(true);
      }
    } else {
      setVisibleModalOverSize(false);
      setPrecededOverSize(false);
    }
  }, [formRef, precededOverSize]);

  const renderFormInputNumber = useCallback(
    (title: string, formName: string, suffixName?: string) => {
      return (
        <Col lg={3} xs={6} className={classes.customCol}>
          <div className={classes.formItem}>
            {renderFormTitle(title)}
            <FormikInput
              name={formName}
              inputClassName={classes.customInputNumber}
              className={classes.customButtonSize}
              renderSuffix={<span className={classes.customSuffix}>{suffixName}</span>}
              placeholder="0"
              type="number"
              maxLength={100}
              onChange={checkOverSize}
              onKeyDown={(e) => {
                if (exceptionKeyInputNumber.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheel={(e: any) => e.target.blur()}
              disabled={isCompleted}
            />
          </div>
        </Col>
      );
    },
    [checkOverSize, isCompleted, renderFormTitle],
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

  const handleProcessOverSize = useCallback(() => {
    setPrecededOverSize(true);
    setVisibleModalOverSize(false);
  }, []);

  const getDataSubmit = useCallback(() => {
    const values = formRef?.current?.values;
    const { fromAddress, fromCity, fromState, fromZipCode, height, length, weight, width } = values || {};

    const payload: CalculateShippingRequest = {
      fromAddress: fromAddress ? fromAddress.trim() : '',
      fromCity: fromCity ? fromCity.trim() : '',
      fromState: fromState ? fromState.trim() : '',
      fromZipCode: fromZipCode ? fromZipCode.trim() : '',
      height,
      length,
      weight,
      width,
    };
    if (
      trim(payload.fromAddress) !== '' &&
      trim(payload.fromCity) !== '' &&
      trim(payload.fromState) !== '' &&
      trim(payload.fromZipCode) !== '' &&
      payload.height !== '' &&
      payload.length !== '' &&
      payload.weight !== '' &&
      payload.width !== ''
    ) {
      return payload;
    }
    return null;
  }, [formRef]);

  const handleCalculateShipping = useCallback(async () => {
    const payload: CalculateShippingRequest = await getDataSubmit();
    if (payload) {
      try {
        setLoadingButton(true);
        const response: CalculateShippingResponse = await calculateShippingRequest(payload);
        setCalculateShippingValue(response);
        setLoadingButton(false);
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
      }
    }
  }, [getDataSubmit]);

  return (
    <>
      <Formik
        innerRef={formRef}
        onSubmit={handleCalculateShipping}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={() => FormSchema()}>
        {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormStepFourSelectOne>) => {
          // const handleChangeValue = (data: object) => setValues({ ...values, ...data });
          return (
            <Form onSubmit={handleSubmit}>
              <Card className={classes.customCard}>
                <div className={classes.headerDescription}>
                  Please enter your box dimensions and weight. You will then be able to generate shipping a label to
                  print out. Please disable any pop-up blockers if your label does not appear for you.
                </div>

                <div className={classes.title}>Dimensions and Weight</div>
                <Row className={classes.customRow}>
                  {renderFormInputNumber('Length*', 'length', 'in')}
                  {renderFormInputNumber('Width*', 'width', 'in')}
                  {renderFormInputNumber('Height*', 'height', 'in')}
                  {renderFormInputNumber('Weight*', 'weight', 'lbs')}
                </Row>

                <div className={classes.title}>Shipping From</div>
                <Row className={cx(classes.customRow, classes.customRowMargin)}>
                  {renderFormInput('Address*', 'fromAddress', 'Address')}
                  {renderFormSelect('', 'fromState', 'State', stateOptions)}
                </Row>
                <Row className={classes.customRow}>
                  {renderFormInput('', 'fromCity', 'City', true)}
                  {renderFormInput('', 'fromZipCode', 'Zip Code', true)}
                </Row>
                {!isCompleted && (
                  <div className={classes.wrapBottom}>
                    <Button
                      disabled={loadingButton}
                      onClick={() => formRef?.current?.handleSubmit()}
                      buttonType="warning"
                      className={classes.customButtonSize}>
                      <img className="mr-3" src={images.account.partner.icCalculatorCostWhite} alt={'calculate Icon'} />{' '}
                      Calculate Shipping
                    </Button>
                    {calculateShippingValue.totalCharge !== 0 && (
                      <div>
                        Your {calculateShippingValue.carrierType} shipping estimate is{' '}
                        <span>${calculateShippingValue.totalCharge}.</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </Form>
          );
        }}
      </Formik>
      {visibleModalOverSize && (
        <Suspense fallback={null}>
          <ModalOverSize
            isOpen={visibleModalOverSize}
            onSubmit={handleProcessOverSize}
            onClose={() => setVisibleModalOverSize(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default WithBicycleBlueBook;
