import React, { FC } from 'react';
import CloseIcon from 'assets/img/common/ic_close_circle.component.svg';
import classes from './selected.module.scss';

interface Props {
  label: string;
  onRemove: () => void;
}

const Selected: FC<Props> = ({ label, onRemove }) => {
  return (
    <div className={classes.wrapper}>
      {label}
      <button type="button" className={classes.removeButton} onClick={onRemove}>
        <CloseIcon className={classes.closeIcon} />
      </button>
    </div>
  );
};

export default Selected;
