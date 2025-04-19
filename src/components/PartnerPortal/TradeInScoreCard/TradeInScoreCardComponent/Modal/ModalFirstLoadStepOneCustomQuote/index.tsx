/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo } from 'react';
import classes from './modal-first-load-custom-quote.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalFirstLoadStepOneCustomQuote: FC<Props> = ({ isOpen, onClose }) => {
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
      title={``}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapFormItem}>
          <div className={classes.titleForm}>
            Custom Quote Scorecards are for bikes not in our system or have modifications other than the wheelset and/or
            drivetrain. To include wheel and drivetrain upgrades in the trade-in value, be sure to use the
            upgrade/downgrade buttons in the standard scorecard.
          </div>
        </div>
        <div className={classes.wrapBottom}>
          <Button className={classes.customButtonSize} onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalFirstLoadStepOneCustomQuote);
