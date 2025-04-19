import React, { FC, memo, useMemo } from 'react';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './modal-waiting-payment-success.module.scss';

import icLoadingCommon from '../../../../assets/img/home/ic_loading_common.gif';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalWaitingPaymentSuccess: FC<Props> = ({ isOpen, onClose }) => {
  const { currentWidthScreen } = useScreenDetect();

  const renderHeader = useMemo(() => {
    return (
      <div className={classes.wrapHeader}>
        <img src={icLoadingCommon} alt="loadingIcon" width={35} height={35} />
        <h2>Please wait...</h2>
      </div>
    );
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideToggle={true}
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
      header={renderHeader}>
      <div className={classes.description}>Your payment is currently being processed.</div>
      <div className={classes.description}>Do not refresh or close your browser.</div>
    </Modal>
  );
};

export default memo(ModalWaitingPaymentSuccess);
