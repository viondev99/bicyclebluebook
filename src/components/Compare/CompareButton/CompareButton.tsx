import React, { FC, ReactElement, useCallback } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import { useDispatch } from 'react-redux';

import icCompareAlt from 'assets/img/common/ic_compare_alt.svg';
import icCompare from 'assets/img/common/ic_compare.svg';
import compareAction from '../../../store/compare/compare.action';
import classes from './compare-button.module.scss';
import { useListCompareId } from '../../../hooks/useListCompareId';

interface Props {
  masterListingId: number;
  renderCompareButton?: (context: {
    isCompared: boolean;
    add: () => void;
    remove: () => void;
    toggle: () => void;
  }) => ReactElement;
}

const CompareButton: FC<Props & React.ButtonHTMLAttributes<any>> = ({
  masterListingId,
  renderCompareButton,
  ...other
}) => {
  const dispatch = useDispatch();
  const listCompareId = useListCompareId();
  const isInCompareList = listCompareId.find((a) => a === masterListingId);
  const handleAddCompare = useCallback(() => {
    dispatch(compareAction.addToListCompare(masterListingId));
  }, [dispatch, masterListingId]);
  const handleRemoveCompare = useCallback(() => {
    dispatch(compareAction.removeFromListCompare(masterListingId));
  }, [dispatch, masterListingId]);

  if (renderCompareButton) {
    return renderCompareButton({
      add: handleAddCompare,
      remove: handleRemoveCompare,
      toggle: isInCompareList ? handleRemoveCompare : handleAddCompare,
      isCompared: isInCompareList,
    });
  }

  if (isInCompareList) {
    return (
      <Button buttonType={'transparent'} onClick={handleRemoveCompare} {...other}>
        <img src={icCompareAlt} className={classes.iconButton} alt={'compare'} />
        <span className={'d-none d-xl-inline color-primary'}>Compare</span>
      </Button>
    );
  }

  return (
    <Button buttonType={'transparent'} onClick={handleAddCompare} {...other}>
      <img src={icCompare} className={classes.iconButton} alt={'compare'} />
      <span className={'d-none d-xl-inline'}>Compare</span>
    </Button>
  );
};

export default CompareButton;
