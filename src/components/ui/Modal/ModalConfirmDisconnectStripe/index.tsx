import React, { FC, memo, useCallback } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import classes from './modal-confirm-disconnect-stripe.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ModalConfirmDisconnectStripe: FC<Props> = (props) => {
  const { isOpen, onClose, onDelete } = props;

  const handleDelete = useCallback(() => {
    onDelete();
    onClose();
  }, [onClose, onDelete]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmDisconnectStripe}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={`Are you sure?`}>
      <div className={classes.description}>{`Are you sure you want to delete the connected account stripe?`}</div>
      <div className={cx(classes.wrapButton, classes.bottomRight)}>
        <Button className={classes.btnCancel} buttonType="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className={classes.btnSubmit} buttonType="danger" onClick={handleDelete} style={{ marginLeft: 20 }}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalConfirmDisconnectStripe);
