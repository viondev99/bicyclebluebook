import React, { FC, useMemo } from 'react';
import cx from 'classnames';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import Button from '@ui/Buttons/Primary/Button';
import classes from './section.module.scss';
import WrapSection from './WrapSection';

interface Condition {
  name: string;
  content: string;
}

const Conditions: Condition[] = [
  {
    name: 'Excellent',
    content: 'Looks new and is in excellent mechanical condition',
  },
  {
    name: 'Very Good',
    content: 'Has minor cosmetic defects and is in excellent mechanical condition',
  },
  {
    name: 'Good',
    content: 'Has some repairable cosmetic defects and is free of major mechanical problems',
  },
  {
    name: 'Fair',
    content: 'Has some cosmetic defects that require repairing and/or replacing',
  },
];

interface Props {
  values: InstantPayoutRequestForm;
  isActive: boolean;
  setValues: (values: { condition?: string }) => void;
}

const Section3: FC<Props> = ({ isActive, setValues, values }) => {
  const isStepComplete = useMemo(() => {
    if (isActive && values.condition !== '') {
      return true;
    }
    return false;
  }, [isActive, values.condition]);
  return (
    <WrapSection title="What condition is your bike in?" isActive={isActive} isComplete={isStepComplete}>
      <div>
        {Conditions.map((condition: Condition, index) => (
          <div
            className={cx(classes.condition, {
              [classes.isChecked]: condition.name === values.condition,
            })}
            key={String(index)}
            onClick={() => setValues({ condition: condition.name })}>
            <div className={classes.name}>{condition.name}</div>
            <div className={classes.content}>{condition.content}</div>
          </div>
        ))}
      </div>
    </WrapSection>
  );
};

export default Section3;
