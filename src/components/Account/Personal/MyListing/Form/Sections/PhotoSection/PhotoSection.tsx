import React, { FC, useCallback, useRef, useState } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import iconCamera from 'assets/img/account/personal/listing/ic_camera.svg';
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
}

const PhotoSection: FC<Props> = ({ setValues, listImages, isEdit = false }) => {
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

      const promise = (file: File) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            if (img.width > 600 || img.height > 600) {
              resolve(file);
            }
            reject(file);
          };
        });
      };

      Promise.all(
        files.map((file) => {
          return promise(file);
        }),
      )
        .then((data: Array<File>) => {
          const currentImages = listImages.length;
          const addImages = data.length;
          const fileAddAble: number = 12 - currentImages;
          const newData = data.map((file) => ({ id: null, url: null, file }));
          if (currentImages > 0 && fileAddAble > 0) {
            if (currentImages + addImages > 12) {
              handleUpdateFileList(listImages.concat(newData.slice(0, fileAddAble)));
            }
            handleUpdateFileList(listImages.concat(newData));
          } else {
            handleUpdateFileList(newData.slice(0, 12));
          }
        })
        .catch(() => {
          setModalErrorVisible(true);
        });
    },
    [listImages, handleUpdateFileList],
  );

  const handleRemoveAllImages = useCallback(() => {
    setValues({ fileList: listImages.map((image) => ({ ...image, isDeleted: true })) });
  }, [setValues, listImages]);
  return (
    <section>
      <h3 className={classes.title}>Photos</h3>
      <p className={classes.description}>
        You can add up to 12 photos of your bike. We don’t allow photos with extra borders, text, or artwork. Please
        take clear photos, using the images found{' '}
        <Button
          buttonSize={'s'}
          buttonType={'clear'}
          className={classes.guideBtn}
          onClick={() => {
            setPhotoGuideModalVisible(true);
          }}>
          here
        </Button>{' '}
        as a guide. Make sure to take photos horizontally and include dwgs and/or damage.
      </p>
      <div className={'d-flex'}>
        <Button
          type={'button'}
          disabled={listImages?.length === 12}
          onClick={() => {
            inputFileRef.current.click();
          }}>
          <img src={iconCamera} alt={'Camera'} width={28} height={29} />
          <span className={'ml-2'}>Add Photos</span>
        </Button>
        <input ref={inputFileRef} type="file" onChange={handleFileUpload} hidden multiple accept="image/*" />
        {listImages.length > 0 && (
          <Button buttonType="clear" onClick={handleRemoveAllImages} className={cx('ml-4', classes.removeBtn)}>
            Remove all
          </Button>
        )}
      </div>
      <ImageList files={listImages} updateFiles={handleUpdateFileList} isEdit={isEdit} />
      <PhotoGuideModal onClose={() => setPhotoGuideModalVisible(false)} isOpen={photoGuideModalVisible} />
      <UploadErrorModal onClose={() => setModalErrorVisible(false)} isOpen={modalErrorVisible} />
    </section>
  );
};

export default PhotoSection;
