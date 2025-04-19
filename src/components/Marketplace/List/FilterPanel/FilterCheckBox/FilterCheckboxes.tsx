import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import CheckBox from '@ui/CheckBox';
import { AutoSizer, List } from 'react-virtualized';
import classes from './filter-checkbox.module.scss';

interface Options {
  value: string;
  label: string;
}

interface Props {
  options: Options[];
  values: string[] | string;
  onChange: (value: string[]) => void;
}

interface CheckboxProps extends ComponentProps<typeof CheckBox> {
  values: string[];
  value: string;
  label: string;
  onCheck: (value: string, checked: boolean) => void;
}

const CheckboxWithStates: FC<CheckboxProps> = ({ values, value, onCheck, ...other }) => {
  const checked = useMemo(() => {
    return values.includes(value);
  }, [values, value]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheck(value, e.target.checked);
    },
    [onCheck, value],
  );
  return <CheckBox checked={checked} onChange={handleChange} {...other} />;
};

const FilterCheckboxes: FC<Props> = (props) => {
  const OPTIONS_HEIGHT = 35;
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
  const renderItem = useCallback(
    ({ index, key, style }) => {
      const option = options[index];
      return (
        <CheckboxWithStates
          key={key}
          style={style}
          value={option.value}
          values={values}
          onCheck={handleChangCheckbox}
          className={classes.label}
          label={option.label}
        />
      );
    },
    [handleChangCheckbox, options, values],
  );

  return (
    <div
      className={classes.wrapper}
      style={{
        height: options ? Math.min(options.length * OPTIONS_HEIGHT, 250) : 50,
      }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            height={height}
            width={width}
            rowCount={options.length}
            rowHeight={OPTIONS_HEIGHT}
            rowRenderer={renderItem}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(FilterCheckboxes);
