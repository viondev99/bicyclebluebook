/* eslint-disable no-unused-expressions */
import React, { FC, memo, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { getLogoBrandValueGuide } from 'store/value-guide/value-guide.action';
import SelectFamily from './TradeInRequestComponents/SelectFamily';
import SelectFamilyHeading from './TradeInRequestComponents/SelectFamilyHeading';
import classes from './form-request.module.scss';

import FormRequestButton from './FormRequestButton';

interface TradeInForm {
  brand: { value: string; label: string } | null;
  familyName: string;
}
interface Props {
  brand: { value: string; label: string };
  familyName: string;
  onChangeStep: (step: number, subStep?: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
}

const Step2: FC<Props> = ({ brand, familyName, onChangeStep, onChangeForm }) => {
  const dispatch = useDispatch();

  const disableBtnNext = useMemo(() => {
    return familyName === '';
  }, [familyName]);

  useEffect(() => {
    if (brand?.value) {
      dispatch(getLogoBrandValueGuide(brand?.value));
    }
  }, [brand, dispatch]);

  const handleNextStep = useCallback(() => {
    onChangeStep(1, 3);
  }, [onChangeStep]);

  const handleBackStep = useCallback(() => {
    onChangeStep(1, 1);
  }, [onChangeStep]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.formContainer}>
          <SelectFamilyHeading title="Select Product Family" name={brand?.label || ''} />
          <SelectFamily familyName={familyName} onChangeForm={onChangeForm} />
        </div>
      </div>
      <FormRequestButton
        disabledBack={false}
        disabledContinue={disableBtnNext}
        onClickBack={handleBackStep}
        onClickContinue={handleNextStep}
      />
    </>
  );
};

export default memo(Step2);
