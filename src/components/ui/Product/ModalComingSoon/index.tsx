import React, { FC, useCallback } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import { useDispatch } from 'react-redux';
import marketplaceAction from 'store/marketplace/marketplace.action';
import Modal from '../../Modal/Modal';
import classes from './modalComingSoon.module.scss';

interface Props {
  open?: boolean;
  onClose?: () => void;
  masterListingId?: number;
  id?: number;
}

const NotifyComingSoonModal: FC<Props> = ({ onClose, open, id, masterListingId }) => {
  const dispatch = useDispatch();

  const handleSelectYes = useCallback(async () => {
    const payload = {
      id: id || masterListingId,
      isNotify: true,
    };
    await dispatch(marketplaceAction.addToFavourite(payload));
    onClose();
  }, [dispatch, id, masterListingId, onClose]);

  const handleSelectNo = useCallback(async () => {
    const payload = {
      id: id || masterListingId,
      isNotify: false,
    };
    await dispatch(marketplaceAction.addToFavourite(payload));
    onClose();
  }, [dispatch, id, masterListingId, onClose]);

  return (
    <Modal
      onClose={onClose}
      isOpen={open}
      centered={true}
      isHeader
      // title="Would you like to be notified when the bike is relisted and ready for sale?"
      contentClassName={classes.modalContent}
      headerClassName={classes.headerModal}
      bodyClassName={classes.bodyModal}
      className={classes.containerModal}>
      <div className={classes.content}>
        Would you like to receive an email when this bike is available for purchase?
      </div>
      <div className={classes.groupBtn}>
        <Button className={classes.btnYes} onClick={handleSelectYes}>
          Yes, notify me
        </Button>
        <Button className={classes.btnNo} onClick={handleSelectNo}>
          No, just save to favorites
        </Button>
      </div>
    </Modal>
  );
};

export default NotifyComingSoonModal;
