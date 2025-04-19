import React, { useState, useRef } from 'react';

import classes from './shop-branding-section.module.scss';
import CropImage from '../../../../ui/Cropper/CropImage';

interface Props {
  src: string;
  coverUrl: string;
  onChangeData: (value: string) => void;
  onChange: (value: any) => void;
  handleUploadCover: (value: any) => void;
}

function UploadCover(props: Props) {
  const inputCoverRef = useRef<HTMLInputElement>(null);
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
    if (inputCoverRef) {
      inputCoverRef.current.value = '';
    }
  };
  const onHiddenModalCropImage = () => {
    openCropModal(false);
  };
  const cropImage = (res: any) => {
    const imgSrc = URL.createObjectURL(res);
    props.onChange(imgSrc);
    props.handleUploadCover(res);
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
      <div className={classes.coverForm}>
        <div onDragOver={ondragOver} onDrop={handleDrop}>
          {props.coverUrl ? (
            <img className={classes.cover} src={props.coverUrl} alt="cover" />
          ) : (
            <div className={classes.cover}>
              <div className={classes.textDrag}>Drag file here</div>
              <img src="https://i.imgur.com/OYEQEmS.png" className={classes.iconDrag} alt="" />
            </div>
          )}
        </div>
        <div className={classes.formUploadCover}>
          <label htmlFor="fileCover" className={classes.labelCover}>
            Choose file
            <input
              id="fileCover"
              ref={inputCoverRef}
              className={classes.inputFile}
              onChange={handleSelectImage}
              type="file"
              placeholder="Choose file"
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </>
  );
}

export default UploadCover;
