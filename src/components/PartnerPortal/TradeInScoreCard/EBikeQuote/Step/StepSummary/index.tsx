/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import FormikDatepicker from 'components/Formik/Datepicker/FormikDatepicker';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import { capitalizeFirstLetter, formatCurrency } from 'helpers/string.helper';
import { changeNameCondition, printContent } from 'helpers/utilities.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getStates } from 'store/common/common.action';
import * as Yup from 'yup';
import { verifyEmailPaypal } from 'api/common.api';
import { toastError } from 'helpers/utils.helper';
import PrintScoreCard from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/PrintScoreCard';
import { useRouter } from 'next/router';
import { ScorecardStatuses } from 'constants/scorecard';
import { checkTradeInCompleteStepRequest, CheckTradeInCompleteStepResponse } from 'api/partner/scorecard.api';
import images from '@images';
import classes from './step-summary.module.scss';
import { constTitleStep } from '../../constraint';
import { FormSummary } from '../../formDefaultValue';

interface Props {
  handleSubmitStepSummary: (isSave: boolean, values: FormSummary) => void;
  handleBackPreviousStep: () => void;
  formStepTwoRef: any;
  isCompleted: boolean;
  hideBackStepSummary: boolean;
  hideNextBackStatusDeclined: boolean;
}

const FormSchema = (isInstantPayout: boolean) =>
  Yup.object().shape({
    firstName: Yup.string()
      .required(t('common.validate.firstNameRequired'))
      .max(127, 'First Name cannot exceed 127 characters.'),
    lastName: Yup.string()
      .required(t('common.validate.lastNameRequired'))
      .max(127, 'Last Name cannot exceed 127 characters.'),
    email: Yup.string().required(t('common.validate.emailRequired')).email(t('common.validate.emailInvalid')),
    phone: Yup.string()
      .required(t('common.validate.phoneNumberRequired'))
      .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
    serial: Yup.string().required(`Serial Number is required.`),
    licenseOrPassport: Yup.string().required(`Driver’s License or Passport # is required.`),
    address: Yup.string().required(t('common.validate.addressRequired')),
    state: Yup.string().required(t('common.validate.stateRequired')),
    city: Yup.string().required(t('common.validate.cityRequired')),
    zipCode: Yup.string()
      .required(t('common.validate.zipCodeRequired'))
      .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
    employeeName: Yup.string().required(t('partnerPortal.scorecard.validate.employeeName')),
    employeeEmail: Yup.string()
      .required(t('partnerPortal.scorecard.validate.employeeEmailRequired'))
      .email(t('common.validate.emailInvalid')),
    employeeLocation: Yup.string().required(`Employee Location is required`),
    proofName: Yup.string().required(`Name is required`),
    paypalEmail: isInstantPayout && Yup.string().trim().required('PayPal email is required.'),
    confirmEmail:
      isInstantPayout &&
      Yup.string()
        .trim()
        .required('Confirm email is required.')
        .oneOf([Yup.ref('paypalEmail'), ''], 'Paypal email addresses that you entered, do not match.'),
  });

