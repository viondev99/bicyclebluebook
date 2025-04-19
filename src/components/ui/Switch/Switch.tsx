import React, { CSSProperties, FC, ReactElement } from 'react';
import cx from 'classnames';
import BaseSwitch, { ReactSwitchProps } from 'react-switch';
import omit from 'lodash/omit';

export interface Props extends ReactSwitchProps {
  isError?: boolean;
  label?: string | ReactElement;
  labelClassName?: string;
  style?: CSSProperties;
}

const Switch: FC<Props> = ({ className, style, checked, labelClassName, label, ...other }) => {
  return (
    <div className={cx('switch', className)} style={style}>
      <BaseSwitch
        width={46}
        height={26}
        uncheckedIcon={false}
        checkedIcon={false}
        checked={checked}
        role={'checkbox'}
        onColor={'#4cb3e4'}
        {...omit(other, 'isError')}
      />

      <span className={cx('label', labelClassName)}>{label}</span>
    </div>
  );
};

export default Switch;
