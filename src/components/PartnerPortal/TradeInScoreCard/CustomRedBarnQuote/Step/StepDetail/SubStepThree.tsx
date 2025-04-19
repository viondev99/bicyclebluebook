import React, { FC } from 'react';
import SelectConditionCustomQuote from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/SelectConditionCustomQuote';
import WheelDrivertrainFramesizeCustomQuote from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/WheelDrivertrainFramesizeCustomQuote';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-three.module.scss';
import { FormStepDetailSubStepFour } from '../../formDefaultValue';

interface Props {
  upgradeCompIds: number[];
  setUpgradeCompIds: (values: number[]) => void;
  formStepDetailSubStepFour: FormStepDetailSubStepFour;
  setFormStepDetailSubStepFour: (values: FormStepDetailSubStepFour) => void;
  isCompleteCustomQuote: boolean;
}

const SubStepThree: FC<Props> = ({
  upgradeCompIds,
  setUpgradeCompIds,
  formStepDetailSubStepFour,
  setFormStepDetailSubStepFour,
  isCompleteCustomQuote,
}) => {
  return (
    <>
      <div className={classes.headerStep}>{constTitleStep.StepSelectConditionAndModification}</div>
      <SelectConditionCustomQuote
        formStepDetailSubStepFour={formStepDetailSubStepFour}
        setFormStepDetailSubStepFour={setFormStepDetailSubStepFour}
        isCompleteCustomQuote={isCompleteCustomQuote}
      />
      <WheelDrivertrainFramesizeCustomQuote
        upgradeCompIds={upgradeCompIds}
        setUpgradeCompIds={setUpgradeCompIds}
        isCompleteCustomQuote={isCompleteCustomQuote}
      />
      <div className={classes.fixBottomMobile} />
    </>
  );
};

export default SubStepThree;
