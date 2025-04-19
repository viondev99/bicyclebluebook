import React, { FC } from 'react';
import CheckBox from '@ui/CheckBox';
import cx from 'classnames';
import SafeImage from 'components/Image/SafeImage';
import { ItemTypeBike } from 'constants/bike-finder';
import classes from '../step.module.scss';

import bgBike from '../../../../../assets/img/trade-in/bg_bike.png';

interface Props {
  typeBike: ItemTypeBike;
  bikeIsChecked: boolean;
  handleCheckBike: (name: string) => void;
  isDisabled: boolean;
}

const ItemBikeType: FC<Props> = ({ typeBike, bikeIsChecked, handleCheckBike, isDisabled }) => {
  return (
    <div className={classes.customCard} key={typeBike.name} onClick={() => handleCheckBike(typeBike?.name)}>
      <SafeImage src={typeBike?.img || bgBike} alt="img bike" className={classes.imgCard} />
      <div
        className={cx(classes.contentCard, {
          [classes.isActive]: bikeIsChecked,
        })}>
        <div className={classes.headerCard}>
          <div className={classes.titleCard}>{typeBike?.title}</div>
          <CheckBox
            checked={bikeIsChecked}
            name={'listTypes'}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              e.stopPropagation();
            }}
            className={cx(classes.checkbox, {
              [classes.disabledCheckbox]: isDisabled,
            })}
          />
        </div>
        <div className={classes.introduction}>{typeBike.description}</div>
      </div>
    </div>
  );
};
export default ItemBikeType;
