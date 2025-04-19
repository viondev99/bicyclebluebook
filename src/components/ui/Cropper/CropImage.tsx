import React, { FC, useCallback, useRef } from 'react';
import Cropper from 'react-cropper';
import Modal from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './crop-image.module.scss';

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

const CropImage: FC<Props> = (props) => {
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
  const src = img;

  const handleRotate = useCallback(() => {
    if (typeof cropper !== 'undefined') {
      cropper.current.cropper.rotate(90);
    }
  }, []);

  return (
    <div>
      <Modal
        isOpen={show}
        title="EDIT IMAGE"
        onClose={() => {
          handleCloseModal();
        }}
        footer={
          <div className={classes.footerModelCropImage}>
            <Button className={classes.btnRotate} onClick={handleRotate}>
              Rotate
            </Button>
            <div>
              <Button className={classes.btnSave} onClick={saveBlob}>
                Save
              </Button>
              <Button
                className={classes.btnCancel}
                onClick={() => {
                  handleCloseModal();
                }}>
                Cancel
              </Button>
            </div>
          </div>
        }>
        <div>
          {img && (
            <Cropper
              crossOrigin={'anonymous'}
              checkCrossOrigin={false}
              ref={cropper}
              src={src}
              guides={false}
              background={false}
              zoomable={false}
              scalable={true}
              movable={false}
              className={classes.cropImage}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CropImage;
