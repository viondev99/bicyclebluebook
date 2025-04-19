import React from 'react';
import cx from 'classnames';
import classes from 'components/Register/RegisterPersonal/Form/form.module.scss';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { useListCommonState } from 'hooks/useListCommonState';

const ItemLocationSection = () => {
  const stateOptions = useListCommonState();

  return (
    <div>
      <h4 className={classes.title}>Item Location</h4>
      <div className={cx('form-group row', classes.formItem)}>
        <h4 className={cx('col-sm-4 col-lg-2 col-12', classes.label_col)}>Address</h4>
        <div className={cx('col-sm-8 col-12', classes.input_col)}>
          <FormikInput className={cx(classes.input)} name="addressLine" />
        </div>
      </div>

      <div className={cx('form-group row', classes.formItem)}>
        <h4 className={cx('col-sm-4 col-lg-2 col-12', classes.label_col)}>City</h4>
        <div className={cx('col-sm-8 col-12', classes.input_col)}>
          <FormikInput className={cx(classes.input)} name="city" />
        </div>
      </div>

      <div className={cx('form-group row', classes.formItem)}>
        <h4 className={cx('col-sm-4 col-lg-2 col-12', classes.label_col)}>State</h4>
        <div className={cx('col-sm-8 col-12', classes.input_col)}>
          <FormikSelect
            inputId={'select-state'}
            options={stateOptions}
            className={cx(classes.input)}
            name="state"
            isSearchable={true}
          />
        </div>
      </div>

      <div className={cx('form-group row', classes.formItem)}>
        <h4 className={cx('col-sm-4 col-lg-2 col-12', classes.label_col)}>Zip code</h4>
        <div className={cx('col-sm-8 col-12', classes.input_col)}>
          <FormikInput className={cx(classes.input)} name="zipCode" />
        </div>
      </div>
    </div>
  );
};

export default ItemLocationSection;
