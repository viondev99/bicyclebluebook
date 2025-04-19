import React, { ComponentProps, FC } from 'react';
import CheckBox from '@ui/CheckBox';
import cx from 'classnames';
import classes from './custom-checkbox.module.scss';

interface Props extends ComponentProps<typeof CheckBox> {
  isChecked: boolean;
  name: string;
  title: string;
}

export const CustomCheckBox: FC<Props> = ({ isChecked, name, title, onChange }) => {
  return (
    <div className={cx(classes.customCheckbox, { [classes.isActive]: isChecked })}>
      <div className={classes.titleCheckbox}>{title}</div>
      <CheckBox checked={isChecked} name={name} onChange={onChange} className={classes.checkboxContent} />
    </div>
  );
};
