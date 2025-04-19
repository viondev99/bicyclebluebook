import React, { FC, useMemo } from 'react';
import { formatCurrency } from 'helpers/string.helper';
import camelCase from 'lodash/camelCase';
import useConditionByBMY from 'hooks/useConditionsByBMY';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import Button from '@ui/Buttons/Primary/Button';
import classes from './section.module.scss';
import WrapSection from './WrapSection';

interface Props {
  values: InstantPayoutRequestForm;
  isActive: boolean;
  onAccept: () => void;
  setValues: (values: { condition?: string }) => void;
}

const Section4: FC<Props> = ({ isActive, setValues, onAccept, values }) => {
  const { data } = useConditionByBMY(values.brand, values.model, values.year);
  const isStepComplete = useMemo(() => {
    if (isActive && values.condition !== '') {
      return true;
    }
    return false;
  }, [isActive, values.condition]);
  const calculateTradeInValue = useMemo(() => {
    if (data?.listConditions) {
      const conditionChecked = data?.listConditions.find(
        (condition: any) => camelCase(condition.condition) === camelCase(values.condition),
      );
      return conditionChecked ? formatCurrency(conditionChecked.tradeInValue * 0.9) : 0;
    }
    return 0;
  }, [data, values.condition]);
  return (
    <WrapSection title="Here’s what you could get." isActive={isActive} isComplete={isStepComplete}>
      <div>
        <div className={classes.description}>Your estimate Instant Payout amount based on condition is</div>
        <div className={classes.price}>{calculateTradeInValue}</div>
        <Button onClick={onAccept}>Continue</Button>
      </div>
    </WrapSection>
  );
};

export default Section4;
