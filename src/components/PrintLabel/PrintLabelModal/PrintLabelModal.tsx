import React, { useCallback } from 'react';

import { printLabel } from 'helpers/common.helper';
import classes from './print-label-modal.module.scss';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
  link: string | Array<string>;
}

const PrintLabel: React.FC<Props> = ({ isOpen, onClose, link, confirmTitle, cancelTitle }) => {
  const handlePrint = useCallback(() => {
    if (link.length > 0) {
      let newWindow: any = window.open('', '_blank', 'width=1000,height=600');
      printLabel(newWindow, link);
    }
    onClose();
  }, [link, onClose]);

  return (
    <Modal className={classes.printLabelModal} isOpen={isOpen} onClose={onClose} title={'Print label'}>
      <div className={classes.buttonGroup}>
        <Button className={classes.button} buttonType={'outline'} onClick={onClose}>
          {cancelTitle || 'Cancel'}
        </Button>
        <Button className={classes.button} buttonType={'primary'} onClick={handlePrint}>
          {confirmTitle || 'Print'}
        </Button>
      </div>
    </Modal>
  );
};

export default PrintLabel;
