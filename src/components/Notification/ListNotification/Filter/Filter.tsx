import React, { FC, useCallback } from 'react';
import cx from 'classnames';

import CheckBox from '@ui/CheckBox';
import classes from './filter.module.scss';

interface Props {
  filters: {
    [key: string]: boolean;
  };
  handleChange: (key: string, value: boolean) => void;
}

const Filter: FC<Props> = ({ filters, handleChange }) => {
  const renderContent = useCallback(() => {
    return (
      <div className={cx(classes.container, 'd-none', 'd-md-block')}>
        <h4>Show</h4>
        {Object.keys(filters).map((item) => (
          <div className={classes.checkbox} key={item}>
            <CheckBox
              checked={!!filters[item]}
              label={<div className={classes.label}>{item}</div>}
              onChange={() => handleChange(item, !filters[item])}
            />
          </div>
        ))}
      </div>
    );
  }, [filters, handleChange]);

  const renderContentMobile = useCallback(() => {
    return (
      <div className={cx(classes.mobileContainer, 'd-block', 'd-md-none')}>
        {Object.keys(filters).map((item) => (
          <div className={classes.checkbox} key={item}>
            <div className={classes.label}>{item}</div>
            <CheckBox checked={!!filters[item]} onChange={() => handleChange(item, !filters[item])} />
          </div>
        ))}
      </div>
    );
  }, [filters, handleChange]);

  return (
    <>
      {renderContent()}
      {renderContentMobile()}
    </>
  );
};

export default Filter;
