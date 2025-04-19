import React, { FC, useState, useCallback } from 'react';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import Textarea from '@ui/Textarea';

import { UpdateOfferModel } from 'model/api/account/personal/offers.model';
import { StatusName, UpdateOfferType } from 'constants/offer';
import classes from './modal.module.scss';

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  handleUpdateOffer: (params: UpdateOfferModel) => void;
}
const ModalRejectOffer: FC<Props> = ({ openModal = false, handleCloseModal, handleUpdateOffer }) => {
  const [message, setReason] = useState<string>('');

  const updateOffer = useCallback(() => {
    handleUpdateOffer({ status: StatusName.REJECTED, message, typeUpdate: UpdateOfferType.Reject });
    handleCloseModal();
  }, [handleCloseModal, handleUpdateOffer, message]);

  return (
    <ModalComponent
      isOpen={openModal}
      onClose={() => handleCloseModal()}
      contentClassName={classes.resizeModal}
      footer={
        <div className={classes.groupBtnModal}>
          <Button buttonSize="s" buttonType="outline" onClick={() => handleCloseModal()} className={classes.btnNo}>
            No
          </Button>
          <Button buttonSize="s" buttonType="primary" onClick={() => updateOffer()} className={classes.btnYes}>
            Yes
          </Button>
        </div>
      }>
      <div className={classes.contentModal}>
        <div>Are you sure want to reject this offer?</div>
        <div>
          <Textarea
            rows={4}
            className={classes.inputCounter}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
        </div>
      </div>
    </ModalComponent>
  );
};

export default ModalRejectOffer;
