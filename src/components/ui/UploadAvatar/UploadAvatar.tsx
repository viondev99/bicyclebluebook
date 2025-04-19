import React, { useState, useRef } from 'react';
import classes from './upload-avatar.module.scss';
import CropImage from '../Cropper/CropImage';

interface Props {
  src: string;
  avatarUrl: string;
  onChangeData: (value: string) => void;
  onChange: (value: any) => void;
  handleUploadAvatar: (value: any) => void;
  isDisabled?: boolean;
}

function UploadAvatar(props: Props) {
  const { isDisabled } = props;
  const inputAvatarRef = useRef<HTMLInputElement>(null);
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
    if (inputAvatarRef) {
      inputAvatarRef.current.value = '';
    }
  };
  const onHiddenModalCropImage = () => {
    openCropModal(false);
  };
  const cropImage = (res: any) => {
    const imgSrc = URL.createObjectURL(res);
    props.onChange(imgSrc);
    props.handleUploadAvatar(res);
  };
  const ondragOver = (e: any) => {
    e.preventDefault();
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    handleSelectImage(e);
  };

  const { src } = props;
  return (
    <>
      <CropImage show={cropModal} handleCloseModal={onHiddenModalCropImage} img={src} cropFunction={cropImage} />
      <div className={classes.avatarForm}>
        <div onDragOver={ondragOver} onDrop={handleDrop}>
          {props.avatarUrl ? (
            <img className={classes.avatarProfile} src={props.avatarUrl} alt="avatar profile" />
          ) : (
            <div className={classes.avatarProfile}>
              <div className={classes.textDrag}>
                Drag file <br />
                here
              </div>
              <img src="https://i.imgur.com/OYEQEmS.png" className={classes.iconDrag} alt="" />
            </div>
          )}
        </div>
        {!isDisabled && (
          <div className={classes.formUpAvatar}>
            <label htmlFor="fileAvatar" className={classes.labelAvatar}>
              <span>Change photo</span>
              <input
                id="fileAvatar"
                ref={inputAvatarRef}
                className={classes.inputFile}
                onChange={handleSelectImage}
                type="file"
                placeholder="change photo"
                accept="image/*"
              />
            </label>
          </div>
        )}
      </div>
    </>
  );
}

export default UploadAvatar;
