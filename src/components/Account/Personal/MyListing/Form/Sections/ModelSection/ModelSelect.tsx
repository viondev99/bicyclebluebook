import React, { FC, memo, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { connect, FormikProps, useFormikContext } from 'formik';
import { getModelsByBrand, resetModelsByBrand } from 'store/trade-in/trade-in.action';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import StoreState from 'model/store';

interface Props {
  brand: string | null;
  formik: FormikProps<any>;
  isClearable?: boolean;
}

const ModelSelect: FC<Props> = (props) => {
  const {
    brand,
    formik: { values, handleChange, setFieldValue },
    isClearable = true,
  } = props;
  const dispatch = useDispatch();
  const tempModels = useSelector((store: StoreState) => store.tradeIn.models);
  const context = useFormikContext<FormValue>();
  const { query } = useRouter();

  const modelOptions = useMemo(() => {
    return tempModels.map((item) => ({
      label: item.name,
      value: item.name,
    }));
  }, [tempModels]);

  useEffect(() => {
    if (brand) {
      dispatch(getModelsByBrand(brand));
    } else {
      dispatch(resetModelsByBrand());
    }
  }, [handleChange, brand, dispatch]);

  useEffect(() => {
    if (query?.modelId) {
      context.setFieldValue('model', tempModels.find((item) => String(item.id) === query.modelId)?.name || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tempModels]);

  return (
    <FormikSelect
      inputId={'select-model'}
      name={'model'}
      placeholder={'Select model'}
      selectType={'creatable'}
      isClearable={isClearable}
      options={modelOptions}
      onChangeValue={() => {
        if (values.year) {
          setFieldValue('year', '', false);
        }
      }}
    />
  );
};

export default connect<Omit<Props, 'formik'>>(memo(ModelSelect));
