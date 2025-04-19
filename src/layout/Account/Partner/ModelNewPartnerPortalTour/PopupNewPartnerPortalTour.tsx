/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useMemo, useCallback } from 'react';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import icSpaceShip from 'assets/img/account/partner/ic_spaceship.svg';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import { useDispatch } from 'react-redux';
import classes from './popupNewPartnerPortalTour.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleActionTour: () => void;
}

const PopupNewPartnerPortalTour: FC<Props> = ({ isOpen, onClose, handleActionTour }) => {
  const dispatch = useDispatch();
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

  const handleCloseAndRemoveReduxFunc = useCallback(() => {
    dispatch(saveStatusShowPartnerTour(false));
    onClose();
  }, [onClose, dispatch]);

  const renderBody = useMemo(() => {
    return (
      <div className={classes.wrapBody}>
        <h1 className={classes.title}>Welcome to the new Partner Portal</h1>
        <p className={classes.textContent}>
          Would you like to take a tour to learn how to use all the new and exciting features?
        </p>
        <div className={classes.wrapBtn}>
          <Button className={classes.btnTakeTheTour} onClick={handleActionTour}>
            Take the Tour
          </Button>
        </div>
        <div className={classes.btnNoThanks}>
          <span className={classes.pointer} onClick={handleCloseAndRemoveReduxFunc}>
            No, thanks
          </span>
        </div>
      </div>
    );
  }, [handleActionTour, handleCloseAndRemoveReduxFunc]);

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

export default PopupNewPartnerPortalTour;
