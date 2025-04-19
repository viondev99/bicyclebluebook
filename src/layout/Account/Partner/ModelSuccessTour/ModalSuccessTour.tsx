/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useMemo } from 'react';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import icSpaceShip from 'assets/img/account/partner/ic_spaceship.svg';
import classes from './model-success-tour.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleActionTour: () => void;
}

const ModalSuccessTour: FC<Props> = ({ isOpen, onClose, handleActionTour }) => {
  const renderHeader = useMemo(() => {
    return (
      <div className={cx(classes.wrapHeader)}>
        <div className={classes.cover}>
          <div className={classes.wrapImage}>
            <img src={icSpaceShip} alt="spaceship" />
            <div className={classes.planet1} />
            <div className={classes.planet2} />
          </div>
          <div className={classes.planet3} />
          <div className={classes.planet4} />
        </div>
      </div>
    );
  }, []);

  const renderBody = useMemo(() => {
    return (
      <div className={classes.wrapBody}>
        <h1 className={classes.title}>That’s it!</h1>
        <p className={classes.textContent}>
          We hope you found this helpful but if there’s anything else we can help with, get in touch.
        </p>
        <div className={classes.wrapBtn}>
          <Button className={classes.btnTakeTheTour} onClick={onClose}>
            Go to Dashboard
          </Button>
        </div>
        <div className={classes.btnNoThanks}>
          <span className={classes.pointer} onClick={handleActionTour}>
            Repeat Tour
          </span>
        </div>
      </div>
    );
  }, [handleActionTour, onClose]);

  return (
    <div className={classes.wrapModel}>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        className={classes.modal}
        contentClassName={classes.content}
        bodyClassName={classes.body}
        showClose={false}
        header={<>{renderHeader}</>}>
        {renderBody}
      </Modal>
    </div>
  );
};

export default ModalSuccessTour;
