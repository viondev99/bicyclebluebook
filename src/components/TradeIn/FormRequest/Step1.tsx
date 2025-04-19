/* eslint-disable no-nested-ternary */
import React, { FC, memo, useMemo, useEffect, useCallback } from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import t from 'helpers/language';
import { addTag } from 'helpers/common.helper';
import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import useScreenDetect from 'hooks/useScreenDetect';
import { sortFilterBrand } from 'helpers/utilities.helper';
import { useListCommonComponent } from 'hooks/useListCommonComponent';
import { TradeInForm } from 'pages/trade-in/request';
import Select from '../../Formik/Select/FormikSelect';
import ModelSelect from './ModelSelect';
import classes from './form-request.module.scss';

import FormRequestButton from './FormRequestButton';

const Step1Schema = Yup.object().shape({
  make: Yup.string().required(t('common.validate.brand')).typeError(t('common.validate.brand')),
  // model: Yup.string().required(t('common.validate.model')).typeError(t('common.validate.model'))
});

interface Props {
  form: TradeInForm;
  isIgnoreStep2: boolean;
  onChangeStep: (step: number, subStep?: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
  formRef: any;
}

interface Step1Form {
  make: string | null;
  familyName: string;
}

interface LabelValue {
  label: string;
  value: string;
}

function getLabelValue(array: Array<any>, key: string, id: string): LabelValue {
  return {
    label: get(
      array.find((item) => String(item.id) === id),
      key,
      null,
    ),
    value: id,
  };
}

const Step1: FC<Props> = (props) => {
  const { form, isIgnoreStep2, onChangeStep, onChangeForm, formRef } = props;
  const { currentWidthScreen } = useScreenDetect();

  const commonComponents = useListCommonComponent(CommonComponents.AllBrandBicycle);
  const loading = useSelector((store: StoreState) => store.tradeIn.loadingCondition);

  const brandsBicycle = useMemo(() => {
    return commonComponents.allBrandBicycle ? sortFilterBrand(commonComponents.allBrandBicycle) : [];
  }, [commonComponents]);

  const initialForm: Step1Form = useMemo(() => {
    return {
      make: form?.make?.value || '',
      familyName: form?.familyName || '',
    };
  }, [form]);

  useEffect(() => {
    addTag({
      event: 'VirtualPageView',
      virtualBBBTradeInPageTitle: 'TradeInStep1',
      virtualBBBTradeInPageUrl: '/trade-in/request/step1',
    });
  }, []);

  const onSubmit = useCallback(
    (values: Step1Form) => {
      const objMake = getLabelValue(commonComponents.allBrandBicycle, 'name', values.make);
      const familyName = values.familyName || '';
      const payload = {
        make: objMake,
        familyName,
      };
      onChangeForm(payload);
      if (isIgnoreStep2) {
        onChangeStep(1, 3);
        return;
      }
      onChangeStep(1, 2);
    },
    [commonComponents.allBrandBicycle, onChangeForm, isIgnoreStep2, onChangeStep],
  );

  const handleChangeForm = useCallback(
    (fieldName: string, value: string) => {
      if (fieldName === 'make' && !value) {
        formRef.current.setFieldValue('familyName', '');
      }
      if (fieldName === 'familyName' && value) {
        onChangeForm({
          model: null,
          bicycleId: '',
          year: null,
          isIgnoreStep2: true,
        });
      } else {
        onChangeForm({
          model: null,
          bicycleId: '',
          year: null,
          isIgnoreStep2: false,
        });
      }
    },
    [formRef, onChangeForm],
  );

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialForm}
      validationSchema={Step1Schema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validateOnBlur={true}
      validateOnMount={false}>
      {({ handleSubmit, values }) => {
        return (
          <form className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.formContainer}>
              <h1 className={classes.title}>What bike are you trading in?</h1>
              <p className={classes.description}>
                Please select your bike from our database and we will give you an estimated trade in valuation.
              </p>
              <div className={classes.inputContainer}>
                <Select
                  inputId={'select-make'}
                  options={brandsBicycle}
                  placeholder={'Make'}
                  isClearable={true}
                  selectStyles={{
                    control: {
                      minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                      background: '#fff',
                    },
                  }}
                  name="make"
                  isSearchable={true}
                  onChangeValue={(value) => handleChangeForm('make', value)}
                />
              </div>
              <div className={classes.inputContainer} style={{ marginBottom: 0 }}>
                <ModelSelect
                  selectStyles={{
                    control: {
                      minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                      background: '#fff',
                    },
                  }}
                  name={`familyName`}
                  brand={values.make}
                  placeholder={'Product Family'}
                  onChangeValue={(value) => handleChangeForm('familyName', value)}
                />
              </div>
            </div>
            <FormRequestButton disabledBack={true} disabledContinue={loading} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step1);
