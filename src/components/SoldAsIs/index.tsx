import React, { FC } from 'react';
import { checkExistLocalStorage, isStoreBike } from 'helpers/utilities.helper';
import cx from 'classnames';
import classes from './sold-as-is.module.scss';

interface Props {
  classNames?: any;
}

const SoldAsIs: FC<Props> = ({ classNames }) => {
  const isBicycleOutlet: boolean =
    process.browser && checkExistLocalStorage() && localStorage?.getItem('loggedStorefront')
      ? isStoreBike() === localStorage.getItem('loggedStorefront')
      : false;

  return <>{isBicycleOutlet && <div className={cx(classes._imgSoldAsIsCardView, classNames)}>Sold as-is</div>}</>;
};

export default SoldAsIs;
