import React, { FC, useCallback } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import Radio from '@ui/Radio';
import classes from './filter-radio.module.scss';

interface Options {
  value: string;
  label: string;
}

interface Props {
  options: Options[];
  value: string;
  onChange: (value: string) => void;
}

const FilterRadio: FC<Props> = (props) => {
  const OPTIONS_HEIGHT = 35;
  const { options, value, onChange } = props;

  const renderItem = useCallback(
    ({ index, key, style }) => {
      const option = options[index];
      return (
        <Radio
          key={key}
          style={style}
          checked={value === option.value}
          label={option.label}
          value={option.value}
          onChange={(e) => {
            onChange(e.currentTarget.value);
          }}
        />
      );
    },
    [onChange, options, value],
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

export default React.memo(FilterRadio);
