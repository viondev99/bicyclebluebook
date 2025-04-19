import React, { FC, HtmlHTMLAttributes } from 'react';
import cx from 'classnames';

const Divider: FC<HtmlHTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...other } = props;
  return <div className={cx('divider', className)} {...other} />;
};

export default Divider;
