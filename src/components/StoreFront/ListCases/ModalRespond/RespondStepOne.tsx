import React, { FC } from 'react';
import Radio from '@ui/Radio';
import classes from './modal-respond.module.scss';

interface Props {
  radioNumberChecked: number;
  handleChangeRadioStepOne: (num: number) => void;
}

const RespondStepOne: FC<Props> = ({ radioNumberChecked, handleChangeRadioStepOne }) => {
  return (
    <>
      <div className={classes.responseRadioContainer}>
        <Radio
          checked={radioNumberChecked === 1}
          label={<div className={classes.labelRadio}>I’ll issue a refund to my customer and close this case</div>}
          className={classes.radio}
          onClick={() => handleChangeRadioStepOne(1)}
        />
      </div>
      <div className={classes.responseRadioContainer}>
        <Radio
          checked={radioNumberChecked === 2}
          label={
            <div className={classes.labelRadio}>
              I disagree with the claim. I’d like to submit additional information.
            </div>
          }
          className={classes.radio}
          onClick={() => handleChangeRadioStepOne(2)}
        />
      </div>
      <div className={classes.responseRadioContainer}>
        <Radio
          checked={radioNumberChecked === 3}
          label={<div className={classes.labelRadio}>I’ve already shipped the product.</div>}
          className={classes.radio}
          onClick={() => handleChangeRadioStepOne(3)}
        />
      </div>
    </>
  );
};

export default React.memo(RespondStepOne);
