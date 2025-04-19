/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import React, { FC, memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect, FormikProps } from 'formik';
import StoreState from 'model/store';
import { getFamiliesByBrand, resetFamiliesByBrand } from 'store/value-guide/value-guide.action';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import useScreenDetect from 'hooks/useScreenDetect';

interface Props {
  brand: string | null;
  formik: FormikProps<any>;
  handleChangeFormik: (key: string, value: string) => void;
  isCompleted: boolean;
  isEbike?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
  isClearable?: boolean;
}

const ModelSelect: FC<Props> = (props) => {
  const {
    brand,
    isCompleted,
    isEbike,
    formik: { handleChange },
    handleChangeFormik,
    options,
    isClearable,
  } = props;
  const dispatch = useDispatch();
  const tempModels = useSelector((store: StoreState) => store.valueGuide.family.families);
  const { currentWidthScreen } = useScreenDetect();

  const modelOptions = useMemo(() => {
    if (options?.length) {
      return options;
    }
    return tempModels?.map((item) => ({
      label: item,
      value: String(item),
    }));
  }, [options, tempModels]);

  useEffect(() => {
    if (brand) {
      const body = {
        brandId: brand,
        isEbike,
      };
      if (isEbike === undefined) {
        delete body.isEbike;
      }
      dispatch(getFamiliesByBrand(body));
    } else {
      dispatch(resetFamiliesByBrand());
    }
  }, [handleChange, brand, dispatch, isEbike]);

  return (
    <FormikSelect
      inputId={'select-state'}
      options={modelOptions}
      placeholder="Select Product Family"
      selectStyles={{
        control: {
          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
        },
      }}
      name="familyName"
      isSearchable={true}
      onChangeValue={(value) => handleChangeFormik('familyName', value)}
      disabled={isCompleted}
      isClearable={isClearable}
    />
  );
};

export default connect<Omit<Props, 'formik'>>(memo(ModelSelect));
