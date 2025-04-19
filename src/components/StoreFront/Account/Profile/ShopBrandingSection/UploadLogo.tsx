import React, { useState, useRef } from 'react';

import classes from './shop-branding-section.module.scss';
import CropImage from '../../../../ui/Cropper/CropImage';

interface Props {
  src: string;
  logoUrl: string;
  onChangeData: (value: string) => void;
  onChange: (value: any) => void;
  handleUploadLogo: (value: any) => void;
  isDisabled?: boolean;
}

function UploadLogo(props: Props) {
  const { isDisabled } = props;
  const inputLogoRef = useRef<HTMLInputElement>(null);
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
    if (inputLogoRef) {
      inputLogoRef.current.value = '';
    }
  };
  const onHiddenModalCropImage = () => {
    openCropModal(false);
  };
  const cropImage = (res: any) => {
    const imgSrc = URL.createObjectURL(res);
    props.onChange(imgSrc);
    props.handleUploadLogo(res);
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
      <div className={classes.logoForm}>
        <div onDragOver={ondragOver} onDrop={handleDrop}>
          {props.logoUrl ? (
            <img className={classes.logo} src={props.logoUrl} alt="logo" />
          ) : (
            <div className={classes.logo}>
              <div className={classes.textDrag}>
                Drag file <br />
                here
              </div>
              <img src="https://i.imgur.com/OYEQEmS.png" className={classes.iconDrag} alt="" />
            </div>
          )}
        </div>
        {!isDisabled && (
          <div className={classes.formUploadLogo}>
            <label htmlFor="fileLogo" className={classes.labelLogo}>
              Choose file
              <input
                id="fileLogo"
                ref={inputLogoRef}
                className={classes.inputFile}
                onChange={handleSelectImage}
                type="file"
                placeholder="Choose file"
                accept="image/*"
              />
            </label>
          </div>
        )}
      </div>
    </>
  );
}

export default UploadLogo;
