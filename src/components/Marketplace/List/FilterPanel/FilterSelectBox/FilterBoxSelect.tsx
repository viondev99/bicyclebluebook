import React, { FC, ReactElement, useCallback, useMemo } from 'react';
import cx from 'classnames';
import classes from './select-box.module.scss';

interface Options {
  value: string;
  label: string;
}

interface Props {
  options: Options[];
  values: string[] | string;
  onChange: (value: string[]) => void;
}

interface CheckboxProps {
  values: string[];
  value: string;
  label: string;
  onCheck: (value: string, checked: boolean) => void;
}

interface SelectBoxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string | ReactElement;
}

const SelectBox: FC<SelectBoxProps> = ({ checked, onChange, label }) => {
  return (
    <div className={classes.selectWrapper}>
      <button
        type={'button'}
        className={cx(classes.selectBox, {
          [classes.checked]: checked,
        })}
        onClick={() => onChange(!checked)}>
        {label}
      </button>
    </div>
  );
};

const ListSelectBox: FC<CheckboxProps> = ({ values, value, onCheck, ...other }) => {
  const checked = useMemo(() => {
    return values.includes(value);
  }, [values, value]);
  const handleChange = useCallback(
    (v: boolean) => {
      onCheck(value, v);
    },
    [onCheck, value],
  );
  return <SelectBox checked={checked} onChange={handleChange} {...other} />;
};

const FilterSelectBox: FC<Props> = (props) => {
  const { options, values: _values, onChange } = props;

  const values = Array.isArray(_values) ? _values : [_values];

  const handleChangCheckbox = useCallback(
    (value, checked) => {
      if (values.includes(value) && !checked) {
        onChange(values?.filter((v) => v !== value));
      }
      if (!values.includes(value) && checked) {
        onChange([...values, value]);
      }
    },
    [values, onChange],
  );
  return (
    <div className={classes.list}>
      {options.map((option) => (
        <ListSelectBox
          key={option.value}
          value={option.value}
          values={values}
          onCheck={handleChangCheckbox}
          label={option.label}
        />
      ))}
    </div>
  );
};

export default React.memo(FilterSelectBox);
