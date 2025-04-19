/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { Form, Formik, FormikProps } from 'formik';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikInput from 'components/Formik/Input/FormikInput';
import * as Yup from 'yup';
import trim from 'lodash/trim';
import t from 'helpers/language';
import { FormStepDetailSubStepTwo } from '../../formDefaultValue';
import { constTitleStepCustomQuote } from '../../constraint';
import classes from './sub-step-two.module.scss';

const ModalFillShifter = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalFillShifter'),
);

interface Props {
  formStepDetailSubStepTwoRef: any;
  formStepDetailSubStepTwo: FormStepDetailSubStepTwo;
  isCompleteCustomQuote: boolean;
}

const FormSchema = () =>
  Yup.object().shape({
    frameMaterial: Yup.string().required(t('common.validate.frameMaterial')),
    brakeType: Yup.string().required(t('partnerPortal.scorecard.validate.brakeType')),
    shifters: Yup.string().required(`Shifters is required.`),
    frontBrake: Yup.string().required(t('partnerPortal.scorecard.validate.frontBrake')),
    frontDerailleur: Yup.string().required(t('partnerPortal.scorecard.validate.frontDerailleur')),
    rearBrake: Yup.string().required(t('partnerPortal.scorecard.validate.rearBreak')),
    rearDerailleur: Yup.string().required(t('partnerPortal.scorecard.validate.RearDerailleur')),
    crankset: Yup.string().required(t('partnerPortal.scorecard.validate.crankset')),
    handlebars: Yup.string().required(`Handlebars is required.`),
    stem: Yup.string().required(t('partnerPortal.scorecard.validate.stem')),
    casette: Yup.string().required(`Casette is required.`),
    wheels: Yup.string().required(t('partnerPortal.scorecard.validate.wheels')),
  });

