import React, { useState, useRef } from 'react';

import classes from './online-store-section.module.scss';
import CropImage from '../../../../ui/Cropper/CropImage';

interface Props {
  src: string;
  photoUrl: string;
  onChangeData: (value: string) => void;
  onChange: (value: any) => void;
  handleUploadPhoto: (value: any) => void;
}

function UploadPhoto(props: Props) {
  const inputPhotoRef = useRef<HTMLInputElement>(null);
  const [cropModal, openCropModal] = useState(false);
  const handleSelectImage = (e: any) => {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      if (file.type.indexOf('image') < 0) {
        // show alert bugs here
      } else {
        const reader = new FileReader();
        reader.onload = (ev: any) => {
          props.onChange(ev.target.result);
          props.onChangeData(file);
        };
        reader.readAsDataURL(file);
        openCropModal(true);
      }
    } else {
      removeImg();
    }
  };

  const removeImg = () => {
    props.onChange('');
    props.onChangeData('');
    if (inputPhotoRef) {
      inputPhotoRef.current.value = '';
    }
  };
  const onHiddenModalCropImage = () => {
    openCropModal(false);
  };
  const cropImage = (res: any) => {
    const imgSrc = URL.createObjectURL(res);
    props.onChange(imgSrc);
    props.handleUploadPhoto(res);
  };
  const ondragOver = (e: any) => {
    e.preventDefault();
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    handleSelectImage(e);
  };

  return (
    <>
      <CropImage show={cropModal} handleCloseModal={onHiddenModalCropImage} img={props.src} cropFunction={cropImage} />
      <div className={classes.photoForm}>
        <div onDragOver={ondragOver} onDrop={handleDrop}>
          {props.photoUrl ? (
            <img className={classes.photo} src={props.photoUrl} alt={'avatar'} />
          ) : (
            <div className={classes.photo}>
              <div className={classes.textDrag}>
                Drag file <br />
                here
              </div>
              <img src="https://i.imgur.com/OYEQEmS.png" className={classes.iconDrag} alt={'icon-drag'} />
            </div>
          )}
        </div>
        <div className={classes.formUploadPhoto}>
          <label htmlFor="filePhoto" className={classes.labelPhoto}>
            Change photo
            <input
              id="filePhoto"
              ref={inputPhotoRef}
              className={classes.inputFile}
              onChange={handleSelectImage}
              type="file"
              placeholder="Change photo"
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </>
  );
}

export default UploadPhoto;
