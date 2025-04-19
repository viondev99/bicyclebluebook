/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo } from 'react';
import classes from './modal-value-provider.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalValueProvided: FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { currentWidthScreen } = useScreenDetect();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={true}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`This custom quote was provided value!`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapBottom}>
          <Button onClick={onSubmit} className={classes.customButtonSize}>
            Proceed
          </Button>
          <Button buttonType="outline" className={classes.customButtonSize} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalValueProvided);
