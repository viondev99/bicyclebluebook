import React, { FC, useEffect, useCallback } from 'react';
import cx from 'classnames';

import CheckBox from '@ui/CheckBox';
import FilterItem from './FilterItem';
import classes from './filter.module.scss';
import { Product } from '../../../model/common';

interface CompareList {
  name: string;
  keyName: keyof Product;
  filter?: boolean;
}

interface Props {
  filterList: CompareList[];
  compareFilter: {
    [key: string]: boolean;
  };
  setCompareFilter: (v: { [key: string]: boolean }) => void;
}

const Filter: FC<Props> = ({ filterList, compareFilter: values, setCompareFilter: setValues }) => {
  useEffect(() => {
    const everyIsFalse = Object.keys(values).every((c) => !values[c]);
    if (everyIsFalse) {
      setValues({ all: true });
    }
  }, [setValues, values]);

  const renderContent = useCallback(() => {
    return (
      <div className={cx(classes.filterRow, 'd-none', 'd-md-flex')}>
        <FilterItem
          label={'All'}
          selected={values.all}
          onChange={() => {
            setValues({ all: true });
          }}
        />
        {filterList.map((item) => (
          <FilterItem
            key={item.keyName}
            label={item.name}
            selected={!!values[item.keyName]}
            onChange={(value) => {
              const newValues = { ...values, all: false, [item.keyName]: value };
              setValues(newValues);
            }}
          />
        ))}
      </div>
    );
  }, [filterList, setValues, values]);

  const renderContentMobile = useCallback(() => {
    return (
      <div className={cx(classes.filterColumn, 'd-block', 'd-md-none')}>
        <div className={classes.checkbox}>
          <div className={classes.label}>All</div>
          <CheckBox
            checked={values.all}
            onChange={() => {
              setValues({ all: true });
            }}
          />
        </div>
        {filterList.map((item) => (
          <div className={classes.checkbox} key={item.keyName}>
            <div className={classes.label}>{item.name}</div>
            <CheckBox
              checked={!!values[item.keyName]}
              onChange={() => {
                const newValues = { ...values, all: false, [item.keyName]: !values[item.keyName] };
                setValues(newValues);
              }}
            />
          </div>
        ))}
      </div>
    );
  }, [filterList, setValues, values]);

  return (
    <>
      {renderContent()}
      {renderContentMobile()}
    </>
  );
};

export default Filter;
