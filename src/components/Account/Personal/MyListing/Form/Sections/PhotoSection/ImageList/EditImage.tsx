import React, { FC, useCallback, useRef } from 'react';
import Cropper from 'react-cropper';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from '@ui/Cropper/crop-image.module.scss';
import customClass from './image-list.module.scss';

interface Props {
  show: boolean;
  handleCloseModal: () => void;
  img: string;
  cropFunction: (res: Blob) => void;
}

function dataToBlob(dataURI: string, dataTYPE: string = 'image/jpeg') {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: dataTYPE });
}

const EditImage: FC<Props> = (props) => {
  const cropper = useRef(null);
  const saveBlob = () => {
    if (typeof cropper !== 'undefined') {
      try {
        const canvas = cropper.current.cropper.getCroppedCanvas();
        const context = canvas.getContext('2d');
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL('image/jpeg');
        props.cropFunction(dataToBlob(url));
      } catch (error) {
        console.log('error when crop image');
      }
      props.handleCloseModal();
    }
  };
  const { show, handleCloseModal, img } = props;

  const handleRotate = useCallback(() => {
    if (typeof cropper !== 'undefined') {
      cropper.current.cropper.rotate(90);
    }
  }, []);
  return (
    <div>
      <Modal
        isOpen={show}
        className={customClass.resizeModal}
        header={<div />}
        centered
        contentClassName={customClass.resizeContentModal}
        onClose={() => {
          handleCloseModal();
        }}>
        <div className={customClass.containerCrop}>
          {img && (
            <Cropper
              crossOrigin={'anonymous'}
              checkCrossOrigin={false}
              ref={cropper}
              src={img}
              guides={false}
              background={false}
              zoomable={false}
              scalable={true}
              movable={false}
              className={classes.cropImage}
            />
          )}
        </div>
        <div className={customClass.footerModelCropImage}>
          <div className={customClass.wrapBtnRotate}>
            <Button className={customClass.btnRotate} onClick={handleRotate}>
              Rotate
            </Button>
          </div>
          <div>
            <Button
              className={customClass.btnCancel}
              buttonType="outline"
              onClick={() => {
                handleCloseModal();
              }}>
              Cancel
            </Button>
            <Button className={customClass.btnSave} onClick={saveBlob}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditImage;
