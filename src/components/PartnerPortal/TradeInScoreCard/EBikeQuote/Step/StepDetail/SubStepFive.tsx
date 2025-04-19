import React, { FC } from 'react';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import WheelDrivertrainFramesize from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/WheelDrivertrainFramesize';
import SelectCondition from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/SelectCondition';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-five.module.scss';
import { TradeInScoreCardsProps } from '../../formDefaultValue';

interface Props {
  form: TradeInScoreCardsProps;
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  handleAddTradeInDropOffRequest: () => void;
  isCompleted: boolean;
}

const SubStepFour: FC<Props> = ({
  form,
  formStepDetailSubStepTwo,
  isCompleted,
  onChangeForm,
  handleAddTradeInDropOffRequest,
}) => {
  return (
    <>
      <div className={classes.headerStep}>{constTitleStep.StepSelectConditionAndModification}</div>
      <SelectCondition
        form={form}
        formCurrentStep={formStepDetailSubStepTwo}
        onChangeForm={onChangeForm}
        handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
        isCompleted={isCompleted}
      />
      <WheelDrivertrainFramesize
        form={form}
        formCurrentStep={formStepDetailSubStepTwo}
        onChangeForm={onChangeForm}
        isCompleted={isCompleted}
      />
    </>
  );
};

export default SubStepFour;
