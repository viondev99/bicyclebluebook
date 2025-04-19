import React, { FC } from 'react';
import cx from 'classnames';
import iconClose from 'assets/img/modal/ic_close.svg';
import classes from './mobile-fullscreen-modal.module.scss';
import MobileModalHeader from './MobileModalHeaderCommon';
import Modal, { Props as ModalProps } from './index';
import Button from '../Buttons/Primary/Button';

export interface Props extends Omit<ModalProps, 'title'> {
  title: string | undefined | JSX.Element;
}

const MobileFullScreenModal: FC<Props> = ({ children, title, onClose, isOpen, className, contentClassName }) => {
  const renderHeader = () => {
    return (
      <>
        <div className="d-flex flex-column flex-md-row align-items-center w-100">
          <h2 className={classes.title}>{title}</h2>

          <Button
            className={cx('close_btn', 'ml-auto d-none d-md-block')}
            onClick={() => onClose()}
            buttonType="transparent">
            <img className={'close_icon'} src={iconClose} alt="Close icon" />
          </Button>
        </div>
        <div className="d-block d-md-none">
          <MobileModalHeader onClose={() => onClose()} className={classes.modalCloseBtn} />
        </div>
      </>
    );
  };
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      className={cx(classes.modal, className)}
      contentClassName={cx(classes.content, contentClassName)}
      bodyClassName={classes.body}
      showClose={false}
      header={<>{renderHeader()}</>}>
      {children}
    </Modal>
  );
};

export default MobileFullScreenModal;
