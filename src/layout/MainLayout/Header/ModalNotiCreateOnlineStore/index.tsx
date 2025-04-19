import React, { FC, memo, useCallback } from 'react';

import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { useRouter } from 'next/router';
import classes from './modal-permission.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNotiCreateOnlineStore: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const gotoCreateOnStore = useCallback(() => {
    onClose();
    router.push(`/trade-in-account/my-account/profile/create-online-store`);
  }, [onClose, router]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}>
      <div className={cx(classes.wrapBody, 'text-center')}>
        <div className={classes.titleBody}>Please create Online Store to sell your bike</div>
        <Button className={classes.buttonInfo} onClick={gotoCreateOnStore}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalNotiCreateOnlineStore);
