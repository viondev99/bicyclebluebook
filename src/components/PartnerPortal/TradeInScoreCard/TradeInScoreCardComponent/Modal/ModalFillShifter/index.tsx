/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo } from 'react';
import classes from './modal-fill-shifter.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  shifterValue?: string;
}

const ModalFillShifter: FC<Props> = ({ isOpen, onClose, onSubmit, shifterValue }) => {
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
      title={`Are all components ${shifterValue || ''}?`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapFormItem}>
          <div className={classes.titleForm}>If yes, enter the same for each component.</div>
        </div>
        <div className={classes.wrapBottom}>
          <Button buttonType="success" className={classes.customButtonSize} onClick={onSubmit}>
            Yes
          </Button>
          <Button buttonType="danger" className={classes.customButtonSize} onClick={onClose}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalFillShifter);
