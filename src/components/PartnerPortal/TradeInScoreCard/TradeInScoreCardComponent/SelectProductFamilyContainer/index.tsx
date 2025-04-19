/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useMemo } from 'react';
import SelectFamilyHeading from 'components/TradeIn/FormRequest/TradeInRequestComponents/SelectFamilyHeading';
import SelectFamily from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/SelectProductFamilyContainer/SelectFamily';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import { sortFilterBrand } from 'helpers/utilities.helper';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getLogoBrandValueGuide } from 'store/value-guide/value-guide.action';
import { TradeInScoreCardsProps } from '../../StandardQuote/formDefaultValue';

interface Props {
  form: TradeInScoreCardsProps;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  onChangeFormSelectBicycle: (data: GetListTradeInBicycleParams) => void;
  handleCountinues: () => void;
}

const SelectProductFamilyContainer: FC<Props> = ({
  form,
  onChangeForm,
  onChangeFormSelectBicycle,
  handleCountinues,
}) => {
  const dispatch = useDispatch();
  const brands = useSelector((store: StoreState) => store.valueGuide.baseComponent?.branchYearModel);

  const brandName = useMemo(() => {
    const brandOptions = brands?.length > 0 ? sortFilterBrand(brands) : [];
    const findBrand = brandOptions.find((it) => it.value === form.brand);
    return findBrand?.label || '-';
  }, [brands, form.brand]);

  useEffect(() => {
    if (form.brand) {
      dispatch(getLogoBrandValueGuide(form.brand));
    }
  }, [form.brand, dispatch]);

  return (
    <div>
      <SelectFamilyHeading title="Select Product Family" name={brandName} />
      <SelectFamily
        familyName={form.familyName || ''}
        onChangeForm={onChangeForm}
        onChangeFormSelectBicycle={onChangeFormSelectBicycle}
        handleCountinues={handleCountinues}
      />
    </div>
  );
};

export default SelectProductFamilyContainer;
