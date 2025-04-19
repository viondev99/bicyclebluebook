import React, { FC, useMemo, useCallback } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { CommonComponentModel, CompModel, SelectCompModel } from 'model/store/common.model';
import camelCase from 'lodash/camelCase';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import FormEbike from './FormEbike';
import classes from './bicycle-detail-section.module.scss';

interface Props {
  types: CommonComponentModel[];
  listFilterDetailComp: CompModel[];
  formValue: FormValue;
}

const BicycleDetailSection: FC<Props> = (props) => {
  const options = useMemo(() => {
    const pickedOptions = pick(props, ['types']);
    return mapValues(pickedOptions, (arr: CommonComponentModel[]) => {
      if (!arr) {
        return [];
      }
      return arr.map((item: CommonComponentModel) => ({
        label: item.name,
        value: String(item.id),
      }));
    });
  }, [props]);

  const paseOptions = useCallback((selectCompModel: SelectCompModel[]) => {
    return selectCompModel?.map((item: SelectCompModel) => ({
      label: item.value,
      value: JSON?.stringify({
        compId: item.inventoryCompTypeId,
        value: item.value,
      }),
    }));
  }, []);

  const findOptions = useCallback(
    (nameFilter: string) => {
      if (!props?.listFilterDetailComp) {
        return [];
      }
      const detailCompWheel = props?.listFilterDetailComp.find(
        (item) => camelCase(item.name) === camelCase(nameFilter),
      );
      return paseOptions(detailCompWheel?.selects);
    },
    [paseOptions, props],
  );

  const renderFormEbike = useMemo(() => {
    return props?.formValue?.types === '21' ? <FormEbike /> : null;
  }, [props]);
  const renderSuspension = useMemo(() => {
    return props.formValue.types === '5' || props.formValue.types === '6' ? (
      <Col xs={12} md={6}>
        <div>
          <h4 className={classes.label}>Suspension*</h4>
          <FormikSelect inputId={'select-suspension'} options={findOptions('Suspension')} name={'suspensions'} />
        </div>
      </Col>
    ) : null;
  }, [findOptions, props]);

  return (
    <section className={classes.bicycleDetailSection}>
      <h3 className={classes.title}>Bicycle Details</h3>
      <Row>
        <Col xs={12} md={6}>
          <h4 className={classes.label}>Frame Material*</h4>
          <FormikSelect
            inputId={'select-frame-material'}
            options={findOptions('frameMaterial')}
            name={'frameMaterial'}
          />
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h4 className={classes.label}>Type*</h4>
            <FormikSelect inputId={'select-type'} options={options.types} name={'types'} />
          </div>
        </Col>
        <Col xs={12}>{renderFormEbike}</Col>
        <Col xs={12} md={6}>
          <h4 className={classes.label}>Gender *</h4>
          <FormikSelect inputId={'select-gender'} options={findOptions('gender')} name={'gender'} />
        </Col>
        {renderSuspension}
        <Col xs={12} md={6}>
          <h4 className={classes.label}>Brake Type *</h4>
          <FormikSelect inputId={'select-brake-type'} options={findOptions('brakeType')} name={'brakeType'} />
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h4 className={classes.label}>Wheel Size*</h4>
            <FormikSelect inputId={'select-wheel-size'} options={findOptions('wheelSize')} name={'wheelSizes'} />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <h4 className={classes.label}>Frame Size *</h4>
          <FormikSelect inputId={'select-frame-size'} options={findOptions('frameSize')} name={'frameSize'} />
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h4 className={classes.label}>Serial Number*</h4>
            <FormikInput name={'serialNumber'} />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default BicycleDetailSection;
