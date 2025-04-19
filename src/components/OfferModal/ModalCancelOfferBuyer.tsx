import React, { FC, useState, useCallback } from 'react';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import { toastError } from 'helpers/utils.helper';
import { CANCEL_KEY } from 'helpers/request/request';
import { useDispatch } from 'react-redux';
import Select from '@ui/Select/Select';
import { UpdateOfferModel } from 'model/api/account/personal/offers.model';
import { updateOffer } from 'api/account/personal/offers.api';
import { StatusName, ReasonCancelOptions, UpdateOfferType } from 'constants/offer';
import { Option } from 'react-select/src/filters';
import classes from './modal.module.scss';

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  handleUpdateOffer: (params: UpdateOfferModel) => void;
}
const ModalCancelOfferBuyer: FC<Props> = ({ openModal = false, handleUpdateOffer, handleCloseModal }) => {
  const [reason, setReason] = useState<string>('');

  const handleCancelOffer = useCallback(() => {
    handleUpdateOffer({ status: StatusName.CANCELLED, typeUpdate: UpdateOfferType.Cancel });
  }, [handleUpdateOffer]);

  return (
    <ModalComponent
      isOpen={openModal}
      onClose={() => handleCloseModal()}
      contentClassName={classes.resizeModal}
      title="Cancel Your Offer"
      footer={
        <div className={classes.groupFooter}>
          <Button buttonSize="s" buttonType="danger" onClick={() => handleCancelOffer()} className={classes.btnCancel}>
            Cancel My Offer
          </Button>
          <Button buttonSize="s" buttonType="outline" onClick={() => handleCloseModal()}>
            Cancel
          </Button>
        </div>
      }>
      <div className={classes.contentModal}>
        <div>Are you sure you want to cancel your offer? This cannot be undone.</div>
      </div>
    </ModalComponent>
  );
};

export default ModalCancelOfferBuyer;
