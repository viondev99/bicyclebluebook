import React, { FC, useCallback, useEffect, useState } from 'react';
import { Range } from 'rc-slider';
import identity from 'lodash/identity';
import classes from './filter-range.module.scss';

interface Props {
  range: [number, number];
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatDisplayValue?: (value: number) => void;
}

const FilterRange: FC<Props> = ({ range, value: initRange, onChange, formatDisplayValue = identity }) => {
  const [value, setValue] = useState<[number, number]>(initRange);
  useEffect(() => {
    setValue(initRange);
  }, [initRange]);
  const handleChangeValue = useCallback((v: [number, number]) => {
    setValue(v);
  }, []);
  return (
    <div className={classes.filterWrapper}>
      <Range min={range[0]} max={range[1]} value={value} onChange={handleChangeValue} onAfterChange={onChange} />
      <div className={classes.value}>
        {formatDisplayValue(value[0])} - {formatDisplayValue(value[1])}
      </div>
    </div>
  );
};

export default React.memo(FilterRange);
