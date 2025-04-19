import React, { FC, memo, useMemo, useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect, FormikProps } from 'formik';
import { StylesConfig } from 'react-select';

import StoreState from 'model/store';
import { getFamiliesByBrand, resetFamiliesByBrand } from 'store/value-guide/value-guide.action';
import { getModelsByBrand, resetModelsByBrand } from 'store/trade-in/trade-in.action';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { getBicycleByBrandModel } from 'api/trade-in.api';

interface Props {
  brand?: string | null;
  placeholder?: string;
  name?: string;
  formik: FormikProps<any>;
  isClearable?: boolean;
  selectStyles?: {
    [P in keyof StylesConfig]: CSSProperties | { [key: string]: CSSProperties };
  };
  onChangeValue?: (value: string) => void;
}

const ModelSelect: FC<Props> = (props) => {
  const {
    name,
    brand,
    placeholder,
    formik: { handleChange, setFieldValue },
    isClearable = true,
    selectStyles,
    onChangeValue,
  } = props;
  const dispatch = useDispatch();
  // const tempModels = useSelector((store: StoreState) => store.valueGuide.);
  // const tempModels = useSelector((store: StoreState) => store.valueGuide.baseComponent?.branchYearModel);
  const tempModels = useSelector((store: StoreState) => store.tradeIn.models);

  const modelOptions = useMemo(() => {
    return tempModels?.map((item) => ({
      label: item?.name,
      value: String(item.id),
    }));
  }, [tempModels]);

  useEffect(() => {
    if (brand) {
      dispatch(getModelsByBrand(brand));
    } else {
      dispatch(resetModelsByBrand());
    }
  }, [handleChange, brand, dispatch]);

  return (
    <FormikSelect
      selectStyles={selectStyles}
      name={name || 'model'}
      inputId={'select-model-request-trade-in'}
      placeholder={placeholder || 'Model'}
      isClearable={isClearable}
      options={modelOptions}
      onChangeValue={onChangeValue || (() => setFieldValue('year', '', false))}
      isSearchable={true}
    />
  );
};

export default connect<Omit<Props, 'formik'>>(memo(ModelSelect));
