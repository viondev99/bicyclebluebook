import React, { FC } from 'react';
import Modal from '@ui/Modal/Modal';

import classes from './cart-item.module.scss';
import Button from '@ui/Buttons/Primary/Button';

interface Props {
  onClose: () => void;
  open: boolean;
  onDelete: () => void;
}

const ModelConfirmDelete: FC<Props> = ({ onClose, onDelete, open }) => {
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      className={classes.deleteModal}
      contentClassName={classes.contentDeleteModal}
      header={<h4>Are you sure you want to remove this item from your cart?</h4>}>
      <div className="d-flex">
        <Button onClick={onDelete}>Remove</Button>
        <Button buttonType={'outline'} className="ml-3" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ModelConfirmDelete;
