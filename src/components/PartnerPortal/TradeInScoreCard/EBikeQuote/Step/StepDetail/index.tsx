/* eslint-disable import/no-cycle */
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, useMemo } from 'react';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import SubStepFive from './SubStepFive';
import SubStepFour from './SubStepFour';
import SubStepTwo from './SubStepTwo';
import SubStepOne from './SubStepOne';
import SubStepSix from './SubStepSix';
import SubStepThree from './SubStepThree';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import { SaveAsQuoteData } from '../../../StandardQuote/formDefaultValue';
import SubStepOneDotFive from './SubStepOneDotFive';

interface Props {
  form: TradeInScoreCardsProps;
  subStep: number;
  formStepDetailsSubStepOneRef: any;
  formStepDetailsSubStepThreeRef: any;
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  isCompleted: boolean;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  handleSubmitStepSummarySubStepOne: () => void;
  handleSubmitStepSummarySubStepFour: () => void;
  setFormStepDetailSubStepTwo: (data: GetListTradeInBicycleParams) => void;
  handleAddTradeInDropOffRequest: () => void;
  handleSubmitStandardQuoteStepOneNextToStepTwo: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  gotoCustomQuote: () => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
  handleCountinues: () => void;
}

const StepDetail: FC<Props> = ({
  form,
  subStep,
  formStepDetailsSubStepOneRef,
  formStepDetailsSubStepThreeRef,
  formStepDetailSubStepTwo,
  isCompleted,
  onChangeForm,
  handleSubmitStepSummarySubStepOne,
  handleSubmitStepSummarySubStepFour,
  setFormStepDetailSubStepTwo,
  handleAddTradeInDropOffRequest,
  handleSubmitStandardQuoteStepOneNextToStepTwo,
  handleDeclineStepOne,
  gotoCustomQuote,
  handleSubmitModalSaveAsQuote,
  handleCountinues,
}) => {
  const renderForm = useMemo(() => {
    switch (subStep) {
      case 1:
        return (
          <SubStepOne
            form={form}
            formStepDetailsSubStepOneRef={formStepDetailsSubStepOneRef}
            onChangeForm={onChangeForm}
            handleSubmitStepSummarySubStepOne={handleSubmitStepSummarySubStepOne}
            setFormStepDetailSubStepTwo={setFormStepDetailSubStepTwo}
            isCompleted={isCompleted}
            gotoCustomQuote={gotoCustomQuote}
          />
        );

      case 1.5: {
        return (
          <SubStepOneDotFive
            form={form}
            onChangeForm={onChangeForm}
            onChangeFormSelectBicycle={setFormStepDetailSubStepTwo}
            handleCountinues={handleCountinues}
          />
        );
      }

      case 2:
        return (
          <SubStepTwo
            form={form}
            onChangeForm={onChangeForm}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            setFormStepDetailSubStepTwo={setFormStepDetailSubStepTwo}
            isCompleted={isCompleted}
            handleCountinues={handleCountinues}
          />
        );

      case 3:
        return <SubStepThree formStepDetailSubStepTwo={formStepDetailSubStepTwo} />;

      case 4:
        return (
          <SubStepFour
            form={form}
            formStepDetailsSubStepThreeRef={formStepDetailsSubStepThreeRef}
            handleSubmitStepSummarySubStepFour={handleSubmitStepSummarySubStepFour}
            isCompleted={isCompleted}
          />
        );

      case 5:
        return (
          <SubStepFive
            form={form}
            onChangeForm={onChangeForm}
            handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            isCompleted={isCompleted}
          />
        );

      case 6:
        return (
          <SubStepSix
            form={form}
            isCompleted={isCompleted}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            handleSubmitStandardQuoteStepOneNextToStepTwo={handleSubmitStandardQuoteStepOneNextToStepTwo}
            handleDeclineStepOne={handleDeclineStepOne}
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
          />
        );

      default:
        return null;
    }
  }, [
    subStep,
    form,
    formStepDetailsSubStepOneRef,
    onChangeForm,
    handleSubmitStepSummarySubStepOne,
    setFormStepDetailSubStepTwo,
    isCompleted,
    gotoCustomQuote,
    formStepDetailSubStepTwo,
    handleCountinues,
    formStepDetailsSubStepThreeRef,
    handleSubmitStepSummarySubStepFour,
    handleAddTradeInDropOffRequest,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleDeclineStepOne,
    handleSubmitModalSaveAsQuote,
  ]);

  return <>{renderForm}</>;
};

export default StepDetail;
