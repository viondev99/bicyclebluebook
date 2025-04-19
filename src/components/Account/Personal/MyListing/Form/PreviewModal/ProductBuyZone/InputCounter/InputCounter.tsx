import React, { ChangeEvent, KeyboardEvent, FC, useCallback, useEffect } from 'react';
import classes from './input-counter.module.scss';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  onUp?: () => void;
  onDown?: () => void;
  max?: number;
  min?: number;
}

const InputCounter: FC<Props> = ({ value, onDown, onUp, onChange, max = 9999, min = -9999 }) => {
  const handlePressMinus = useCallback(() => {
    onChange && onChange(Math.max(value - 1, min));
    if (onDown && value > min) {
      onDown();
    }
  }, [onChange, value, min, onDown]);

  const handlePressPlus = useCallback(() => {
    onChange && onChange(Math.min(value + 1, max));
    if (onDown && value < max) {
      onUp();
    }
  }, [onChange, value, max, onDown, onUp]);

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(+e.target.value);
    },
    [onChange],
  );

  useEffect(() => {
    if (max < value) {
      onChange && onChange(max);
    }
    if (value < min) {
      onChange && onChange(min);
    }
  }, [max, min, onChange, value]);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const iKeyCode = e.which ? e.which : e.keyCode;
    if (
      iKeyCode !== 46 &&
      iKeyCode > 31 &&
      (iKeyCode < 48 || iKeyCode > 57) &&
      (iKeyCode < 37 || iKeyCode > 40) &&
      !e.metaKey
    ) {
      e.preventDefault();
      return false;
    }
    return true;
  }, []);

  return (
    <div className={classes.inputCounterWrapper}>
      <button type="button" className={classes.actionButton} onClick={handlePressMinus} disabled={value === min}>
        -
      </button>
      <input
        disabled={true}
        type="text"
        className={classes.input}
        value={value}
        onChange={handleChangeInput}
        onKeyDown={handleKeyPress}
      />
      <button type="button" className={classes.actionButton} onClick={handlePressPlus} disabled={value === max}>
        +
      </button>
    </div>
  );
};

export default InputCounter;
