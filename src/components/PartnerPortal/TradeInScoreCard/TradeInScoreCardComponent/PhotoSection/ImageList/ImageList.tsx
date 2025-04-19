import React, { FC, useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { SwiperOptions } from 'swiper';
import cloneDeep from 'lodash/cloneDeep';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import images from 'assets/images';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import EditImage from './EditImage';
import classes from './image-list.module.scss';

interface Props {
  files: Array<ImageUpload>;
  updateFiles: (files: Array<ImageUpload>) => void;
  isEdit: boolean;
}

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  passiveListeners: true,
  // init: false,
  breakpoints: {
    576: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

const ImageList: FC<Props> = ({ files, updateFiles, isEdit }) => {
  const swiper = useRef<SwiperInstance>(null);
  const [openAction, setOpenAction] = useState(null);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ImageUpload>(null);
  const [showCropperModal, setShowCropperModal] = useState<boolean>(false);

  const goNext = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slideNext();
      if (swiper?.current?.isEnd) {
        setIsHaveNext(false);
      }
      if (!isHavePrev) {
        setIsHavePrev(true);
      }
    }
  }, [isHavePrev]);
  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slidePrev();
      if (swiper?.current?.isBeginning) {
        setIsHavePrev(false);
      }
      if (!isHaveNext) {
        setIsHaveNext(true);
      }
    }
  }, [isHaveNext]);

  const listImageDisplay = useMemo(() => {
    return files.filter((image) => image.isDeleted !== true);
  }, [files]);
  const cropImage = useCallback(
    (res: Blob) => {
      if (selectedFile) {
        const file = new File([res], selectedFile.id);
        const index = files.findIndex((i: ImageUpload) => {
          if (selectedFile.id && i.id === selectedFile.id) {
            return true;
          }
          if (selectedFile?.file?.lastModified && i.file?.lastModified === selectedFile.file?.lastModified) {
            return true;
          }
          return false;
        });
        const newFiles = cloneDeep(files);
        if (isEdit) {
          // file edited
          newFiles[files.length] = cloneDeep({ ...files[index], isDeleted: true });
          // file new
          newFiles[index] = cloneDeep({ id: '', file, url: '' });
        } else {
          newFiles[index] = { id: '', file, url: '' };
        }
        updateFiles(newFiles);
      }
    },
    [files, isEdit, selectedFile, updateFiles],
  );

  const handleDelete = useCallback(() => {
    if (selectedFile) {
      if (isEdit) {
        updateFiles(
          files.map((i) => {
            const caseNewImage = !selectedFile.id && selectedFile?.file?.name === i?.file?.name;
            const caseInitialImage = selectedFile.id && i.id === selectedFile.id;
            if (caseNewImage || caseInitialImage) {
              return { ...i, isDeleted: true };
            }
            return i;
          }),
        );
      } else {
        updateFiles(
          files.filter((i) => {
            if (selectedFile?.file?.name) {
              return i?.file?.name !== selectedFile?.file?.name;
            }
            return i.id !== selectedFile.id;
          }),
        );
      }
      setOpenAction(null);
    }
  }, [files, isEdit, selectedFile, updateFiles]);

  const imageSelected = useMemo(() => {
    if (selectedFile) {
      if (selectedFile?.url) {
        return `${selectedFile?.url}?time=${+new Date()}`;
      }
      return URL.createObjectURL(selectedFile.file);
    }
    return null;
  }, [selectedFile]);

  const renderListMenu = useCallback(() => {
    return (
      <div className={classes.listAction}>
        <Button
          buttonSize="s"
          buttonType="clear"
          className={classes.resizeBtn}
          onClick={() => setShowCropperModal(true)}>
          <span>Edit</span>
        </Button>
        <Button
          buttonSize="s"
          buttonType="clear"
          className={cx(classes.resizeBtn, classes.removeImage)}
          onClick={handleDelete}>
          <span>Remove</span>
        </Button>
      </div>
    );
  }, [handleDelete]);

  useEffect(() => {
    if (swiper?.current) {
      if (!listImageDisplay || listImageDisplay?.length === 0) {
        return;
      }
      const handler = () => {
        const totalSlide = listImageDisplay.length;
        if (swiper?.current?.activeIndex <= 0) {
          setIsHavePrev(false);
        } else {
          setIsHavePrev(true);
        }
        if (swiper?.current?.activeIndex >= totalSlide - +swiper?.current?.params?.slidesPerView) {
          setIsHaveNext(false);
        } else {
          setIsHaveNext(true);
        }
      };
      swiper.current.on('slideChange', handler);
      return () => {
        setTimeout(() => {
          swiper.current.off('slideChange', handler);
        }, 2000);
      };
    }
  }, [listImageDisplay, listImageDisplay.length]);

  return (
    <>
      <div className={classes.swiperWrapper}>
        {listImageDisplay.length > 0 && (
          <>
            <style>
              {`
              .swiper-wrapper {
                height: auto!important
              }

              `}
            </style>
            {isHavePrev && (
              <Button buttonType="clear" className={classes.btnPrev} onClick={goPrev}>
                <img
                  src={images.account.personal.iconNext}
                  style={{ transform: 'rotateY(180deg)' }}
                  alt={'Next Icon'}
                />
              </Button>
            )}
            <Swiper
              {...slideOptions}
              getSwiper={(c) => {
                swiper.current = c;
              }}
              containerClass={classes.containerSwiper}>
              {listImageDisplay.map((item: ImageUpload, index) => (
                <div key={item.id || String(index)} className={classes.imageWrapper}>
                  <img src={item?.url || URL.createObjectURL(item.file)} alt={'Product'} className={'img-fluid'} />
                  <div className={classes.wrapAction}>
                    <Button
                      onClick={() => {
                        setOpenAction(index);
                        setSelectedFile(item);
                      }}
                      buttonType="clear"
                      className={cx(classes.actionBtn, { [classes.active]: openAction === index })}>
                      <img src={images.account.personal.iconMoreImg} alt="icon more" />
                    </Button>
                    {openAction === index && (
                      <InvisibleBackdrop onClick={() => setOpenAction(null)}>{renderListMenu()}</InvisibleBackdrop>
                    )}
                  </div>
                </div>
              ))}
            </Swiper>
            {isHaveNext && (
              <Button buttonType="clear" className={classes.btnNext} onClick={goNext}>
                <img src={images.account.personal.iconNext} alt={'Next Icon'} />
              </Button>
            )}
          </>
        )}
      </div>
      {selectedFile && (
        <EditImage
          show={showCropperModal}
          handleCloseModal={() => setShowCropperModal(false)}
          cropFunction={cropImage}
          img={imageSelected}
          key={selectedFile.id}
        />
      )}
    </>
  );
};

export default ImageList;
