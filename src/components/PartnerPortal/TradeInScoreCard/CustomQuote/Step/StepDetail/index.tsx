/* eslint-disable import/no-cycle */
import React, { FC, useMemo } from 'react';
import SubStepOne from './SubStepOne';
import SubStepThree from './SubStepThree';
import SubStepTwo from './SubStepTwo';
import { FormStepDetailSubStepFour, FormStepDetailSubStepOne, FormStepDetailSubStepTwo } from '../../formDefaultValue';
import SubStepProvidedValue from './SubStepProvidedValue';

interface Props {
  formStepDetailSubStepOne: FormStepDetailSubStepOne;
  formStepDetailSubStepTwo: FormStepDetailSubStepTwo;
  formStepDetailSubStepOneRef: any;
  formStepDetailSubStepTwoRef: any;
  upgradeCompIds: number[];
  setUpgradeCompIds: (values: number[]) => void;
  formStepDetailSubStepFour: FormStepDetailSubStepFour;
  setFormStepDetailSubStepFour: (values: FormStepDetailSubStepFour) => void;
  subStep: number;
  setVisibleSaveStep: (value: boolean) => void;
  isCompleteCustomQuote: boolean;
}

const StepDetail: FC<Props> = ({
  subStep,
  formStepDetailSubStepOne,
  formStepDetailSubStepTwo,
  formStepDetailSubStepOneRef,
  formStepDetailSubStepTwoRef,
  upgradeCompIds,
  setUpgradeCompIds,
  formStepDetailSubStepFour,
  setFormStepDetailSubStepFour,
  setVisibleSaveStep,
  isCompleteCustomQuote,
}) => {
  const renderForm = useMemo(() => {
    switch (subStep) {
      case 1:
        return (
          <SubStepOne
            formStepDetailSubStepOne={formStepDetailSubStepOne}
            formStepDetailSubStepOneRef={formStepDetailSubStepOneRef}
            setVisibleSaveStep={setVisibleSaveStep}
            isCompleteCustomQuote={isCompleteCustomQuote}
          />
        );

      case 2:
        return (
          <SubStepTwo
            formStepDetailSubStepTwoRef={formStepDetailSubStepTwoRef}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            isCompleteCustomQuote={isCompleteCustomQuote}
          />
        );

      case 3:
        return (
          <SubStepThree
            upgradeCompIds={upgradeCompIds}
            setUpgradeCompIds={setUpgradeCompIds}
            isCompleteCustomQuote={isCompleteCustomQuote}
            formStepDetailSubStepFour={formStepDetailSubStepFour}
            setFormStepDetailSubStepFour={setFormStepDetailSubStepFour}
          />
        );

      case 4:
        return <SubStepProvidedValue />;

      default:
        return null;
    }
  }, [
    formStepDetailSubStepFour,
    formStepDetailSubStepOne,
    formStepDetailSubStepOneRef,
    formStepDetailSubStepTwo,
    formStepDetailSubStepTwoRef,
    isCompleteCustomQuote,
    setFormStepDetailSubStepFour,
    setUpgradeCompIds,
    setVisibleSaveStep,
    subStep,
    upgradeCompIds,
  ]);

  return <>{renderForm}</>;
};

export default StepDetail;
