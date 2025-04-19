import React, { FC } from 'react';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import FormikInput from 'components/Formik/Input/FormikInput';
import Button from '@ui/Buttons/Primary/Button';
import classes from './section.module.scss';

interface Props {
  checkZipCodeIsExist: (zipCode: string) => void;
  values: InstantPayoutRequestForm;
}

const Section1: FC<Props> = ({ checkZipCodeIsExist, values }) => {
  return (
    <div>
      <div className={classes.title}>Sell your bike to Bicycle Blue Book</div>
      <div className={classes.intro}>
        Bring your bike to any participating bike shop and get paid immediately with PayPal.
        <br /> To find out if this is available in your area, please enter your zip code.
      </div>
      <div className={classes.containInput}>
        <FormikInput name="zipCode" placeholder="Zip Code" className={classes.inputZipCode} />
        <Button buttonType="primary" onClick={() => checkZipCodeIsExist(values.zipCode)}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Section1;
