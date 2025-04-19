import React, { FC, ReactElement } from 'react';
import cx from 'classnames';
import images from 'assets/images';
import Card from '@ui/Cards';
import classes from './section.module.scss';

interface Props {
  children: ReactElement;
  title?: string;
  isActive: boolean;
  isComplete?: boolean;
  className?: string;
}

const WrapSection: FC<Props> = ({ children, title, isActive = false, isComplete = false, className }) => {
  return (
    <Card className={cx(classes.wrapSection, { [classes.isActive]: isActive }, className)}>
      {title && (
        <div className={classes.subTitle}>
          <img src={isComplete ? images.iconTickSuccess : images.common.iconTickGray} alt="icon tick" />
          {title}
        </div>
      )}
      <div>{children}</div>
    </Card>
  );
};

export default WrapSection;
