import React, { FC, memo, useCallback } from 'react';
import icErrorRed from 'assets/img/common/ic_error_red.svg';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './confirm-stripe-modal.module.scss';

interface Props {
  isOpen: boolean;
  onConnect: () => void;
  onClose: () => void;
}

const ConfirmStripeModal: FC<Props> = (props) => {
  const { isOpen, onConnect, onClose } = props;

  const onConnectStripe = useCallback(() => {
    onConnect();
    onClose();
  }, [onConnect, onClose]);

  return (
    <Modal
      className={classes.confirmStripeModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      title={'Connect Stripe Account'}>
      <div className={classes.description}>
        If you want to create a new listing, please connect Stripe account to support payment.
      </div>
      <div className={classes.warning}>
        <img src={icErrorRed} alt={'error'} /> WARNING: Please don't close this tab until connect successfully Stripe
        account
      </div>
      <div className={classes.groupButton}>
        <Button buttonType={'outline'} buttonSize={'m'} onClick={onClose}>
          Cancel
        </Button>
        <Button buttonType={'primary'} buttonSize={'m'} onClick={onConnectStripe}>
          Connect
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ConfirmStripeModal);
