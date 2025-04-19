import React, { forwardRef, ForwardRefRenderFunction, MutableRefObject, useEffect } from 'react';
import cx from 'classnames';

import { invariant } from 'helpers/common.helper';

export enum ButtonType {
  Success = 'success',
  Primary = 'primary',
  Secondary = 'secondary',
  Danger = 'danger',
  Warning = 'warning',
  Outline = 'outline',
  Transparent = 'transparent',
  Clear = 'clear',
  Recent = 'recent',
}

export enum ButtonSize {
  Large = 'l',
  Medium = 'm',
  Small = 's',
  ExtraLarge = 'xl',
}

interface Props extends React.ButtonHTMLAttributes<any> {
  buttonType?:
    | ButtonType
    | 'success'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'outline'
    | 'transparent'
    | 'clear'
    | 'recent';
  buttonSize?: 'l' | 'm' | 's' | 'xl';
  size?: 'l' | 'm' | 's' | 'xl';
  isLoading?: boolean;
  innerRef?: MutableRefObject<HTMLButtonElement>;
}

const Button: ForwardRefRenderFunction<HTMLButtonElement, Props> = (props, ref) => {
  const {
    buttonType = 'primary',
    size,
    buttonSize = size || 'm',
    children,
    className,
    innerRef,
    isLoading,
    disabled,
    ...other
  } = props;

  useEffect(() => {
    invariant(!size, 'Property size is deprecate, please use buttonSize instead');
  }, [size]);

  return (
    <button
      type={'button'}
      ref={innerRef || ref}
      disabled={disabled}
      className={cx(
        'button',
        { button_loading: isLoading },
        {
          success: buttonType === ButtonType.Success,
          primary: buttonType === ButtonType.Primary,
          secondary: buttonType === ButtonType.Secondary,
          danger: buttonType === ButtonType.Danger,
          warning: buttonType === ButtonType.Warning,
          outline: buttonType === ButtonType.Outline,
          transparent: buttonType === ButtonType.Transparent,
          clear: buttonType === ButtonType.Clear,
          medium: buttonSize === ButtonSize.Medium,
          large: buttonSize === ButtonSize.Large,
          small: buttonSize === ButtonSize.Small,
          recent: buttonType === ButtonType.Recent,
        },
        className,
      )}
      {...other}>
      <div className="d-flex justify-content-center align-items-center">
        {children}
        {isLoading && (
          <div
            className={cx(
              'loading',
              { disabled_loading: disabled },
              {
                large: buttonSize === ButtonSize.Large,
                medium: buttonSize === ButtonSize.Medium,
                small: buttonSize === ButtonSize.Small,
                extraLarge: buttonSize === ButtonSize.ExtraLarge,
              },
            )}
          />
        )}
      </div>
    </button>
  );
};
export default React.memo(forwardRef<HTMLButtonElement, Props>(Button));
