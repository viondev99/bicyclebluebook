/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo } from 'react';
import classes from './modal-oversize.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalOverSize: FC<Props> = ({ isOpen, onClose, onSubmit }) => {
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
      title={`Oversized Box`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapFormItem}>
          <div className={classes.titleForm}>
            You're shipment exceeds the UPS maximum dimensional size of 130" inches, which is calculated by(2 x Height)
            + (2 x Width) + Length. A UPS surcharge of $35 will be applied to this shipment. BicycleBlueBook.com can
            provide standard size boxes which measure 54x8x30 for $15/box with a minimum order of 10. Please contact us
            to order.
          </div>
        </div>
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

export default memo(ModalOverSize);
