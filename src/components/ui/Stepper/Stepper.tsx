import React, { FC, memo, Fragment, useMemo } from 'react';
import cx from 'classnames';
import icCheck from '../../../assets/img/trade-in/ic_check.svg';

interface Props {
  total: number;
  active: number;
  showComplete?: boolean;
  blurStepNotActivated?: boolean;
}

const Stepper: FC<Props> = (props) => {
  const { total, active, showComplete = false, blurStepNotActivated = false } = props;
  const steps = useMemo(() => {
    return Array(total)
      .fill(0)
      .map((item, index) => ({
        id: index + 1,
        name: index === total - 1 && showComplete ? 'Complete' : `Step ${index + 1}`,
      }));
  }, [total, showComplete]);

  const activeStep = useMemo(() => {
    if (active < 1) {
      return 0;
    }
    if (active > total) {
      return total;
    }
    return active;
  }, [active, total]);

  return (
    <div className={'stepper'}>
      <div className={'bar'}>
        <div className={'process'} style={{ width: `${(100 / (total - 1)) * (activeStep - 1)}%` }} />
      </div>
      <div className={'steps'}>
        {steps.map((item) => (
          <Fragment key={`step-${item.id}`}>
            <div
              className={cx('title', 'd-none', 'd-sm-block', {
                active: activeStep === item.id,
                notActivated: activeStep < item.id && blurStepNotActivated,
              })}>
              {item.name}
            </div>
            <div className={cx('icon', 'd-sm-none', 'd-flex', { active: activeStep === item.id })}>
              {item.id === total && showComplete ? <img src={icCheck} alt={'check-icon'} /> : item.id}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(Stepper);
