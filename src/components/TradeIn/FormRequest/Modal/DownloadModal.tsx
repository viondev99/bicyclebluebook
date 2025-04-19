import React, { FC, memo } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import classes from '../form-request.module.scss';

import icAppStore from '../../../../assets/img/trade-in/ic_app_store.svg';
import icGooglePlay from '../../../../assets/img/trade-in/ic_google_play.svg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  return (
    <Modal
      className={classes.downloadModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      header={<h2>Download our mobile app</h2>}>
      <div className={classes.description} style={{ marginBottom: 30 }}>
        Trading and upgrading made easy. Get an instant valuation and make trading in simple, easy, and fast!
      </div>
      <div className={classes.footer}>
        <div className={classes.available}>
          Available on
          <a href="https://apps.apple.com/us/app/id1530491147" target="_blank" rel="noreferrer noopener">
            <img src={icAppStore} alt={'app-store'} />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.bbb.tradeinapp"
            target="_blank"
            rel="noreferrer noopener">
            <img src={icGooglePlay} alt={'google-play'} />
          </a>
        </div>
        <Button className={classes.closeDownloadModal} type="button" buttonType="clear" onClick={onClose}>
          No, thanks
        </Button>
      </div>
    </Modal>
  );
};

export default memo(DownloadModal);
