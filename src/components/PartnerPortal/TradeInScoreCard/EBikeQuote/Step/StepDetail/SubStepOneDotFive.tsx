/* eslint-disable no-nested-ternary */
import React, { FC } from 'react';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import SelectProductFamilyContainer from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/SelectProductFamilyContainer';
import { TradeInScoreCardsProps } from '../../formDefaultValue';

interface Props {
  form: TradeInScoreCardsProps;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  onChangeFormSelectBicycle: (data: GetListTradeInBicycleParams) => void;
  handleCountinues: () => void;
}

const SubStepOneDotFive: FC<Props> = ({ form, onChangeForm, onChangeFormSelectBicycle, handleCountinues }) => {
  return (
    <SelectProductFamilyContainer
      form={form}
      onChangeForm={onChangeForm}
      onChangeFormSelectBicycle={onChangeFormSelectBicycle}
      handleCountinues={handleCountinues}
    />
  );
};

export default SubStepOneDotFive;
