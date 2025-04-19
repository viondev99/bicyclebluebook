import React from 'react';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import classes from './overviewSection.module.scss';
import { safelySetHtml } from '../../../../../../helpers/html.helper';

const OverViewSection = () => {
  const detail = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.bicycle);

  return (
    <div className={'my-5'}>
      <div
        className={classes.paragraph}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: safelySetHtml(detail?.description || 'No data available.'),
        }}
      />
    </div>
  );
};

export default OverViewSection;
