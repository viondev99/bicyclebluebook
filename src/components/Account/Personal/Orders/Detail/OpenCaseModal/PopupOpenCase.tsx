import React, { FC, memo } from 'react';
import cx from 'classnames';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './open-case-modal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: () => void;
}

const PopupOpenCase: FC<Props> = (props) => {
  const { isOpen, onClose, onOpenModal } = props;

  return (
    <Modal className={classes.popupOpenCase} centered={true} isOpen={isOpen} onClose={onClose}>
      <p className={classes.textTitle}>
        Have you requested a refund from the seller? Please try to resolve with the seller before opening a case.
      </p>
      <div>
        <Button disabled={!isOpen} className={classes.button} buttonSize={'m'} type={'submit'} onClick={onClose}>
          Request a Refund
        </Button>
        <Button
          disabled={!isOpen}
          className={cx(classes.btnOpenCase, 'clear')}
          buttonSize={'m'}
          type={'submit'}
          onClick={onOpenModal}>
          Open a Case
        </Button>
      </div>
    </Modal>
  );
};

export default memo(PopupOpenCase);
