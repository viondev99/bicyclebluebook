import React, { FC } from 'react';
import classNames from 'classnames';
import classes from './filter.module.scss';

interface Props {
  selected: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

const FilterItem: FC<Props> = ({ selected, label, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!selected)}
      className={classNames(classes.filterWrapper, {
        [classes.selected]: selected,
      })}>
      {label}
    </button>
  );
};

export default FilterItem;