const SubStepTwo: FC<Props> = ({ formStepDetailSubStepTwoRef, formStepDetailSubStepTwo, isCompleteCustomQuote }) => {
  const { currentWidthScreen } = useScreenDetect();
  const components = useSelector((store: StoreState) => store.common.components);
  const [visibleModalFillShifter, setVisibleModalFillShifter] = useState<boolean>(false);
  const [shifterValue, setShifterValue] = useState('');

  const initialValues: FormStepDetailSubStepTwo = {
    frameMaterial: formStepDetailSubStepTwo?.frameMaterial || '',
    brakeType: formStepDetailSubStepTwo?.brakeType || '',
    shifters: formStepDetailSubStepTwo?.shifters || '',
    frontBrake: formStepDetailSubStepTwo?.frontBrake || '',
    frontDerailleur: formStepDetailSubStepTwo?.frontDerailleur || '',
    rearBrake: formStepDetailSubStepTwo?.rearBrake || '',
    rearDerailleur: formStepDetailSubStepTwo?.rearDerailleur || '',
    crankset: formStepDetailSubStepTwo?.crankset || '',
    handlebars: formStepDetailSubStepTwo?.handlebars || '',
    frontShock: formStepDetailSubStepTwo?.frontShock || '',
    stem: formStepDetailSubStepTwo?.stem || '',
    rearShock: formStepDetailSubStepTwo?.rearShock || '',
    casette: formStepDetailSubStepTwo?.casette || '',
    wheels: formStepDetailSubStepTwo?.wheels || '',
  };

  const frameMaterialOptions = useMemo(() => {
    const dataFind: any = components?.componentCustomQuote?.find((it) => it.id === 11);
    if (dataFind) {
      return dataFind?.selects?.length
        ? dataFind?.selects?.map((it: { id: number; value: string }) => {
            return {
              value: it?.value,
              label: it?.value,
            };
          })
        : [];
    }
    return [];
  }, [components]);

  const brakeTypeOptions = useMemo(() => {
    const dataFind: any = components?.componentCustomQuote?.find((it) => it.id === 180);
    if (dataFind) {
      return dataFind?.selects?.length
        ? dataFind?.selects?.map((it: { id: number; value: string }) => {
            return {
              value: it?.value,
              label: it?.value,
            };
          })
        : [];
    }
    return [];
  }, [components]);

  const renderTitleForm = useCallback((title: string) => {
    return <div className={classes.formTitle}>{title}</div>;
  }, []);

  const handleOnBlur = useCallback((name: string, value: string) => {
    switch (name) {
      case 'shifters': {
        if (trim(value) !== '') {
          setVisibleModalFillShifter(true);
          setShifterValue(value);
        }
        break;
      }
      default:
        break;
    }
  }, []);

  const handleFillShifterInfo = useCallback(() => {
    formStepDetailSubStepTwoRef?.current?.setValues({
      ...formStepDetailSubStepTwoRef?.current?.values,
      frontBrake: shifterValue,
      frontDerailleur: shifterValue,
      rearBrake: shifterValue,
      rearDerailleur: shifterValue,
      crankset: shifterValue,
      casette: shifterValue,
    });
    setVisibleModalFillShifter(false);
  }, [formStepDetailSubStepTwoRef, shifterValue]);

  const renderFormSelect = useCallback(
    (title: string, formName: string, options: { label: string; value: string }[], placeholder = '') => {
      return (
        <div className={classes.wrapItem}>
          {renderTitleForm(title)}
          <FormikSelect
            inputId={'select-state'}
            options={options}
            placeholder={`Select ${title.replace('*', '')}`}
            selectStyles={{
              control: {
                minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
              },
            }}
            name={formName}
            isSearchable={true}
            disabled={isCompleteCustomQuote}
          />
        </div>
      );
    },
    [currentWidthScreen, isCompleteCustomQuote, renderTitleForm],
  );

  const renderFormInput = useCallback(
    (title: string, formName: string, placeholder = '') => {
      return (
        <div className={classes.wrapItem}>
          {renderTitleForm(title)}
          <FormikInput
            name={formName}
            className={classes.customButtonSize}
            placeholder={`Enter ${title.replace('*', '')}`}
            onBlur={(e) => handleOnBlur(formName, e.target.value)}
            disabled={isCompleteCustomQuote}
            maxLength={255}
          />
        </div>
      );
    },
    [handleOnBlur, isCompleteCustomQuote, renderTitleForm],
  );

  return (
    <>
      <Formik
        innerRef={formStepDetailSubStepTwoRef}
        onSubmit={() => null}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={() => FormSchema()}>
        {({ handleSubmit }: FormikProps<FormStepDetailSubStepTwo>) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className={classes.headerStep}>{constTitleStepCustomQuote.StepOneSubStepTwo}</div>
              <div className={classes.wrapSubStepTwo}>
                <Row className={classes.customRow}>
                  <Col md={6}>
                    {renderFormSelect('Frame Material*', 'frameMaterial', frameMaterialOptions, '')}
                    {renderFormInput('Shifters*', 'shifters', '')}
                    {renderFormInput('Front Derailleur.*', 'frontDerailleur', '')}
                    {renderFormInput('Rear Derailleur*', 'rearDerailleur', '')}
                    {renderFormInput('Handlebars*', 'handlebars', '')}
                    {renderFormInput('Stem*', 'stem', '')}
                    {renderFormInput('Casette*', 'casette', '')}
                  </Col>
                  <Col md={6}>
                    {renderFormSelect('Brake Type*', 'brakeType', brakeTypeOptions, '')}
                    {renderFormInput('Front Brake*', 'frontBrake', '')}
                    {renderFormInput('Rear Brake*', 'rearBrake', '')}
                    {renderFormInput('Crankset*', 'crankset', '')}
                    {renderFormInput('Front Shock', 'frontShock', '')}
                    {renderFormInput('Rear Shock', 'rearShock', '')}
                    {renderFormInput('Wheels*', 'wheels', '')}
                  </Col>
                </Row>
              </div>
            </Form>
          );
        }}
      </Formik>

      <div className={classes.wrapBottom} />

      {visibleModalFillShifter && (
        <Suspense fallback={null}>
          <ModalFillShifter
            isOpen={visibleModalFillShifter}
            onClose={() => setVisibleModalFillShifter(false)}
            onSubmit={handleFillShifterInfo}
            shifterValue={shifterValue}
          />
        </Suspense>
      )}
    </>
  );
};

export default SubStepTwo;
