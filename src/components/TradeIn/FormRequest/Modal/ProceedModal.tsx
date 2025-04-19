import React, { FC, memo, useMemo } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import classes from '../form-request.module.scss';

interface Props {
  isOpen: boolean;
  bicycleType?: string;
  onProceed: () => void;
  onClose: () => void;
  TVfairCondition?: number;
}

const ProceedModal: FC<Props> = (props) => {
  const { isOpen, bicycleType, onProceed, onClose, TVfairCondition } = props;

  const renderDesModal = useMemo(() => {
    if (bicycleType === 'Kids') {
      return `Bicycle Blue Book is no longer accepting kids bikes through our trade-in program. We apologize for any
      inconvenience this may cause.`;
    }
    if (bicycleType === 'E-Bike') {
      return `Bicycle Blue Book is no longer accepting E-Bikes through our trade-in program. We apologize for any
        inconvenience this may cause.`;
    }
    if (TVfairCondition < 400) {
      return `Bikes with a trade-in value below $400 are not eligible for the Bicycle Blue Book trade-in program. We
      apologize for any inconvenience this may cause.`;
    }
    return `Please only continue with the trade in process if you are happy with your valuation and intend to trade in
    the bike at your nearest partner. However, this does not mean you are required to complete the trade in if
    you change your mind later.`;
  }, [TVfairCondition, bicycleType]);

  const renderTitleModal = useMemo(() => {
    if (bicycleType === 'Kids' || bicycleType === 'E-Bike') {
      return 'Not eligible for trade in';
    }
    if (TVfairCondition < 400) {
      return 'Not eligible for trade in';
    }
    return 'Proceed with trade in?';
  }, [TVfairCondition, bicycleType]);

  const renderButton = useMemo(() => {
    if (bicycleType === 'Kids' || bicycleType === 'E-Bike') {
      return null;
    }
    if (TVfairCondition < 400) {
      return null;
    }
    return (
      <div className={classes.buttonGroup}>
        <Button type="button" buttonType="primary" onClick={onProceed}>
          Proceed
        </Button>
        <Button type="button" buttonType="outline" onClick={onClose} style={{ marginLeft: 20 }}>
          Cancel
        </Button>
      </div>
    );
  }, [TVfairCondition, bicycleType, onClose, onProceed]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} centered={true} className={classes.proceedModal} title={renderTitleModal}>
      <div className={classes.description}>{renderDesModal}</div>
      {renderButton}
    </Modal>
  );
};

export default memo(ProceedModal);
