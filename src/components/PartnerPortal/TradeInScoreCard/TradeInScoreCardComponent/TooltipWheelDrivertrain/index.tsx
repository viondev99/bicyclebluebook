/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC } from 'react';
import classes from './tooltip-wheel-drivertrain.module.scss';
import images from '@images';

interface Props {
  onClick: () => void;
}

const TooltipWheelDrivertrain: FC<Props> = ({ onClick }) => {
  return (
    <>
      <div className={classes.wrapTooltipWheelDrivertrain}>
        <img src={images.account.partner.icTooltip} alt="" onClick={onClick} />
      </div>
    </>
  );
};

export default TooltipWheelDrivertrain;
