import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Slider, { Range } from 'rc-slider';
import identity from 'lodash/identity';
import classes from './filter-range.module.scss';

// eslint-disable-next-line prefer-destructuring
const Handle = (Slider as any).Handle;

interface Props {
  step?: number;
  range: [number, number];
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatDisplayValue?: (value: number) => void;
  disabled?: boolean;
}

const FilterRange: FC<Props> = ({
  range,
  value: initRange,
  onChange,
  formatDisplayValue = identity,
  step,
  disabled,
}) => {
  const [value, setValue] = useState<[number, number]>(initRange);

  useEffect(() => {
    setValue(initRange);
  }, [initRange]);

  const handleChangeValue = useCallback((v: [number, number]) => {
    setValue(v);
  }, []);

  const renderTooltipCard = useMemo(() => {
    return (
      <>
        {value[1] && value[1] !== 0 ? (
          <div className={classes.wrapTooltip} style={{ left: `${(value[1] / range[1]) * 100}%` }}>
            {formatDisplayValue ? `${formatDisplayValue(value[1])}` : value[1]}
          </div>
        ) : null}
      </>
    );
  }, [formatDisplayValue, range, value]);

  const handleShowTooptip = useCallback(
    (props) => {
      const { ...restProps } = props;
      return (
        <>
          <Handle value={restProps?.value} {...restProps} />
          {value[1] !== 0 ? renderTooltipCard : null}
        </>
      );
    },
    [renderTooltipCard, value],
  );

  return (
    <div className={classes.saleCalculatorSlicerWrapper}>
      <Range
        min={range[0]}
        max={range[1]}
        value={value}
        onChange={handleChangeValue}
        onAfterChange={onChange}
        step={step}
        disabled={disabled}
        // handle={handleShowTooptip}
      />
      {/* <div className={classes.value}>
        <span>{`${formatDisplayValue && range[0] !== 0 ? formatDisplayValue(range[0]) : range[0]}`}</span>
        <span>{`${formatDisplayValue && range[1] !== 0 ? formatDisplayValue(range[1]) : range[1]}`}</span>
      </div> */}
    </div>
  );
};

export default React.memo(FilterRange);
