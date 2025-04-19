/* eslint-disable react/jsx-no-target-blank */
import React, { FC, memo } from 'react';
import Modal from '@ui/Modal/Modal';
import classes from './modal-confirm-delete.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const ModalShowMessageUnconnectGoogleApplePay: FC<Props> = (props) => {
  const { isOpen, onClose, type } = props;

  const renderTextMessage = () => {
    return (
      <>
        {type === 'apple' ? (
          <span>
            You need connect payment card with Apple Pay Wallet first via Apple Store then reload page after several
            minutes.
          </span>
        ) : (
          <span>
            You need connect payment card with Google Pay first via link:{' '}
            <a href="https://pay.google.com/gp/w/u/0/home/paymentmethods" target="_blank">
              https://pay.google.com/gp/w/u/0/home/paymentmethods
            </a>
            {` `}
            then reload page after several minutes.
          </span>
        )}
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmDelete}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={`Warning`}>
      <div className={classes.description}>{renderTextMessage()}</div>
    </Modal>
  );
};

export default memo(ModalShowMessageUnconnectGoogleApplePay);
