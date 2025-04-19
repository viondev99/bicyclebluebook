import React, { FC, memo, useMemo, useEffect, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect, FormikProps } from 'formik';
import { StylesConfig } from 'react-select';

import StoreState from 'model/store';
import { getBrandsByType, resetBrandByType } from '../../../store/trade-in/trade-in.action';
import FormikSelect from '../../Formik/Select/FormikSelect';

interface Props {
  type: string | null;
  formik: FormikProps<any>;
  isClearable?: boolean;
  selectStyles?: {
    [P in keyof StylesConfig]: CSSProperties | { [key: string]: CSSProperties };
  };
}

const BrandSelect: FC<Props> = (props) => {
  const {
    type,
    formik: { handleChange },
    isClearable = true,
    selectStyles,
  } = props;
  const dispatch = useDispatch();
  const tempBrands = useSelector((store: StoreState) => store.tradeIn.brands);

  const brandOptions = useMemo(() => {
    return tempBrands.map((item) => ({
      label: item.name,
      value: String(item.id),
    }));
  }, [tempBrands]);

  useEffect(() => {
    if (type) {
      dispatch(getBrandsByType(type));
    } else {
      dispatch(resetBrandByType());
    }
  }, [handleChange, type, dispatch]);

  return (
    <FormikSelect
      selectStyles={selectStyles}
      name={'brand'}
      inputId={'select-brand-request-trade-in'}
      placeholder={'Brand'}
      selectType={'creatable'}
      isClearable={isClearable}
      options={brandOptions}
    />
  );
};

export default connect<Omit<Props, 'formik'>>(memo(BrandSelect));
