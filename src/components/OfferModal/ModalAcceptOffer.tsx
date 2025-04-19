import React, { FC, useCallback } from 'react';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import { StatusName, UpdateOfferType } from 'constants/offer';
import { UpdateOfferModel } from 'model/api/account/personal/offers.model';
import classes from './modal.module.scss';

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  handleUpdateOffer: (params: UpdateOfferModel) => void;
}
const ModalAcceptOffer: FC<Props> = ({ openModal = false, handleCloseModal, handleUpdateOffer }) => {
  const updateOffer = useCallback(() => {
    handleUpdateOffer({ status: StatusName.ACCEPTED, typeUpdate: UpdateOfferType.Accept });
    handleCloseModal();
  }, [handleCloseModal, handleUpdateOffer]);
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
      <div className={classes.contentModal}>Are you sure want to accept this offer?</div>
    </ModalComponent>
  );
};
export default ModalAcceptOffer;
