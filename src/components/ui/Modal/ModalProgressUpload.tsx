/* eslint-disable no-await-in-loop */
import React, { FC, memo, useEffect, useState } from 'react';

import Modal from '@ui/Modal/Modal';
import Progress from 'reactstrap/lib/Progress';
import classes from './modal-confirm-delete.module.scss';

interface Props {
  isOpen: boolean;
  urlUpload: string;
  fileName: string;
  onClose: () => void;
}

const ModalProgressUpload: FC<Props> = (props) => {
  const { isOpen, onClose, urlUpload, fileName } = props;
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    handleDownloadFile();
  }, []);

  const handleDownloadFile = async () => {
    try {
      const response = await fetch(urlUpload, {
        method: 'GET',
      });

      if (response) {
        const reader = response.clone().body.getReader();

        const contentLength = response.headers.get('Content-Length');
        let receivedLength = 0;
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }
          receivedLength += value.length;
          setProgressBar((receivedLength / Number(contentLength)) * 100);
        }

        const blob = await response.clone().blob();
        const url: any = window.URL.createObjectURL(blob);
        const link: any = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout((_) => {
          window.URL.revokeObjectURL(url);
        }, 60000);
        link.remove();
        onClose();
      }
    } catch (error) {
      console.log('error-upload', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmDelete}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={`Downloading...`}>
      <Progress barClassName={classes.progressBar} value={progressBar} className={classes.progress} />
    </Modal>
  );
};

export default memo(ModalProgressUpload);
