import React, { FC } from 'react';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';

interface Props {
  // conditions: ConditionModel[];
  // formValue: FormValue;
  // errorCondition: string;
  // setValues: (values: { selectedCondition: string }) => any;
}

const ListingDescriptionSection: FC<Props> = () => {
  return (
    <div className="mt-2">
      <h3>
        Item Description<label>*</label>
      </h3>
      <FormikTextarea name={'description'} rows={7} />
    </div>
  );
};
export default ListingDescriptionSection;
