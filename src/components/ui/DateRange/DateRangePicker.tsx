import React, { FC, useCallback, useRef, useState } from 'react';
import { DayPickerRangeController, DayPickerRangeControllerShape, FocusedInputShape } from 'react-dates';
import 'react-dates/initialize';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import InvisibleBackdrop from '../Backdrop/InvisibleBackdrop';
import classes from './date-range.module.scss';

interface Props {
  handleSubmit: () => void;
  handleCancel: () => void;
  handleCloseWhenClickOut?: () => void;
}

const DateRangePicker: FC<Omit<DayPickerRangeControllerShape, 'focusedInput' | 'onFocusChange'> & Props> = (props) => {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape>('startDate');
  const screen = useScreenDetect();
  const handleFocusChange = useCallback((input) => {
    setFocusedInput(!input ? 'startDate' : 'endDate');
  }, []);

  const { onDatesChange, handleCancel, handleSubmit, ...other } = props;
  const renderCalendarInfo = useCallback(() => {
    return (
      <div className={'d-flex justify-content-end mt-2 p-2 pr-4'}>
        <Button
          buttonSize={'s'}
          buttonType="transparent"
          className={classes.btn}
          onClick={() => {
            handleCancel();
          }}>
          Cancel
        </Button>
        <Button
          buttonSize={'s'}
          buttonType="transparent"
          className={cx('ml-4', classes.btn, classes.applyDate)}
          onClick={() => {
            handleSubmit();
          }}>
          Apply
        </Button>
      </div>
    );
  }, [handleCancel, handleSubmit]);
  const handleOnDateChange = useCallback(
    (values) => {
      const data = {
        startDate: values.startDate,
        endDate: values.endDate || values.startDate,
      };
      onDatesChange(data);
    },
    [onDatesChange],
  );

  return (
    <InvisibleBackdrop onClick={props.handleCloseWhenClickOut}>
      <div className={classes.containerRangeDate}>
        <DayPickerRangeController
          orientation={'horizontal'}
          onDatesChange={handleOnDateChange}
          numberOfMonths={screen.isMediumScreen() ? 1 : 2}
          renderCalendarInfo={renderCalendarInfo}
          focusedInput={focusedInput}
          onFocusChange={handleFocusChange}
          hideKeyboardShortcutsPanel={true}
          noBorder={true}
          minimumNights={1}
          {...other}
        />
      </div>
    </InvisibleBackdrop>
  );
};
export default DateRangePicker;
