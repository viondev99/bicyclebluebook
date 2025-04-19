import React, { FC, useState, useCallback, useEffect } from 'react';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import { formatCurrency } from 'helpers/string.helper';
import Input from '@ui/Inputs/Input';
import classes from './modal.module.scss';

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  currentOffer?: number;
}
const ModalChangeOffer: FC<Props> = ({ openModal = false, handleCloseModal, currentOffer }) => {
  const [offerPrice, setOfferPrice] = useState<string>('');

  const handleChangeOffer = useCallback(() => {}, []);

  return (
    <ModalComponent
      isOpen={openModal}
      onClose={() => handleCloseModal()}
      contentClassName={classes.resizeModal}
      title="Change Your Offer">
      <div className={classes.contentModal}>
        <div>
          Current offering <span className={classes.price}>{formatCurrency(currentOffer)}</span>
        </div>
        <div className={classes.inputChangeOffer}>
          <span className={classes.title}>New offer</span>
          <Input
            placeholder={'0'}
            type="text"
            value={offerPrice}
            onChange={(e: any) => setOfferPrice(e.target.value)}
          />
        </div>
        <Button buttonSize="s" buttonType="primary" onClick={() => handleChangeOffer()} className={classes.btnYes}>
          Submit Offer
        </Button>
      </div>
    </ModalComponent>
  );
};

export default ModalChangeOffer;
