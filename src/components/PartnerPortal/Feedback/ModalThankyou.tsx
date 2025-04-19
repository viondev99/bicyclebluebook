/* eslint-disable react/jsx-key */
import React, { FC, memo, useEffect } from 'react';

import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import { getOriginalBodyPadding, getScrollbarWidth, setScrollbarWidth } from 'helpers/modal.helper';
import classes from './modal-thankyou.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalThankyou: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const { currentWidthScreen } = useScreenDetect();

  useEffect(() => {
    if (isOpen) {
      const originalPadding = getOriginalBodyPadding();
      setScrollbarWidth(getScrollbarWidth());
      document.body.style.maxHeight = '100vh';
      return () => {
        setScrollbarWidth(originalPadding);
        document.body.style.maxHeight = 'unset';
      };
    }
  }, [isOpen, onClose]);

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
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Thank you for your feedback`}>
      <div className={classes.wrapBody}>
        <div className={classes.description}>
          <div className="mb-1">We have received your message.</div>
          <div>We will be in touch with you as soon as possible!</div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalThankyou);
