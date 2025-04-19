import React, { FC, useMemo } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import Button from '@ui/Buttons/Primary/Button';
import classes from './section.module.scss';
import WrapSection from './WrapSection';

const MilesOptions = [
  {
    value: '10',
    label: '10 miles',
  },
  {
    value: '25',
    label: '25 miles',
  },
  {
    value: '50',
    label: '50 miles',
  },
  {
    value: '100',
    label: '100 miles',
  },
];

interface Props {
  values: InstantPayoutRequestForm;
  isActive: boolean;
  setValues: (values: InstantPayoutRequestForm) => void;
  checkZipCodeIsExist: (zipCode: string, isStep5: boolean, miles: number) => void;
}

const Section4: FC<Props> = ({ isActive, setValues, values, checkZipCodeIsExist }) => {
  const isStepComplete = useMemo(() => {
    if (isActive && values.condition !== '') {
      return true;
    }
    return false;
  }, [isActive, values.condition]);

  return (
    <WrapSection
      isActive={isActive}
      title="What bike are you selling?"
      isComplete={isStepComplete}
      // className={classes.resetBg}
    >
      <div className={classes.wrapStep5}>
        <div className={classes.titleStep5}>Within</div>
        <div className={classes.input}>
          <FormikSelect inputId={'miles-select-section5'} name={'miles'} options={MilesOptions} placeholder={'miles'} />
        </div>
        <div className={classes.titleStep5}>of</div>
        <div className={classes.input}>
          <FormikInput name="zipCode" placeholder={'Zip Code'} />
        </div>
        <Button
          className={classes.findLocation}
          onClick={() => checkZipCodeIsExist(values.zipCode, true, Number(values.miles))}>
          Find Locations
        </Button>
      </div>
    </WrapSection>
  );
};

export default Section4;
