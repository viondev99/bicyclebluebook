import React, { FC, memo } from 'react';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './modal-save-as-quote.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalSuccessSaveAsQuote: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
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
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Scorecard saved`}>
      <div className={classes.wrapFormItem}>
        <p>Your quote has been saved. You can find it in your scorecard history.</p>
        <p className={classes.textNote}>This quote will expire in 7 days.</p>
      </div>
    </Modal>
  );
};

export default memo(ModalSuccessSaveAsQuote);
