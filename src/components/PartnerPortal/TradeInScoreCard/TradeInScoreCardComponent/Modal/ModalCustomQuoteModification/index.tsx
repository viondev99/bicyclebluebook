/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import React, { FC, memo, useCallback } from 'react';
import classes from './modal-decline-step-one.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCustomQuoteModification: FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  const gotoCustomQuote = useCallback(() => {
    router.push(`/trade-in-account/trade-in/custom-quote`);
  }, [router]);

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
            Because the original MSRP of this bike is below $500, calculating modifications will require a custom quote.
            Do you want to create a custom quote ?
          </div>
        </div>
        <div className={classes.wrapBottom}>
          <Button buttonType="success" className={classes.customButtonSize} onClick={gotoCustomQuote}>
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

export default memo(ModalCustomQuoteModification);
