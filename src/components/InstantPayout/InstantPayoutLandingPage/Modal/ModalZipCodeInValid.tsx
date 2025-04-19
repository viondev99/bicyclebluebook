import React, { FC } from 'react';
import Link from 'next/link';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import classes from './modal.module.scss';

interface Props {
  onClose: () => void;
  open: boolean;
}

const ModelZipCodeInValid: FC<Props> = ({ onClose, open }) => {
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      header={<div />}
      className={classes.modal}
      contentClassName={classes.contentZipCodeModal}>
      <>
        {/* <div className="d-block d-sm-none">
          <MobileModalHeader onClose={onClose} />
        </div> */}
        <div className={classes.title}>Sorry, currently not available in your area</div>
        <div className={classes.content}>
          Instant Payout is not currently available in your area. We apologize, but you can still sell your bike on our
          marketplace or trade in at your local partner.
        </div>
        <div className={cx(classes.footerModal, 'd-flex')}>
          <div>
            <Link href="/sell-tradein/">
              <Button buttonType="primary" className={classes.btnSell}>
                Sell on the Marketplace
              </Button>
            </Link>
            <Link href="/trade-in/request/">
              <Button buttonType="primary">Trade in</Button>
            </Link>
          </div>
          <Button buttonType={'outline'} onClick={onClose} className={classes.btnCancel}>
            Exit
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default ModelZipCodeInValid;
