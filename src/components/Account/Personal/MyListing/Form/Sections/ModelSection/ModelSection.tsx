import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { CommonComponentModel } from 'model/store/common.model';
import { useFormikContext } from 'formik';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import classes from './model-section.module.scss';
import ModelSelect from './ModelSelect';

interface Props {
  brands: CommonComponentModel[];
  years: CommonComponentModel[];
  formValue: FormValue;
  // setValues: (values: { brand?: string; model?: string; year?: string }) => any;
}

const ModelSection: FC<Props> = ({ years, brands, formValue }) => {
  const { query } = useRouter();
  const context = useFormikContext<FormValue>();

  const brandsBicycle = useMemo(() => {
    return brands
      ? brands.map((item) => ({
          label: item.name,
          value: item.name,
        }))
      : [];
  }, [brands]);

  useEffect(() => {
    if (query?.brandId) {
      context.setFieldValue('brand', brands.find((item) => String(item.id) === query.brandId)?.name || '', false);
    }
    if (query?.yearId) {
      context.setFieldValue('year', years.find((item) => String(item.id) === query.yearId)?.name || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, brands, years]);

  const yearOptions = useMemo(() => {
    return years
      ? years
          .map((item) => {
            return {
              label: item.name,
              value: item.name,
            };
          })
          ?.sort((a, b) => Number(b.value) - Number(a.value))
      : [];
  }, [years]);
  const findIdBrand = useCallback(
    (brandName: string) => {
      if (!brandName && brands) {
        return '';
      }
      return brands?.find((item) => item.name === brandName)?.id;
    },
    [brands],
  );
  return (
    <section className={classes.modelSection}>
      <Row>
        <Col xs={12} md={4}>
          <h3 className={classes.label}>Brand</h3>
          <FormikSelect
            inputId={'select-brand'}
            name={'brand'}
            selectType={'creatable'}
            placeholder="Select brand"
            options={brandsBicycle}
            onChangeValue={() => {
              if (context.values.model) {
                context.setFieldValue('model', '', false);
              }
              if (context.values.model) {
                context.setFieldValue('year', '', false);
              }
            }}
          />
        </Col>
        <Col xs={12} md={4}>
          <h3 className={classes.label}>Model</h3>
          <ModelSelect brand={String(findIdBrand(formValue.brand))} isClearable={false} />
        </Col>
        <Col xs={12} md={4} className={classes.year}>
          <h3 className={classes.label}>Year</h3>
          <FormikSelect
            inputId={'select-year'}
            name={'year'}
            selectType={'creatable'}
            placeholder="Select year"
            options={yearOptions}
          />
        </Col>
      </Row>
    </section>
  );
};
export default ModelSection;
