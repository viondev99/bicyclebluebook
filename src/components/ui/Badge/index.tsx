import React, { FC } from 'react';
import cx from 'classnames';
import classes from './badge.module.scss';

interface Props {
  name: string;
}

const Badge: FC<React.HTMLAttributes<HTMLDivElement> & Props> = (props) => {
  const { name, className, ...other } = props;
  return <div className={cx(classes.badge, className)}>{name}</div>;
};

export default Badge;
