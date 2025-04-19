/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { FC, memo, useEffect } from 'react';
import { Modal as BaseModal } from 'reactstrap';
import { getOriginalBodyPadding, getScrollbarWidth, setScrollbarWidth } from 'helpers/modal.helper';
import classes from './modal-view-image.module.scss';
import images from '@images';

export interface DataFile {
  name: string;
  url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (dataFile: DataFile) => void;
  dataFile: DataFile;
}

const ModalViewImage: FC<Props> = (props) => {
  const { isOpen, dataFile, onClose, onDownload } = props;

  useEffect(() => {
    if (isOpen) {
      const originalPadding = getOriginalBodyPadding();
      setScrollbarWidth(getScrollbarWidth());
      document.body.style.maxHeight = '100vh';
      return () => {
        setScrollbarWidth(originalPadding);
        document.body.style.maxHeight = 'unset';
      };
    }
  }, [isOpen, onClose]);

  return (
    <BaseModal
      className={classes.modalViewImage}
      isOpen={isOpen}
      toggle={onClose}
      centered={true}
      contentClassName={classes.contentModalViewImage}>
      <div className={classes.wrapBody}>
        <div className={classes.wrapImage}>
          <img src={dataFile.url} alt="image" />
        </div>
        <div className={classes.wrapButton}>
          <img onClick={onClose} src={images.common.icCloseWhite} className={classes.icClose} alt="icon close" />
          <img
            onClick={() => {
              onDownload(dataFile);
              onClose();
            }}
            src={images.common.icDownloadWhite}
            className={classes.icDownload}
            alt="icon download"
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default memo(ModalViewImage);
