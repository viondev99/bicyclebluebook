/* eslint-disable import/no-cycle */
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, useMemo } from 'react';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import SubStepOne from './SubStepOne';
import SubStepTwo from './SubStepTwo';
import SubStepTwoDotFive from './SubStepTwoDotFive';
import SubStepThree from './SubStepThree';
import SubStepFour from './SubStepFour';
import SubStepFive from './SubStepFive';
import SubStepSix from './SubStepSix';
import { SaveAsQuoteData, TradeInScoreCardsProps } from '../../formDefaultValue';

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
  handleAddTradeInDropOffRequest: () => void;
  handleSubmitStandardQuoteStepOneNextToStepTwo: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  gotoCustomQuote: () => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
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
  handleAddTradeInDropOffRequest,
  handleSubmitStandardQuoteStepOneNextToStepTwo,
  handleDeclineStepOne,
  gotoCustomQuote,
  handleSubmitModalSaveAsQuote,
  handleCountinues,
  setSubStep,
  statusHistoryQuote,
}) => {
  const renderForm = useMemo(() => {
    switch (subStep) {
      case 1:
        return <SubStepOne activeCard={activeCard} setActiveCard={setActiveCard} />;

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
            handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
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
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
            statusHistoryQuote={statusHistoryQuote}
          />
        );

      default:
        return null;
    }
  }, [
    subStep,
    activeCard,
    setActiveCard,
    form,
    formStepOneStepTwoRef,
    onChangeForm,
    handleSubmitStepOneSubStepTwo,
    setFormStepOneSubStepThree,
    isCompleted,
    gotoCustomQuote,
    formStepOneSubStepThree,
    handleCountinues,
    handleAddTradeInDropOffRequest,
    setSubStep,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleDeclineStepOne,
    handleSubmitModalSaveAsQuote,
    statusHistoryQuote,
  ]);

  return <>{renderForm}</>;
};

export default StepDetail;