const StepSummary: FC<Props> = ({
  handleSubmitStepSummary,
  handleBackPreviousStep,
  formStepTwoRef,
  isCompleted,
  hideBackStepSummary,
  hideNextBackStatusDeclined,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const states = useSelector((store: StoreState) => store.common.states.state);
  const router = useRouter();
  const { detailScoreCard, detailPartner } = useSelector((store: StoreState) => ({
    detailPartner: store.partner.account.detailPartnerLocation,
    detailScoreCard: store.partner.scorecard.dataStepSummaryStandardQuote,
  }));
  const [isEnableButtonEdit, setIsEnableButtonEdit] = useState(false);
  const [isVerifyPayPal, setIsVerifyPayPal] = useState(null);
  const { listDataStepEbikeQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  const dataStepSummary = useMemo(() => {
    return listDataStepEbikeQuote[indexScorecardSelected]?.dataStepSummary;
  }, [indexScorecardSelected, listDataStepEbikeQuote]);

  const initialValues: FormSummary = useMemo(() => {
    return {
      firstName: detailScoreCard?.owner?.firstName || dataStepSummary?.firstName,
      lastName: detailScoreCard?.owner?.lastName || dataStepSummary?.lastName,
      email: detailScoreCard?.owner?.email || dataStepSummary?.email,
      phone: detailScoreCard?.owner?.phone || dataStepSummary?.phone,
      serial: detailScoreCard?.owner?.serial || dataStepSummary?.serial,
      licenseOrPassport: detailScoreCard?.owner?.licenseOrPassport || dataStepSummary?.licenseOrPassport,
      address: detailScoreCard?.owner?.address || dataStepSummary?.address,
      state: detailScoreCard?.owner?.state || dataStepSummary?.state,
      city: detailScoreCard?.owner?.city || dataStepSummary?.city,
      zipCode: detailScoreCard?.owner?.zipCode || dataStepSummary?.zipCode,
      employeeName:
        detailScoreCard?.employeeName ||
        (detailPartner?.name ? detailPartner?.name : '') ||
        dataStepSummary?.employeeName,
      employeeEmail:
        detailScoreCard?.employeeEmail ||
        (detailPartner?.email ? detailPartner?.email : '') ||
        dataStepSummary?.employeeEmail,
      employeeLocation:
        detailScoreCard?.employeeLocation ||
        (detailPartner?.city ? String(detailPartner?.city) : '') ||
        dataStepSummary?.employeeLocation,
      proofName: detailScoreCard?.owner?.name || dataStepSummary?.proofName,
      proofDate: detailScoreCard?.proof?.date
        ? new Date(detailScoreCard?.proof?.date)
        : dataStepSummary
        ? new Date(dataStepSummary?.proofDate)
        : new Date(),
      paypalEmail: detailScoreCard?.paypalEmail || detailScoreCard?.owner?.paypalEmail || '',
      confirmEmail: detailScoreCard?.confirmEmail || detailScoreCard?.owner?.confirmEmail || '',
    };
  }, [dataStepSummary, detailPartner, detailScoreCard]);

  const [dataPrint, setDataPrint] = useState(initialValues);

  const checkUncreateScorecard = useMemo(() => {
    const findUncreateScorecard = listDataStepEbikeQuote.find(
      (it) => !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1),
    );
    return !!findUncreateScorecard;
  }, [listDataStepEbikeQuote]);

  const frameSize = useMemo(() => {
    return detailScoreCard?.tradeInComponents?.length > 0 &&
      detailScoreCard.tradeInComponents.filter((item) => item.id.inventoryCompTypeId === 178).length > 0
      ? detailScoreCard.tradeInComponents.filter((item) => item.id.inventoryCompTypeId === 178)[0].value
      : '';
  }, [detailScoreCard]);

  const drivetrain = useMemo(() => {
    return detailScoreCard?.upgradeComps?.length
      ? detailScoreCard?.upgradeComps?.some((it) => it.id === 4)
        ? 'Downgraded'
        : 'Upgraded'
      : 'None';
  }, [detailScoreCard]);

  const wheels = useMemo(() => {
    return detailScoreCard?.upgradeComps?.length
      ? detailScoreCard?.upgradeComps?.some((it) => it.id === 3)
        ? 'Downgraded'
        : 'Upgraded'
      : 'None';
  }, [detailScoreCard]);

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

  useEffect(() => {
    if (!states || states?.length === 0) {
      dispatch(getStates());
    }
  }, [dispatch]);

  const handleCheckTradeInCompleteStepRequest = useCallback(() => {
    if (router?.query?.id) {
      const checkTradeInComplete = async () => {
        const res: CheckTradeInCompleteStepResponse = await checkTradeInCompleteStepRequest(`${router?.query?.id}`);

        if (ScorecardStatuses.QUOTE === res.status) {
          setIsEnableButtonEdit(true);
        }
      };
      checkTradeInComplete;
    }
  }, [router]);

  useEffect(() => {
    handleCheckTradeInCompleteStepRequest();
  }, [handleCheckTradeInCompleteStepRequest]);

  const renderBicycleItem = useCallback((title: string, value?: string | number) => {
    return (
      <div className={classes.wrapBicycleInfoItem}>
        <div className={cx(classes.textGrey, classes.mb9, classes.mobileItemTitle)}>{title}</div>
        <div className={cx(classes.textBlack, classes.mobileItemValue)}>{value}</div>
      </div>
    );
  }, []);

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

  const handleChange = useCallback(
    (value: string, formName: string) => {
      switch (formName) {
        case 'serial': {
          formStepTwoRef.current?.setFieldValue('serial', value.toUpperCase());
          break;
        }
        case 'firstName': {
          formStepTwoRef.current?.setFieldValue('proofName', `${value} ${formStepTwoRef?.current?.values?.lastName}`);
          break;
        }
        case 'lastName':
          formStepTwoRef.current?.setFieldValue('proofName', `${formStepTwoRef?.current?.values?.firstName} ${value}`);
          break;

        default:
          formStepTwoRef.current?.setFieldValue(formName, value);
          break;
      }
    },
    [formStepTwoRef],
  );

  const renderFormInput = useCallback(
    (title: string, formName: string, placeholder = '', hideTitle?: boolean, isInputPhone?: boolean) => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          <div className={classes.formItem}>
            {!hideTitle && renderFormTitle(title)}
            {isInputPhone ? (
              <FormikTextMask
                name={formName}
                typeMask="phone"
                placeholder={placeholder}
                className={classes.customButtonSize}
                disabled={isCompleted}
              />
            ) : (
              <FormikInput
                name={formName}
                className={classes.customButtonSize}
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value, formName)}
                disabled={isCompleted || formName === 'proofName'}
              />
            )}
          </div>
        </Col>
      );
    },
    [handleChange, isCompleted, renderFormTitle],
  );

  const renderFormDate = useCallback(
    (title: string, formName: string) => {
      return (
        <Col lg={4} md={6} className={classes.customCol}>
          <div className={classes.formItem}>
            {renderFormTitle(title)}
            <FormikDatepicker
              name={formName}
              className={cx(classes.customButtonSize, classes.colorDatepicker)}
              inputClassName={classes.colorDatepicker}
              disabled
            />
          </div>
        </Col>
      );
    },
    [renderFormTitle],
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
              onChangeValue={(value) => {
                handleChange(value, formName);
              }}
            />
          </div>
        </Col>
      );
    },
    [currentWidthScreen, handleChange, isCompleted, renderFormTitle],
  );

  const onSubmit = useCallback(
    (values: FormSummary) => {
      if (!isVerifyPayPal && detailScoreCard?.isInstantPayout) {
        return toastError(`You need to verify PayPal email first.`);
      }

      handleSubmitStepSummary(false, values);
    },
    [detailScoreCard, handleSubmitStepSummary, isVerifyPayPal],
  );

  const handleVerifyEmailPaypal = useCallback(async (paypalEmail: string) => {
    try {
      if (!paypalEmail || paypalEmail?.trim() === '') {
        return toastError(`PayPal email is required.`);
      }
      const response: any = await verifyEmailPaypal(paypalEmail);
      if (!response || response?.accountValid === false) {
        toastError(response?.message);
        setIsVerifyPayPal(false);
        return;
      }
      setIsVerifyPayPal(true);
    } catch (error) {
      toastError(error);
      setIsVerifyPayPal(false);
    }
  }, []);

  const printScoreCard = useCallback(async () => {
    await setDataPrint(formStepTwoRef?.current?.values);
    const target = document.getElementById('PrintScoreCard');
    if (target) {
      printContent(target.innerHTML);
    }
  }, [formStepTwoRef]);

  const navigateStepOne = useCallback(
    (subStepFour?: boolean) => {
      if (subStepFour) {
        return router.push({
          pathname: `/trade-in-account/trade-in/${router?.query?.id}`,
          query: { step: 1, editStepDetailOfQuote: true, subStepFour: true },
        });
      }
      router.push({
        pathname: `/trade-in-account/trade-in/${router?.query?.id}`,
        query: { step: 1, editStepDetailOfQuote: true },
      });
    },
    [router],
  );
  return (
    <>
      <Formik
        innerRef={formStepTwoRef}
        onSubmit={onSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        blurInputOnSelect={false}
        validationSchema={() => FormSchema(detailScoreCard?.isInstantPayout)}>
        {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormSummary>) => {
          // const handleChangeValue = (data: object) => setValues({ ...values, ...data });
          return (
            <Form onSubmit={handleSubmit}>
              <div className={classes.wrapStepTwo}>
                <div className={classes.wrapTradeInValue}>
                  <div className={classes.header}>
                    {detailScoreCard?.isInstantPayout
                      ? constTitleStep.StepOneSubStepSixInstantPayout
                      : constTitleStep.StepOneSubStepSix}
                  </div>
                  <div className={classes.tradeInValue}>
                    {detailScoreCard?.tradeValue
                      ? detailScoreCard?.isInstantPayout
                        ? formatCurrency(Number(detailScoreCard?.payoutAmount)) ||
                          formatCurrency(0.9 * Number(detailScoreCard?.tradeValue))
                        : formatCurrency(Number(detailScoreCard?.tradeValue))
                      : `$0`}
                  </div>
                </div>
                <div className={classes.wrapForm}>
                  <div>
                    <div className={classes.title}>
                      <span>Bike Details</span>
                      {isEnableButtonEdit ? (
                        <Button
                          buttonType={'clear'}
                          buttonSize={'l'}
                          className={classes.buttonEdit}
                          onClick={() => navigateStepOne()}>
                          Edit
                        </Button>
                      ) : null}
                    </div>
                    <div className={classes.wrapBicycleInfo}>
                      {renderBicycleItem(
                        'Brand',
                        capitalizeFirstLetter(detailScoreCard?.bicycleBaseInfo?.bicycleBrandName || ''),
                      )}
                      {renderBicycleItem('Model', detailScoreCard?.bicycleBaseInfo?.bicycleModelName || '')}
                      {renderBicycleItem('Year', detailScoreCard?.bicycleBaseInfo?.bicycleYearId)}
                      {renderBicycleItem('Condition', changeNameCondition(detailScoreCard?.condition))}
                    </div>

                    <hr className={classes.customHr} />

                    <div>
                      <div className={classes.title}>
                        <span>Component Specs and Modifications</span>
                        {isEnableButtonEdit ? (
                          <Button
                            buttonType={'clear'}
                            buttonSize={'l'}
                            className={classes.buttonEdit}
                            onClick={() => navigateStepOne(true)}>
                            Edit
                          </Button>
                        ) : null}
                      </div>
                      <div className={classes.wrapBicycleInfo}>
                        {renderBicycleItem('Frame Size', frameSize)}
                        {renderBicycleItem('Drivetrain', drivetrain)}
                        {renderBicycleItem('Wheels', wheels)}
                      </div>
                    </div>

                    <hr className={classes.customHr} />

                    <div>
                      <div className={classes.title}>Owner Details</div>
                      <Row className={classes.customRow}>
                        {renderFormInput('First Name*', 'firstName')}
                        {renderFormInput('Last Name*', 'lastName')}
                        {renderFormInput('Email*', 'email')}
                        {renderFormInput('Phone Number*', 'phone', '', false, true)}
                        {renderFormInput('Serial Number*', 'serial')}
                        {renderFormInput('Driver’s License or Passport #*', 'licenseOrPassport')}
                      </Row>
                      {detailScoreCard?.isInstantPayout && (
                        <Row className={classes.customRow}>
                          {renderFormInput('PayPal email*', 'paypalEmail')}
                          {renderFormInput('Confirm PayPal email*', 'confirmEmail')}
                          <Col lg={4} md={6} className={classes.customCol}>
                            <div className={classes.formItem}>
                              {currentWidthScreen > 991 && renderFormTitle(null)}
                              <div className={classes.imgButtonVerifyPaypal}>
                                <Button
                                  onClick={() => handleVerifyEmailPaypal(values.paypalEmail)}
                                  className={classes.customButtonSize}>
                                  VERIFY
                                </Button>
                                {isVerifyPayPal === true ? (
                                  <img src={images.checkout.iconPaypalVerified} alt="iconPaypalVerified" />
                                ) : isVerifyPayPal === false ? (
                                  <img src={images.checkout.iconPaypalInvalid} alt="iconPaypalInvalid" />
                                ) : null}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
                      <Row className={classes.customRow} style={{ marginBottom: '0' }}>
                        {renderFormInput('Address*', 'address', 'Address')}
                        {renderFormSelect('', 'state', 'State', stateOptions)}
                      </Row>
                      <Row className={classes.customRow}>
                        {renderFormInput('', 'city', 'City', true)}
                        {renderFormInput('', 'zipCode', 'Zip Code', true)}
                      </Row>
                    </div>

                    <hr className={classes.customHr} />

                    <div>
                      <div className={classes.title}>Shop Details</div>
                      <Row className={classes.customRow}>
                        {renderFormInput('Employee Name*', 'employeeName')}
                        {renderFormInput('Employee Email*', 'employeeEmail')}
                        {renderFormInput('Shop Location*', 'employeeLocation')}
                      </Row>
                    </div>

                    <hr className={classes.customHr} />

                    <div>
                      <div className={classes.note}>
                        Under penalty of perjury, I attest I am the owner of the property listed on this report.
                      </div>
                      <Row className={classes.customRow}>
                        {renderFormInput('Name*', 'proofName')}
                        {renderFormDate('Date', 'proofDate')}
                      </Row>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={printScoreCard}
                  className={cx(classes.btnPrintReport, classes.customButtonSize, classes.btnMobile)}
                  buttonType="outline">
                  <div>
                    <img src={images.account.order.icPrintGrey} alt={'Print Icon'} />
                    <span>Print Report</span>
                  </div>
                </Button>

                {!hideNextBackStatusDeclined && (
                  <>
                    <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
                      {!hideBackStepSummary && (
                        <Button
                          buttonType="outline"
                          onClick={handleBackPreviousStep}
                          className={cx(classes.btnBack, classes.customButtonSize)}>
                          <img src={images.messages.icArrowLeftGrey} alt="icon_next" className="mr-4" />
                          Back
                        </Button>
                      )}
                      <Button type="submit" className={classes.customButtonSize}>
                        {checkUncreateScorecard ? 'Next Scorecard' : 'Continue'}{' '}
                        <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
                      </Button>
                    </div>
                    <div className={classes.wrapButtonSupportFixed} />
                  </>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
      <PrintScoreCard dataFormStepSummary={dataPrint} />
    </>
  );
};

export default StepSummary;
