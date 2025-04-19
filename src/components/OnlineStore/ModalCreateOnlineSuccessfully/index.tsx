import React, { FC, memo, useCallback } from 'react';

import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { useRouter } from 'next/router';
import classes from './modal-create-online-successfully.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateOnlineSuccessfully: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  const gotoCreateOnStore = useCallback(() => {
    onClose();
    router.push(`/trade-in-account/my-account/profile`);
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
      hideButtonClose={true}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Create online store successfully`}>
      <div className={classes.wrapFormItem}>
        <div className={classes.titleForm}>
          Your Online Store is waiting to accept. One of out trade in experts will be reviewing your application and
          will follow up within two business days
        </div>
      </div>
      <div className={cx(classes.wrapBody, 'text-center')}>
        <Button className={classes.buttonInfo} onClick={gotoCreateOnStore}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalCreateOnlineSuccessfully);
