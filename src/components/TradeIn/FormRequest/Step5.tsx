import React, { FC, memo, useMemo, useEffect, useCallback } from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { addTag } from 'helpers/common.helper';
import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import Button from '@ui/Buttons/Primary/Button';
import { TradeInForm } from 'pages/trade-in/request';
import Select from '../../Formik/Select/FormikSelect';
import BrandSelect from './BrandSelect';
import { useListCommonComponent } from '../../../hooks/useListCommonComponent';
import classes from './form-request.module.scss';

import FormRequestButton from './FormRequestButton';

interface Props {
  form: TradeInForm;
  onChangeStep: (step: number, subStep?: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
}

interface Step3Form {
  type: string | null;
  brand: string | null;
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

const Step5: FC<Props> = (props) => {
  const { form, onChangeStep, onChangeForm } = props;
  const commonComponents = useListCommonComponent(CommonComponents.BicycleType);
  const brands = useSelector((store: StoreState) => store.tradeIn.brands);

  const typesBicycle = useMemo(() => {
    return commonComponents.type
      ? commonComponents.type.map((item) => ({
          label: item.name,
          value: String(item.id),
        }))
      : [];
  }, [commonComponents]);

  const initialForm: Step3Form = useMemo(() => {
    return {
      type: get(form.type, 'value', ''),
      brand: get(form.brand, 'value', ''),
    };
  }, [form]);

  useEffect(() => {
    addTag({
      event: 'VirtualPageView',
      virtualBBBTradeInPageTitle: 'TradeInStep3',
      virtualBBBTradeInPageUrl: '/trade-in/request/step3',
    });
  }, []);

  const onSkip = useCallback(() => {
    const payload: Partial<TradeInForm> = {
      type: null,
      brand: null,
    };
    onChangeStep(4);
    onChangeForm(payload);
  }, [onChangeStep, onChangeForm]);

  const onSubmit = useCallback(
    (values: Step3Form) => {
      const payload = {
        type: getLabelValue(commonComponents.type, 'name', values.type),
        brand: getLabelValue(brands, 'name', values.brand),
      };
      onChangeStep(4);
      onChangeForm(payload);
    },
    [commonComponents.type, brands, onChangeStep, onChangeForm],
  );

  return (
    <Formik
      initialValues={initialForm}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validateOnBlur={true}
      validateOnMount={false}>
      {({ handleSubmit, values, setFieldValue }) => {
        return (
          <form className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.formContainer}>
              <h1 className={classes.title}>What new bike do you want?</h1>
              <p className={classes.description}>
                Tell us what bike you want to trade for. This will help us find the best trade in partner for you.
              </p>
              <div className={classes.inputContainer}>
                <Select
                  selectStyles={{
                    control: {
                      background: '#fff',
                    },
                  }}
                  inputId={'select-type'}
                  name={'type'}
                  placeholder={'Bike Type'}
                  selectType={'creatable'}
                  isClearable={true}
                  options={typesBicycle}
                  onChangeValue={() => {
                    setFieldValue('brand', '', false);
                  }}
                />
              </div>
              <div className={classes.inputContainer}>
                <BrandSelect
                  selectStyles={{
                    control: {
                      background: '#fff',
                    },
                  }}
                  type={values.type}
                />
              </div>
              <div className={classes.skipContent}>
                Not sure yet?
                <Button
                  className={classes.skipButton}
                  buttonSize={'s'}
                  buttonType={'clear'}
                  type="button"
                  onClick={onSkip}>
                  Skip this step
                </Button>
                and shop in store.
              </div>
            </div>
            <FormRequestButton disabledBack={false} disabledContinue={false} onClickBack={() => onChangeStep(2, 2)} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step5);
