import React, { FC, TextareaHTMLAttributes, ReactElement } from 'react';
import cx from 'classnames';

export interface Props {
  isError?: boolean;
}

const Textarea: FC<TextareaHTMLAttributes<any> & Props> = (props) => {
  const { isError = false, className, ...other } = props;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(
        'textarea',
        {
          error: isError,
        },
        className,
      )}>
      <textarea {...other} />
    </div>
  );
};

export default Textarea;
