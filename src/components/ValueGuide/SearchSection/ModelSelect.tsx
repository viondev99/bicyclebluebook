import React, { FC, memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect, FormikProps } from 'formik';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import StoreState from 'model/store';
import { getFamiliesByBrand, resetFamiliesByBrand } from 'store/value-guide/value-guide.action';
import FormikSelect from '../../Formik/Select/FormikSelect';
import classes from '../valueGuide.module.scss';

interface Props {
  brand: string | null;
  formik: FormikProps<any>;
}

const ModelSelect: FC<Props> = (props) => {
  const {
    brand,
    formik: { handleChange, values },
  } = props;
  const dispatch = useDispatch();
  const tempModels = useSelector((store: StoreState) => store.valueGuide.family.families);

  const modelOptions = useMemo(() => {
    return tempModels?.map((item) => ({
      label: item,
      value: String(item),
    }));
  }, [tempModels]);

  useEffect(() => {
    if (brand) {
      dispatch(
        getFamiliesByBrand({
          brandId: brand,
          isVGService: true,
        }),
      );
    } else {
      dispatch(resetFamiliesByBrand());
    }
  }, [handleChange, brand, dispatch]);

  return (
    <>
      {values?.brand && (
        <Row className={classes.wrapperInput}>
          <Col sm={12}>
            <div className={classes.label}>
              <h4>Product Family</h4>
            </div>
          </Col>
          <Col sm={12}>
            <FormikSelect
              inputId={'model-select-vg-search-section-2'}
              name={'model'}
              placeholder={'Select product family'}
              options={modelOptions}
              isSearchable={true}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default connect<Omit<Props, 'formik'>>(memo(ModelSelect));
