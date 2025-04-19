import React, { FC, useMemo } from 'react';

import { ConditionsBicycleResponse } from 'api/trade-in.api';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import YearSelect from 'components/TradeIn/FormRequest/YearSelect';
import { useListCommonComponent } from 'hooks/useListCommonComponent';
import { CommonComponents } from 'model/store/common.model';
import WrapSection from './WrapSection';
import ModelSelect from '../components/ModelSelect';
import classes from './section.module.scss';

interface Props {
  isActive: boolean;
  values: InstantPayoutRequestForm;
  setValues: (values: { bikeInfo?: ConditionsBicycleResponse; brand?: string; model?: string; year?: string }) => void;
}

const Section2: FC<Props> = ({ isActive, setValues, values }) => {
  const commonComponents = useListCommonComponent(CommonComponents.AllBrandBicycle);
  // useEffect(() => {
  //   if (values.brand && values.model && values.year) {
  //     getConditionByComponents({
  //       brand: values.brand,
  //       model: values.model,
  //       year: values.year,
  //     })
  //       .then((res: ConditionsBicycleResponse) => {
  //         setValues({ bikeInfo: res });
  //       })
  //       .catch((err) => {
  //         toastError(err);
  //       });
  //   }
  // }, [setValues, values.brand, values.model, values.year]);
  const brandsBicycle = useMemo(() => {
    return commonComponents.allBrandBicycle
      ? commonComponents.allBrandBicycle.map((item) => ({
          label: item.name,
          value: String(item.id),
        }))
      : [];
  }, [commonComponents]);
  const isStepComplete = useMemo(() => {
    if (values.brand && values.model && values.year && isActive) {
      return true;
    }
    return false;
  }, [isActive, values.brand, values.model, values.year]);
  return (
    <WrapSection title="What bike are you selling?" isActive={isActive} isComplete={isStepComplete}>
      <div className={classes.wrapSelects}>
        <div className={classes.select}>
          <FormikSelect
            inputId={'brand-select-section2'}
            name={'brand'}
            selectType={'creatable'}
            placeholder={'Make'}
            options={brandsBicycle}
            onChangeValue={(value: string) => {
              setValues({ brand: value, model: '', year: '' });
            }}
          />
        </div>
        <div className={classes.select}>
          <ModelSelect brand={values.brand} isClearable={false} />
        </div>
        <div className={classes.selectYear}>
          <YearSelect brand={values.brand} model={values.model} isClearable={false} />
        </div>
      </div>
    </WrapSection>
  );
};

export default Section2;
