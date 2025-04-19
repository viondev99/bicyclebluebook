/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { ReactElement, FC, memo } from 'react';
import cx from 'classnames';
import { ModalProps, ModalHeaderProps, ModalBodyProps, Modal as BaseModal, ModalHeader, ModalBody } from 'reactstrap';
import icArrowLeftBlack from 'assets/img/messages/ic_arrow_left_black.svg';
import iconClose from 'assets/img/modal/ic_close.svg';
import iconBack from 'assets/img/register/ic_back.svg';

import ImageButton from '../Buttons/ImageButton/ImageButton';

// @ts-ignore
interface Props extends ModalProps {
  title?: string | ReactElement;
  fullHeight?: boolean;
  onClose: () => void;
  header?: ReactElement;
  headerProps?: ModalHeaderProps;
  bodyProps?: ModalBodyProps;
  hideToggle?: boolean;
  isHeader?: boolean;
}

const Modal: FC<Props> = (props) => {
  const {
    className,
    contentClassName,
    titleClassName,
    title,
    headerProps,
    header,
    bodyProps,
    onClose,
    hideButtonClose,
    showImageLeft,
    showButtonCloseXBlackLeft,
    icArrowLeftClassName,
    hideToggle,
    isHeader,
    ...other
  } = props;

  return (
    <BaseModal
      toggle={!hideToggle && onClose}
      {...other}
      className={cx('baseModal', className)}
      contentClassName={cx('modalContent', contentClassName)}>
      <ModalHeader
        tag={'div'}
        {...headerProps}
        className={cx(isHeader ? 'notHeader' : 'modalHeader', headerProps?.className)}>
        {header !== undefined ? (
          header
        ) : (
          <>
            <h2 className={titleClassName}>{title}</h2>
            {showImageLeft && (
              <img onClick={onClose} className={icArrowLeftClassName} src={icArrowLeftBlack} alt={'close-icon'} />
            )}
            {showButtonCloseXBlackLeft && (
              <img
                onClick={onClose}
                className={icArrowLeftClassName}
                src={icArrowLeftBlack}
                alt={'close-icon'}
                style={{ marginBottom: 30 }}
              />
            )}
            {!hideButtonClose && (
              <ImageButton className={'buttonClose'} clear={true} onClick={onClose}>
                <img className={cx('d-none', 'd-md-block')} src={iconClose} alt={'close-icon'} />
                <img className={cx('d-block', 'd-md-none')} src={iconBack} alt={'close-icon'} />
              </ImageButton>
            )}
          </>
        )}
      </ModalHeader>
      <ModalBody {...bodyProps}>{props.children}</ModalBody>
    </BaseModal>
  );
};

export default memo(Modal);
