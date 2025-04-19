import React, { FC, memo, useMemo, useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StylesConfig } from 'react-select';

import StoreState from 'model/store';
import { getBicyclesByBrandModel, resetBicyclesByBrandModel } from '../../../store/trade-in/trade-in.action';
import FormikSelect from '../../Formik/Select/FormikSelect';

interface Props {
  brand: string | null;
  model: string | null;
  isClearable?: boolean;
  selectStyles?: {
    [P in keyof StylesConfig]: CSSProperties | { [key: string]: CSSProperties };
  };
}

const YearSelect: FC<Props> = (props) => {
  const { brand, model, isClearable = true, selectStyles } = props;
  const dispatch = useDispatch();
  const tempBicycles = useSelector((store: StoreState) => store.tradeIn.bicycles);

  const yearOptions = useMemo(() => {
    return tempBicycles
      ?.map((item) => ({
        label: item.yearName,
        value: String(item.yearId),
      }))
      ?.sort((a, b) => Number(b.value) - Number(a.value));
  }, [tempBicycles]);

  useEffect(() => {
    if (brand && model) {
      dispatch(getBicyclesByBrandModel({ brand, model }));
    } else {
      dispatch(resetBicyclesByBrandModel());
    }
  }, [brand, model, dispatch]);

  return (
    <FormikSelect
      selectStyles={selectStyles}
      inputId={'years-select-request-form'}
      name={'year'}
      placeholder={'Year'}
      selectType={'creatable'}
      isClearable={isClearable}
      options={yearOptions}
    />
  );
};

export default memo(YearSelect);
