import React, { FC, memo } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import classes from './modal-complete.module.scss';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onPrint: () => void;
  onReturn: () => void;
}

const ModalComplete: FC<Props> = (props) => {
  const { isOpen, onClose, onPrint, onReturn } = props;
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
      title="Scorecard Complete">
      <div className={classes.description}>{'Thank you for submitting your scorecard.'}</div>
      <div className={cx(classes.wrapButton, classes.bottomRight)}>
        <Button className={classes.btnSubmit} onClick={onPrint}>
          Print Scorecard
        </Button>
        <Button className={classes.btnCancel} buttonType="outline" onClick={onReturn} style={{ marginLeft: 20 }}>
          Return to Partner Portal
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalComplete);
