import React, { FC, ReactNode, ReactType, useCallback, ReactElement } from 'react';
import { Modal as BaseModal, ModalProps, ModalHeader, ModalBody, ModalFooter, ModalHeaderProps } from 'reactstrap';
import cx from 'classnames';
import _isEmpty from 'lodash/isEmpty';

import iconClose from '../../../assets/img/modal/ic_close.svg';

export interface Props extends ModalProps {
  footer?: ReactNode;
  onClose: Function;
  header?: ReactElement;
  closeable?: boolean;
  headerTag?: string | ReactType;
  headerClassName?: string;
  bodyClassName?: string;
  headerProps?: ModalHeaderProps;
  footerClassName?: string;
  showClose?: boolean;
}

const Modal: FC<Props> = (props) => {
  const {
    className,
    isOpen,
    children,
    title,
    footer,
    onClose,
    header,
    headerTag = 'h3',
    showClose = true,
    centered = true,
    closeable = true,
    contentClassName = '',
    headerClassName = '',
    bodyClassName = '',
    footerClassName = '',
    headerProps = {},
    ...other
  } = props;

  const onClickClose = useCallback(() => {
    if (closeable) {
      onClose();
    }
  }, [closeable, onClose]);
  if (closeable && _isEmpty(headerProps) && showClose) {
    const closeBtn = (
      <button className={cx('close_btn')} onClick={onClickClose} type="button">
        <img className={'close_icon'} src={iconClose} alt="Close icon" />
      </button>
    );
    headerProps.close = closeBtn;
  }

  return (
    <BaseModal
      className={cx('modal_container', className)}
      isOpen={isOpen}
      toggle={onClickClose}
      centered={centered}
      contentClassName={cx('modal_container__content', contentClassName)}
      {...other}>
      {header ? (
        <ModalHeader tag={'div'} {...headerProps}>
          {header}
        </ModalHeader>
      ) : (
        <ModalHeader {...headerProps} className={cx('modal_container__header', headerClassName)} tag={headerTag}>
          {title ?? ''}
        </ModalHeader>
      )}
      <ModalBody className={cx(bodyClassName)}>{children}</ModalBody>
      {footer ? <ModalFooter className={cx('modal_container__footer', footerClassName)}>{footer}</ModalFooter> : null}
    </BaseModal>
  );
};

export default Modal;
