import React, { FC, memo } from 'react';
import numeral from 'numeral';
import cx from 'classnames';
import { TradeInForm } from 'pages/trade-in/request';
import Button from '@ui/Buttons/Primary/Button';
import classes from './form-request.module.scss';
import FormRequestButton from './FormRequestButton';

function formatTradeInValue(value: number) {
  return value ? numeral(value).format('0,0') : value;
}

interface Props {
  form: TradeInForm;
  onChangeStep: (step: number, subStep?: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
}

const SubStep2: FC<Props> = (props) => {
  const { onChangeStep, form } = props;

  const handleNextStep = () => {
    onChangeStep(3);
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.formContainer}>
          <h1 className={classes.title}>Your trade in value is</h1>
          <p className={classes.valueCondition}>${formatTradeInValue(form?.tradeInValue)}</p>
          <div className={classes.conditionContainer}>
            <Button buttonType="success" className={classes.customButtonSize} onClick={handleNextStep}>
              Accept
            </Button>
            <Button
              buttonType="danger"
              className={cx(classes.customButtonSize, classes.customWidthButtonDecline)}
              onClick={() => onChangeStep(2, 1)}>
              Decline
            </Button>
          </div>
          <p className={classes.subDescription}>
            Please only continue with the trade in process if you are happy with your valuation and intend to trade in
            the bike at your nearest partner. However, this does not mean you are required to complete the trade in if
            you change your mind later.
          </p>
        </div>
      </div>
      <FormRequestButton
        disabledBack={false}
        disabledContinue={true}
        onClickBack={() => onChangeStep(2, 1)}
        onClickContinue={handleNextStep}
      />
    </>
  );
};

export default memo(SubStep2);
