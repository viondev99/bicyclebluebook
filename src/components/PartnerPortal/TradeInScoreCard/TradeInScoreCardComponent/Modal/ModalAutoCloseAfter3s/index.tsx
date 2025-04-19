import React, { FC, memo, useEffect } from 'react';
import Modal from '@ui/Modal/Modal';
import { useRouter } from 'next/router';
import classes from './modal-auto-close.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  page: string;
  onRestart?: (isRestartOnly?: boolean) => void;
}

const ModalAutoCloseAfter3s: FC<Props> = (props) => {
  const { isOpen, onClose, title, description, page, onRestart } = props;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      switch (page) {
        case 'standard': {
          router.push(`/trade-in-account/trade-in/new`);
          break;
        }
        case 'custom': {
          router.push(`/trade-in-account/trade-in/custom-quote`);
          onRestart(true);
          break;
        }
        case 'eBike': {
          router.push(`/trade-in-account/trade-in/ebike-quote`);
          break;
        }
        default:
          router.push(`/trade-in-account/trade-in/new`);
          break;
      }

      onClose();
    }, 3000);
  }, [onClose, onRestart, page, router]);

  return (
    <Modal
      hideToggle={true}
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmCustom}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={title}>
      <div className={classes.description}>{description}</div>
    </Modal>
  );
};

export default memo(ModalAutoCloseAfter3s);
