/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import cx from 'classnames';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { Form, Formik, FormikProps } from 'formik';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import React, { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikInput from 'components/Formik/Input/FormikInput';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import trim from 'lodash/trim';
import t from 'helpers/language';
import { FormStepDetailSubStepOne } from '../../formDefaultValue';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-one.module.scss';

interface Props {
  formStepDetailSubStepOne: FormStepDetailSubStepOne;
  formStepDetailSubStepOneRef: any;
  setVisibleSaveStep: (value: boolean) => void;
  isCompleteCustomQuote: boolean;
}

const FormSchema = () =>
  Yup.object().shape({
    brandName: Yup.string().required(t('common.validate.make')),
    modelName: Yup.string().required(t('common.validate.modelRequired')),
    yearName: Yup.string().required(`Year is required.`),
    serialNumber: Yup.string().required(`Serial No is required.`),
    typeId: Yup.string().required(t('common.validate.type')),
    compCustomQuotes: Yup.string().required(`Frame Size is required.`),
  });

const SubStepTwo: FC<Props> = ({
  formStepDetailSubStepOneRef,
  setVisibleSaveStep,
  formStepDetailSubStepOne,
  isCompleteCustomQuote,
}) => {
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const components = useSelector((store: StoreState) => store.common.components);
  const baseComponent = useSelector((store: StoreState) => store.valueGuide.baseComponent.baseComponent);
  // const [visibleModalFirstLoadCustomQuote, setVisibleModalFirstLoadCustomQuote] = useState(true);

  const initialValues: FormStepDetailSubStepOne = {
    brandName: formStepDetailSubStepOne?.brandName || '',
    modelName: formStepDetailSubStepOne?.modelName || '',
    yearName: formStepDetailSubStepOne?.yearName || '',
    serialNumber: formStepDetailSubStepOne?.serialNumber || '',
    typeId: formStepDetailSubStepOne?.typeId || '',
    compCustomQuotes: formStepDetailSubStepOne?.compCustomQuotes || '',
  };

  const typeOptions = useMemo(() => {
    return components?.bicycleDetailComp?.types?.length
      ? components?.bicycleDetailComp?.types?.map((it) => {
          return {
            value: `${it?.id}`,
            label: it?.value,
          };
        })
      : [];
  }, [components]);

  const frameSizeOptions = useMemo(() => {
    const frameSizeComponent =
      components?.bicycleDetailComp?.comps && Array.isArray(components?.bicycleDetailComp?.comps)
        ? components?.bicycleDetailComp?.comps?.find((it) => it.id === 178)
        : null;
    return frameSizeComponent?.selects?.length
      ? frameSizeComponent?.selects?.map((item) => {
          return {
            value: item.value,
            label: item.value,
          };
        })
      : [];
  }, [components]);

  const yearOptions = useMemo(() => {
    return baseComponent?.bicycleYears?.length
      ? baseComponent?.bicycleYears
          .sort((a: any, b: any) => {
            return b.id - a.id;
          })
          ?.map((it) => {
            return {
              value: `${it?.id}`,
              label: it?.name,
            };
          })
      : [];
  }, [baseComponent]);

  const renderTitleForm = useCallback((title: string) => {
    return (
      <Col lg={4} className={classes.colTitle}>
        <div className={classes.formTitle}>{title}</div>
      </Col>
    );
  }, []);

  const handleChangeForm = useCallback(
    (name: string, value: string) => {
      switch (name) {
        case 'serialNumber': {
          formStepDetailSubStepOneRef?.current?.setFieldValue('serialNumber', value.toUpperCase());
          break;
        }
        case 'modelName': {
          if (trim(value) !== '') {
            setVisibleSaveStep(true);
            return;
          }
          setVisibleSaveStep(false);
          break;
        }
        default:
          break;
      }
    },
    [formStepDetailSubStepOneRef, setVisibleSaveStep],
  );

  const renderFormSelect = useCallback(
    (title: string, formName: string, options: { label: string; value: string }[], placeholder = '') => {
      return (
        <Row className={classes.wrapItem}>
          {renderTitleForm(title)}
          <Col lg={8}>
            <FormikSelect
              inputId={'select-state'}
              options={options}
              placeholder={placeholder}
              selectStyles={{
                control: {
                  minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                },
              }}
              name={formName}
              isSearchable={true}
              disabled={isCompleteCustomQuote}
            />
          </Col>
        </Row>
      );
    },
    [currentWidthScreen, isCompleteCustomQuote, renderTitleForm],
  );

  const renderFormInput = useCallback(
    (title: string, formName: string, placeholder = '') => {
      return (
        <Row className={classes.wrapItem}>
          {renderTitleForm(title)}
          <Col lg={8}>
            <FormikInput
              name={formName}
              className={classes.customButtonSize}
              placeholder={placeholder}
              onChange={(e) => handleChangeForm(formName, e.target.value)}
              disabled={isCompleteCustomQuote}
            />
          </Col>
        </Row>
      );
    },
    [handleChangeForm, isCompleteCustomQuote, renderTitleForm],
  );

  const gotoStandardQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/new`,
    });
  }, [router]);

  return (
    <>
      <Formik
        innerRef={formStepDetailSubStepOneRef}
        onSubmit={() => null}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={() => FormSchema()}>
        {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormStepDetailSubStepOne>) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepTwo}</div>
              <div className={classes.wrapSubStepOne}>
                <Row className={classes.customRow}>
                  <Col md={6}>
                    {renderFormInput('Make*', 'brandName', 'Enter brand')}
                    {renderFormInput('Model*', 'modelName', 'Enter Model')}
                    {renderFormSelect('Year*', 'yearName', yearOptions, 'Select year')}
                  </Col>
                  <Col md={6}>
                    {renderFormSelect('Type*', 'typeId', typeOptions, 'Select Type')}
                    {renderFormSelect('Frame Size*', 'compCustomQuotes', frameSizeOptions, 'Select Size')}
                    {renderFormInput('Serial No.*', 'serialNumber', 'Serial Number')}
                  </Col>
                </Row>
              </div>

              <div className={cx(classes.textBottomLeft, classes.my18)}>
                Bikes not listed in our database require a<span onClick={gotoStandardQuote}>custom quote.</span>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SubStepTwo;
