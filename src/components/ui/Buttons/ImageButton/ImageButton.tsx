import React, { FC } from 'react';
import cx from 'classnames';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  clear?: boolean;
}

const ImageButton: FC<Props> = (props) => {
  const { className, clear, ...other } = props;
  return <button type={'button'} className={cx('img-button', { clear }, className)} {...other} />;
};

export default ImageButton;
