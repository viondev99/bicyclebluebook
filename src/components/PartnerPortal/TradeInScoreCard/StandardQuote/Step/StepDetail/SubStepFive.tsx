import React, { FC } from 'react';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import WheelDrivertrainFramesize from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/WheelDrivertrainFramesize';
import SelectCondition from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/SelectCondition';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import classes from './sub-step-five.module.scss';
import { constTitleStep } from '../../constraint';
import { TradeInScoreCardsProps } from '../../formDefaultValue';

interface Props {
  form: TradeInScoreCardsProps;
  formStepOneSubStepThree: GetListTradeInBicycleParams;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  handleAddTradeInDropOffRequest: () => void;
  isCompleted: boolean;
  setSubStep?: (value: number) => void;
}

const SubStepFive: FC<Props> = ({
  form,
  formStepOneSubStepThree,
  isCompleted,
  onChangeForm,
  handleAddTradeInDropOffRequest,
  setSubStep,
}) => {
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);

  return (
    <>
      <div className={classes.titleBicycle}>{dataTradeInBicycle?.bicycleName}</div>
      <div className={classes.headerStep}>{constTitleStep.StepSelectConditionAndModification}</div>
      <SelectCondition
        form={form}
        formCurrentStep={formStepOneSubStepThree}
        onChangeForm={onChangeForm}
        handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
        isCompleted={isCompleted}
        setSubStep={setSubStep}
      />
      <WheelDrivertrainFramesize
        form={form}
        formCurrentStep={formStepOneSubStepThree}
        onChangeForm={onChangeForm}
        isCompleted={isCompleted}
      />
    </>
  );
};

export default SubStepFive;
