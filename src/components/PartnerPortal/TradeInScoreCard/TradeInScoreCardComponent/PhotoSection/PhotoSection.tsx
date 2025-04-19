import React, { FC, useCallback, useRef, useState } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import images from 'assets/images';
import PhotoGuideModal from 'components/Account/Personal/MyListing/Form/Sections/PhotoSection/PhotoModal/PhotoGuideModal';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import ImageList from 'components/Account/Personal/MyListing/Form/Sections/PhotoSection/ImageList/ImageList';
import cx from 'classnames';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import classes from './photo-section.module.scss';
import UploadErrorModal from './PhotoModal/UploadErrorModal';

interface Props {
  listImages: ImageUpload[];
  setValues: (values: { fileList: ImageUpload[] }) => void;
  isEdit?: boolean;
  isCompleted?: boolean;
}

const PhotoSection: FC<Props> = ({ setValues, listImages, isEdit = false, isCompleted }) => {
  const [photoGuideModalVisible, setPhotoGuideModalVisible] = useState<boolean>(false);
  const [modalErrorVisible, setModalErrorVisible] = useState<boolean>(false);

  const inputFileRef = useRef(null);
  const handleUpdateFileList = useCallback(
    (files) => {
      setValues({
        fileList: files,
      });
    },
    [setValues],
  );
  const handleFileUpload = useCallback(
    (event) => {
      const target = event.target as HTMLInputElement;
      const files = Array.from(target.files);
      const leftItemCanAdd = 12 - listImages?.filter((img) => !img.isDeleted && !img.isEdited)?.length;
      if (files.length > leftItemCanAdd) {
        files.length = leftItemCanAdd;
        toastError(t('common.maximumCount'), t('seoTitle.tooManyPhotos'));
      }
      const currentImages = listImages.length;
      const addImages = files.length;
      const fileAddAble: number = 12 - currentImages;
      const newData = files.map((file) => ({ id: null, url: null, file }));
      if (currentImages > 0 && fileAddAble > 0) {
        if (currentImages + addImages > 12) {
          handleUpdateFileList(listImages.concat(newData.slice(0, fileAddAble)));
        }
        handleUpdateFileList(listImages.concat(newData));
      } else {
        handleUpdateFileList(newData.slice(0, 12));
      }
    },
    [listImages, handleUpdateFileList],
  );

  const handleRemoveAllImages = useCallback(() => {
    setValues({ fileList: listImages.map((image) => ({ ...image, isDeleted: true })) });
    inputFileRef.current.value = '';
    inputFileRef.current.file = {};
  }, [setValues, listImages]);
  return (
    <section>
      {!isCompleted && (
        <div className={'d-flex'}>
          <Button
            type={'button'}
            disabled={listImages?.length === 12}
            onClick={() => {
              inputFileRef.current.click();
            }}>
            <img src={images.iconCamera} alt={'Camera'} />
            <span className={'ml-2'}>Add Photos</span>
          </Button>
          <input ref={inputFileRef} type="file" onChange={handleFileUpload} hidden multiple accept="image/*" />
          {Array.isArray(listImages) && listImages.filter((it) => !it.isDeleted).length > 0 && (
            <Button buttonType="clear" onClick={handleRemoveAllImages} className={cx('ml-4', classes.removeBtn)}>
              Remove all
            </Button>
          )}
        </div>
      )}
      <ImageList files={listImages} updateFiles={handleUpdateFileList} isEdit={isEdit} isCompleted={isCompleted} />
      <PhotoGuideModal onClose={() => setPhotoGuideModalVisible(false)} isOpen={photoGuideModalVisible} />
      <UploadErrorModal onClose={() => setModalErrorVisible(false)} isOpen={modalErrorVisible} />
    </section>
  );
};

export default PhotoSection;
