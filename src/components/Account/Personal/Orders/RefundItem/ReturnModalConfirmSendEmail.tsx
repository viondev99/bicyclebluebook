import React, { FC, memo } from 'react';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './refund-item-modal.module.scss';

interface Props {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
  name: string;
}

const ReturnModalConfirmSendEmail: FC<Props> = (props) => {
  const { isOpen, onSubmit, onClose, name } = props;

  return (
    <Modal
      className={classes.returnItemModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className={classes.title}>
          Would you like to email a copy of the shipping label to <span>{name}</span> ?
        </div>
      }>
      <div className={classes.groupButton}>
        <Button buttonType={'outline'} buttonSize={'m'} onClick={onClose}>
          Cancel
        </Button>
        <Button buttonType={'primary'} buttonSize={'m'} onClick={onSubmit}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ReturnModalConfirmSendEmail);
