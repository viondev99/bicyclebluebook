import React, { FC } from 'react';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './money-safe-modal.module.scss';

import icLockRounded from '../../../assets/img/common/ic_lock_rounded.svg';
import icTickWhite from '../../../assets/img/trade-in/ic_tick_white.svg';

interface Props {
  show: boolean;
  onClose: () => void;
}

const MoneySafeModal: FC<Props> = (props) => {
  const { show, onClose } = props;

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      centered={true}
      className={classes.moneySafeModal}
      header={
        <div className={classes.header}>
          <img className={classes.icon} src={icLockRounded} alt={'error'} />
          <h2>Your money is safe with us</h2>
        </div>
      }>
      <div className={classes.description}>
        We have now partnered up with Stripe, a reliable payment processing company, as the middle man for our private
        transactions. This means we will hold onto your money when buying from a private seller or store until you
        receive your item. This provides you with the utmost security when shopping with us.
      </div>
      <div className={classes.buttonGroup}>
        <Button buttonType="primary" onClick={onClose}>
          Got it <img style={{ marginLeft: 10 }} src={icTickWhite} alt={'tick-error'} />
        </Button>
      </div>
      <div className={classes.note}>(You won’t see this message again.)</div>
    </Modal>
  );
};

export default MoneySafeModal;
