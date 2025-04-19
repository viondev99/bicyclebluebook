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

const ModalPermission: FC<Props> = (props) => {
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
      title={`You don't have permission to access this resource`}>
      <div className={cx(classes.wrapBody, 'text-center')}>
        <Button className={classes.buttonInfo} onClick={gotoCreateOnStore}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalPermission);
