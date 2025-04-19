import React, { FC, memo } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import classes from '../form-request.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNotExistCondition: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  return (
    <Modal
      header={<div>{` `}</div>}
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      className={classes.proceedModal}
      title={''}>
      <div className={classes.description}>
        We’re sorry, it looks like we don’t currently have a value for this bike. We’re constantly improving our value
        guide. Check back later to see if it’s added. In the meantime browse our Valueguide for similar bikes.
      </div>
      <div className={cx(classes.buttonGroup, classes.bottomRight)}>
        <Button type="button" buttonType="outline" onClick={onClose}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalNotExistCondition);
