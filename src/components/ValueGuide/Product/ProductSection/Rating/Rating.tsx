import React, { FC } from 'react';
import images from 'assets/images';
import BaseRating, { RatingComponentProps } from 'react-rating';
import cx from 'classnames';
import classes from './rating.module.scss';

interface Props extends RatingComponentProps {}

const Rating: FC<Props> = (props) => {
  return (
    <BaseRating
      {...props}
      emptySymbol={<img src={images.valueGuide.icStarGrey} className={classes.icon} alt={'Empty Star'} />}
      fullSymbol={<img src={images.valueGuide.icStar} className={classes.icon} alt={'Full Star'} />}
      className={cx(classes.rating, props.className)}
    />
  );
};

export default Rating;
