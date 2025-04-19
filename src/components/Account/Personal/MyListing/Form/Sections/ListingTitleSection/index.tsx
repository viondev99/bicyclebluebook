import React, { FC } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import classes from './listing-title-section.module.scss';

interface Props {
  // conditions: ConditionModel[];
  // formValue: FormValue;
  // errorCondition: string;
  // setValues: (values: { selectedCondition: string }) => any;
}

const ListingTitleSection: FC<Props> = () => {
  return (
    <div className="mt-2">
      <h3>
        Listing Title<label>*</label>
      </h3>
      <FormikInput name={'listingTitle'} className={classes.responsiveInput} maxLength={500} />
    </div>
  );
};
export default ListingTitleSection;
