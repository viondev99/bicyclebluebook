import React, { FC, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import images from 'assets/images';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import classes from './backButton.module.scss';

interface Props {
  onClick: MouseEventHandler;
}

const BackButton: FC<ButtonHTMLAttributes<HTMLButtonElement> & Props> = (props) => {
  const { onClick } = props;

  return (
    <div className={classes.container}>
      <Button onClick={onClick} buttonType="transparent" buttonSize="s">
        <img src={images.iconBack} alt="Icon Back" />
        <span className={cx(classes.text)}>Back</span>
      </Button>
    </div>
  );
};

export default BackButton;
