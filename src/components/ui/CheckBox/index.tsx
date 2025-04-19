import React, { FC, ReactElement } from 'react';
import cx from 'classnames';

export interface Props {
  title?: string;
  hasBorder?: boolean;
  isError?: boolean;
  circle?: boolean;
  label?: string | ReactElement;
  checkMarkClassName?: string;
}

const CheckBox: FC<React.InputHTMLAttributes<HTMLInputElement & HTMLLabelElement> & Props> = (props) => {
  const {
    hasBorder = false,
    className,
    name,
    checked,
    onChange,
    label,
    isError,
    style,
    disabled,
    circle = false,
    checkMarkClassName,
    ...other
  } = props;

  return (
    // eslint-disable-next-line
    <label
      className={cx('checkbox', className, {
        checked,
        border: hasBorder,
        error: isError,
        disabled,
      })}
      style={style}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        {...other}
        onChange={onChange}
        defaultChecked
      />
      <span
        className={cx('checkmark', checkMarkClassName, {
          circle,
        })}
      />
      <span className={'label'}>{label}</span>
    </label>
  );
};

export default CheckBox;
