import React, { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './form-request.module.scss';
import icArrowLeftGrey from '../../../assets/img/messages/ic_arrow_left_grey.svg';
import iconNextWhite from '../../../assets/img/register/ic_next_white.svg';

interface Props {
  disabledBack?: boolean;
  disabledContinue?: boolean;
  hideBack?: boolean;
  hideContinue?: boolean;
  onClickBack?: () => void;
  onClickContinue?: () => void;
}

const FormRequestButton: FC<Props> = ({
  disabledBack,
  disabledContinue,
  hideBack,
  hideContinue,
  onClickBack,
  onClickContinue,
}) => {
  return (
    <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
      {!hideBack && (
        <Button
          disabled={disabledBack}
          buttonType="outline"
          className={cx(classes.btnBack, classes.customButtonSize, {
            [classes.disableBtn]: disabledBack,
          })}
          onClick={onClickBack}>
          <img src={icArrowLeftGrey} alt="icon_next" className="mr-4" />
          Back
        </Button>
      )}
      {!hideContinue && (
        <Button
          onClick={onClickContinue}
          disabled={disabledContinue}
          type="submit"
          className={cx(classes.customButtonSize, classes.btnNext)}>
          Continue
          <img src={iconNextWhite} alt="icon_next" className="ml-4" />
        </Button>
      )}
    </div>
  );
};

export default FormRequestButton;
