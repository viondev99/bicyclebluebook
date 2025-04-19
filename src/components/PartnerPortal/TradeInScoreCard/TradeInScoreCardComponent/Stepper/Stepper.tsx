import React, { FC, memo, Fragment, useMemo, useCallback } from 'react';
import cx from 'classnames';

import images from 'assets/images';
import { Button } from 'reactstrap';

interface Props {
  total: number;
  active: number;
  subActive: number;
  showComplete?: boolean;
  blurStepNotActivated?: boolean;
  stepList: string[];
  deactiveStepOne?: boolean;
  handleChangeStep?: (index: number) => void;
  isCompleted?: boolean;
  completedStep?: number;
  numberActiveStep?: number;
  type?: string;
  handleChangeStepCustomQuote?: (index: number) => void;
  isCompleteCustomQuote?: boolean;
  completedStepCustomQuote?: number;
  disabledStepperStepDetailsOfCustomQuoteApproved?: boolean;
}

const Stepper: FC<Props> = (props) => {
  const {
    total,
    active,
    subActive,
    showComplete = false,
    blurStepNotActivated = false,
    stepList,
    deactiveStepOne,
    handleChangeStep,
    isCompleted,
    completedStep,
    numberActiveStep,
    handleChangeStepCustomQuote,
    type,
    isCompleteCustomQuote,
    completedStepCustomQuote,
    disabledStepperStepDetailsOfCustomQuoteApproved,
  } = props;
  const steps = useMemo(() => {
    return Array(total)
      .fill(0)
      .map((item, index) => ({
        id: index + 1,
        name: stepList[index],
      }));
  }, [total, stepList]);

  const activeStep = useMemo(() => {
    if (active < 1) {
      return 1;
    }
    if (active > total) {
      return total;
    }
    return active;
  }, [active, total]);

  const activeStepCondition = useMemo(() => {
    return active !== 1 || (active === 1 && (subActive !== 1 || !deactiveStepOne));
  }, [active, deactiveStepOne, subActive]);

  const checkDisableSteper = useCallback(
    (index: number) => {
      if (type === 'customQuote') {
        return index > completedStepCustomQuote - 1;
      }
      return (
        (index === 0 && disabledStepperStepDetailsOfCustomQuoteApproved) ||
        (index > completedStep - 1 && completedStep !== 5) ||
        (completedStep === 5 && !isCompleted)
      );
    },
    [type, disabledStepperStepDetailsOfCustomQuoteApproved, completedStep, isCompleted, completedStepCustomQuote],
  );

  return (
    <div className={'stepper'}>
      <div className={'bar'}>
        <div className={'process'} style={{ width: `${(100 / (total - 1)) * (activeStep - 1)}%` }} />
      </div>
      <div className={'steps'}>
        {steps.map((item, index: number) => (
          <Fragment key={`step-${item.id}`}>
            <Button
              style={{ background: 'none', border: 'none' }}
              onClick={
                type === 'customQuote' ? () => handleChangeStepCustomQuote(index) : () => handleChangeStep(index)
              }
              disabled={checkDisableSteper(index)}
              className={cx('title', 'd-none', 'd-sm-block', {
                active: activeStep === item.id && activeStepCondition,
                notActivated: activeStep < item.id && blurStepNotActivated,
              })}>
              {item.name}
            </Button>
            <div
              className={cx('icon', 'd-sm-none', 'd-flex', { active: activeStep === item.id && activeStepCondition })}>
              {item.id === total && showComplete ? <img src={images.tradeIn.icCheck} alt={'check-icon'} /> : item.id}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(Stepper);
