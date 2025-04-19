import React, { FC, memo } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import classes from './modal-confirm-change.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSubmit: () => void;
}

const ModalConfirmChange: FC<Props> = (props) => {
  const { isOpen, onClose, onSubmit, title, description } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmCustom}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={title}>
      <div className={classes.description}>{description}</div>
      <div className={cx(classes.wrapButton, classes.bottomRight)}>
        <Button className={classes.btnSubmit} onClick={onSubmit}>
          Continue
        </Button>
        <Button className={classes.btnCancel} buttonType="outline" onClick={onClose} style={{ marginLeft: 20 }}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalConfirmChange);
