import React, { FC } from 'react';
import Modal from '@ui/Modal';
import classes from './wish-list-added-modal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WishListAddedModal: FC<Props> = ({ onClose, isOpen }) => {
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      title={'Added to wishlist'}
      contentClassName={classes.content}
      bodyClassName={classes.modalBody}>
      Thank you! We will email if this bike is listed in our marketplace. Until then, please browse our current
      selection.
    </Modal>
  );
};

export default WishListAddedModal;
