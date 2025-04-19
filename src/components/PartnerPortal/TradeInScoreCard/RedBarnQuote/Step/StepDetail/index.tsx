/* eslint-disable import/no-cycle */
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, useMemo } from 'react';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import SubStepTwo from './SubStepTwo';
import SubStepTwoDotFive from './SubStepTwoDotFive';
import SubStepThree from './SubStepThree';
import SubStepFour from './SubStepFour';
import SubStepFive from './SubStepFive';
import SubStepSix from './SubStepSix';
import { TradeInScoreCardsProps } from '../../formDefaultValue';

interface Props {
  form: TradeInScoreCardsProps;
  subStep: number;
  activeCard: number;
  formStepOneStepTwoRef: any;
  formStepOneSubStepThree: GetListTradeInBicycleParams;
  isCompleted: boolean;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  setActiveCard: (data: number) => void;
  handleSubmitStepOneSubStepTwo: () => void;
  setFormStepOneSubStepThree: (data: GetListTradeInBicycleParams) => void;

  handleSubmitStandardQuoteStepOneNextToStepTwo: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  gotoCustomQuote: () => void;

  handleCountinues: (newFormStepOneSubStepThree?: GetListTradeInBicycleParams) => void;
  setSubStep: (value: number) => void;
  statusHistoryQuote: string;
}

const StepDetail: FC<Props> = ({
  form,
  subStep,
  activeCard,
  formStepOneStepTwoRef,
  formStepOneSubStepThree,
  isCompleted,
  onChangeForm,
  setActiveCard,
  handleSubmitStepOneSubStepTwo,
  setFormStepOneSubStepThree,

  handleSubmitStandardQuoteStepOneNextToStepTwo,
  handleDeclineStepOne,
  gotoCustomQuote,

  handleCountinues,
  setSubStep,
  statusHistoryQuote,
}) => {
  const renderForm = useMemo(() => {
    switch (subStep) {
      case 2:
        return (
          <SubStepTwo
            form={form}
            formStepOneStepTwoRef={formStepOneStepTwoRef}
            onChangeForm={onChangeForm}
            handleSubmitStepOneSubStepTwo={handleSubmitStepOneSubStepTwo}
            setFormStepOneSubStepThree={setFormStepOneSubStepThree}
            isCompleted={isCompleted}
            gotoCustomQuote={gotoCustomQuote}
          />
        );

      case 2.5: {
        return (
          <SubStepTwoDotFive
            form={form}
            onChangeForm={onChangeForm}
            onChangeFormSelectBicycle={setFormStepOneSubStepThree}
            handleCountinues={handleCountinues}
          />
        );
      }

      case 3:
        return (
          <SubStepThree
            form={form}
            onChangeForm={onChangeForm}
            formStepOneSubStepThree={formStepOneSubStepThree}
            setFormStepOneSubStepThree={setFormStepOneSubStepThree}
            handleCountinues={handleCountinues}
            isCompleted={isCompleted}
          />
        );

      case 4:
        return <SubStepFour formStepDetailSubStepTwo={formStepOneSubStepThree} />;

      case 5:
        return (
          <SubStepFive
            form={form}
            onChangeForm={onChangeForm}
            formStepOneSubStepThree={formStepOneSubStepThree}
            isCompleted={isCompleted}
            setSubStep={setSubStep}
          />
        );

      case 6:
        return (
          <SubStepSix
            form={form}
            isCompleted={isCompleted}
            formStepOneSubStepThree={formStepOneSubStepThree}
            handleSubmitStandardQuoteStepOneNextToStepTwo={handleSubmitStandardQuoteStepOneNextToStepTwo}
            handleDeclineStepOne={handleDeclineStepOne}
            statusHistoryQuote={statusHistoryQuote}
          />
        );

      default:
        return null;
    }
  }, [
    subStep,
    form,
    formStepOneStepTwoRef,
    onChangeForm,
    handleSubmitStepOneSubStepTwo,
    setFormStepOneSubStepThree,
    isCompleted,
    gotoCustomQuote,
    formStepOneSubStepThree,
    handleCountinues,
    setSubStep,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleDeclineStepOne,
    statusHistoryQuote,
  ]);

  return <>{renderForm}</>;
};

export default StepDetail;
