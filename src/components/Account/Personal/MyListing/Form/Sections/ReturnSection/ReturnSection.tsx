import React, { FC } from 'react';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import classes from './return-section.module.scss';

interface Props {
  formValue: FormValue;
}

const ReturnOptions = [
  {
    label: '--Select--',
    value: '',
  },
  {
    label: '30 Days',
    value: '30',
  },
  {
    label: '60 Days',
    value: '60',
  },
];

const ReturnShippingPayerOptions = [
  {
    label: '--Select--',
    value: '',
  },
  {
    label: 'Buyer',
    value: 'BUYER',
  },
  {
    label: 'Seller',
    value: 'SELLER',
  },
];

const ReturnSection: FC<Props> = ({ formValue }) => {
  return (
    <div>
      <h3 className={classes.title}>Returns</h3>
      <FormikCheckbox name={'isAllowReturn'} label={'Accept Returns'} />
      {formValue.isAllowReturn && (
        <>
          <div className={'mt-4'}>
            <h4 className={classes.title}>After receiving the item, your buyer should contact you within</h4>
            <FormikSelect
              inputId={'select-return-within-day'}
              name={'returnWithinDays'}
              options={ReturnOptions}
              className={classes.select}
            />
          </div>
          <div className={'mt-4'}>
            <h4 className={classes.title}>Return shipping will be paid by</h4>
            <FormikSelect
              inputId={'select-return-paid-by'}
              name={'returnShippingPayer'}
              options={ReturnShippingPayerOptions}
              className={classes.select}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnSection;
