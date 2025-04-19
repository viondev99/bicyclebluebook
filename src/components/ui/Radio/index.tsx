import React, { FC, InputHTMLAttributes, ReactElement } from 'react';
import cx from 'classnames';

export interface Props extends InputHTMLAttributes<HTMLLabelElement & HTMLInputElement> {
  isError?: boolean;
  label?: string | ReactElement;
  labelClassName?: string;
}
const Radio: FC<Props> = (props) => {
  const { className, name, checked, onChange, label, isError, style, labelClassName = '', disabled, ...other } = props;

  return (
    // eslint-disable-next-line
    <label
      className={cx('radio', className, {
        checked,
        error: isError,
        disabled,
      })}
      style={style}>
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} {...other} readOnly />
      <span className="radioTick" />
      <span className={cx('label', labelClassName)}>{label}</span>
    </label>
  );
};

export default Radio;
