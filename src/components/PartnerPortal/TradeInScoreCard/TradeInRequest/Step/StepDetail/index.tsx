/* eslint-disable import/no-cycle */
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, useMemo } from 'react';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import SubStepFive from './SubStepFive';
import SubStepFour from './SubStepFour';
import SubStepTwo from './SubStepTwo';
import SubStepOne from './SubStepOne';
import SubStepSix from './SubStepSix';
import SubStepSeven from './SubStepSeven';
import SubStepEight from './SubStepEight';
import SubStepThree from './SubStepThree';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import { SaveAsQuoteData } from '../../../StandardQuote/formDefaultValue';

interface Props {
  form: TradeInScoreCardsProps;
  subStep: number;
  formStepDetailsSubStepOneRef: any;
  formStepDetailsSubStepThreeRef: any;
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  isCompleted: boolean;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  handleSubmitStepSummarySubStepOne: () => void;
  handleSubmitStepSummarySubStepThree: () => void;
  setFormStepDetailSubStepTwo: (data: GetListTradeInBicycleParams) => void;
  handleAddTradeInDropOffRequest: () => void;
  handleSubmitStepDetails: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  gotoCustomQuote: () => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
  setUpgradeCompIds: (values: number[]) => void;
  upgradeCompIds: number[];
  tradeInImages: ImageUpload[];
  setTradeInImages: (listImage: ImageUpload[]) => void;
}

const StepDetail: FC<Props> = ({
  form,
  subStep,
  formStepDetailsSubStepOneRef,
  formStepDetailSubStepTwo,
  isCompleted,
  onChangeForm,
  handleSubmitStepSummarySubStepOne,
  handleSubmitStepSummarySubStepThree,
  setFormStepDetailSubStepTwo,
  handleAddTradeInDropOffRequest,
  handleSubmitStepDetails,
  handleDeclineStepOne,
  gotoCustomQuote,
  handleSubmitModalSaveAsQuote,
  setUpgradeCompIds,
  upgradeCompIds,
  tradeInImages,
  setTradeInImages,
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

      case 2:
        return (
          <SubStepTwo
            form={form}
            onChangeForm={onChangeForm}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            setFormStepDetailSubStepTwo={setFormStepDetailSubStepTwo}
            isCompleted={isCompleted}
          />
        );

      case 3:
        return (
          <SubStepThree tradeInImages={tradeInImages} setTradeInImages={setTradeInImages} isCompleted={isCompleted} />
        );

      case 4:
        return <SubStepFour formStepDetailSubStepTwo={formStepDetailSubStepTwo} />;

      case 5:
        return (
          <SubStepFive
            form={form}
            onChangeForm={onChangeForm}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            isCompleted={isCompleted}
            setUpgradeCompIds={setUpgradeCompIds}
            upgradeCompIds={upgradeCompIds}
          />
        );

      case 6:
        return (
          <SubStepSix
            form={form}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            onChangeForm={onChangeForm}
            handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
            isCompleted={isCompleted}
          />
        );

      case 7:
        return <SubStepSeven form={form} isCompleted={isCompleted} onChangeForm={onChangeForm} />;

      case 8:
        return (
          <SubStepEight
            form={form}
            isCompleted={isCompleted}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            handleSubmitStepDetails={handleSubmitStepDetails}
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
    tradeInImages,
    setTradeInImages,
    setUpgradeCompIds,
    upgradeCompIds,
    handleAddTradeInDropOffRequest,
    handleSubmitStepDetails,
    handleDeclineStepOne,
    handleSubmitModalSaveAsQuote,
  ]);

  return <>{renderForm}</>;
};

export default StepDetail;
