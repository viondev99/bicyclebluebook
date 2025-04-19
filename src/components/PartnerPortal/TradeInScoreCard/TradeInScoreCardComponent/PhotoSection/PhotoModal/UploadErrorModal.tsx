import React, { FC } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import classes from './photo-guide.module.scss';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const UploadErrorModal: FC<Props> = ({ onClose, isOpen }) => {
  return (
    <MobileFullScreenModal
      title={'Sorry, something’s wrong.'}
      onClose={onClose}
      isOpen={isOpen}
      className={classes.modalError}>
      <p className={classes.description}>
        Your photos appear to be in portrait orientation. Please retake them horizontally and try again.
      </p>
      <Button className={classes.btnReload} onClick={onClose}>
        Try Again{' '}
        <img src={images.account.personal.iconRestartWhite} className={classes.iconReload} alt="icon reload" />
      </Button>
    </MobileFullScreenModal>
  );
};

export default UploadErrorModal;
