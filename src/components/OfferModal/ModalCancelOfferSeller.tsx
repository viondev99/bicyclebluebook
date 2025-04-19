import React, { FC, useState, useMemo, useCallback } from 'react';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import Textarea from '@ui/Textarea';
import Select from '@ui/Select/Select';
import { UpdateOfferModel } from 'model/api/account/personal/offers.model';
import { StatusName, ReasonCancelOptions, UpdateOfferType } from 'constants/offer';
import { Option } from 'react-select/src/filters';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import classes from './modal.module.scss';

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  handleUpdateOffer: (params: UpdateOfferModel) => void;
}
const ModalCancelOffer: FC<Props> = ({ openModal = false, handleUpdateOffer, handleCloseModal }) => {
  const [reason, setReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');

  const handleCloseAndClearData = useCallback(() => {
    setReason('');
    setOtherReason('');
    handleCloseModal();
  }, [handleCloseModal]);

  const handleCancelOffer = useCallback(() => {
    const reasonCancel = reason !== 'Other' ? reason : otherReason;
    handleUpdateOffer({ status: StatusName.CANCELLED, reasonCancel, typeUpdate: UpdateOfferType.Cancel });
    handleCloseAndClearData();
  }, [handleCloseAndClearData, handleUpdateOffer, otherReason, reason]);

  const isDisabled = useMemo((): boolean => {
    if ((reason && reason !== 'Other') || (reason === 'Other' && otherReason)) {
      return false;
    }
    return true;
  }, [otherReason, reason]);

  return (
    <MobileFullScreenModal
      title={'Cancel Offer'}
      isOpen={openModal}
      onClose={() => handleCloseAndClearData()}
      className={classes.modalContainer}>
      <>
        <div className={classes.contentModal}>
          <div>Please enter your reason for cancelling.</div>
          <div>
            <Select
              inputId={'reason-canceling-offer-seller'}
              className={classes.selectReason}
              options={ReasonCancelOptions}
              value={reason}
              onChange={(v: Option) => setReason(v.value)}
              selectSize={'s'}
            />
          </div>
          {reason === 'Other' && (
            <Textarea
              rows={4}
              className={classes.inputCounter}
              onChange={(e) => {
                setOtherReason(e.target.value);
              }}
            />
          )}
        </div>
        <div className={classes.actions}>
          <Button
            className={classes.btnCancel}
            disabled={isDisabled}
            buttonSize="m"
            buttonType="danger"
            onClick={() => handleCancelOffer()}>
            Cancel Order
          </Button>
          <Button className={classes.btnClear} buttonSize="m" buttonType="outline" onClick={() => handleCancelOffer()}>
            Cancel
          </Button>
        </div>
      </>
    </MobileFullScreenModal>
  );
};

export default ModalCancelOffer;
