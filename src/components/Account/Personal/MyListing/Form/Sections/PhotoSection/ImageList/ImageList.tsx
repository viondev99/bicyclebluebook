import React, { FC, useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { SwiperOptions } from 'swiper';
import cloneDeep from 'lodash/cloneDeep';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import iconNext from 'assets/img/account/personal/listing/ic_next.svg';
import iconMoreImg from 'assets/img/account/personal/listing/ic_more_img.svg';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import EditImage from './EditImage';
import classes from './image-list.module.scss';

interface Props {
  files: ImageUpload[];
  updateFiles: (files: ImageUpload[]) => void;
  isEdit: boolean;
  isCompleted?: boolean;
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

const ImageList: FC<Props> = ({ files, updateFiles, isEdit, isCompleted }) => {
  const swiper: any = useRef<SwiperInstance>(null);
  const [openAction, setOpenAction] = useState(null);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ImageUpload>(null);
  const [showCropperModal, setShowCropperModal] = useState<boolean>(false);

  const listImageDisplay = useMemo(() => {
    return files.filter((image) => image.isDeleted !== true);
  }, [files]);

  const fillFull12Images = useMemo(() => {
    const list = [...listImageDisplay];
    for (let i = listImageDisplay.length; i < 12; i++) {
      list.push({ url: null });
    }
    return list;
  }, [listImageDisplay]);

  const goNext = useCallback(() => {
    if (swiper?.current) {
      swiper.current?.slideNext();
      if (swiper?.current?.isEnd) {
        setIsHaveNext(false);
        return;
      }
      setIsHavePrev(true);
    }
  }, []);
  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper.current?.slidePrev();
      if (swiper?.current?.isBeginning) {
        setIsHavePrev(false);
        return;
      }
      setIsHaveNext(true);
    }
  }, []);

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
      if (!fillFull12Images || fillFull12Images?.length === 0) {
        return;
      }
      const handler = () => {
        const totalSlide = fillFull12Images.length;
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
      if (!swiper?.current?.destroyed) {
        swiper?.current?.on('slideChange', handler);
      }
      return () => swiper?.current?.off('slideChange', handler);
    }
  }, [fillFull12Images, fillFull12Images.length]);

  return (
    <>
      <div className={classes.swiperWrapper}>
        {fillFull12Images.length > 0 && (
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
                  src={iconNext}
                  style={{ transform: 'rotateY(180deg)' }}
                  alt={'Prev Icon'}
                  width={125}
                  height={125}
                />
              </Button>
            )}

            <Swiper
              {...slideOptions}
              getSwiper={(c) => {
                swiper.current = c;
              }}
              containerClass={classes.containerSwiper}>
              {fillFull12Images.map((item: ImageUpload, index) => (
                <div key={item.id || String(index)} className={classes.imageWrapper}>
                  {(item.url || item.file) && (
                    <>
                      <img src={item?.url || URL.createObjectURL(item.file)} alt={'Product'} className={'img-fluid'} />
                      {!isCompleted && (
                        <div className={classes.wrapAction}>
                          <Button
                            onClick={() => {
                              setOpenAction(index);
                              setSelectedFile(item);
                            }}
                            buttonType="clear"
                            className={cx(classes.actionBtn, { [classes.active]: openAction === index })}>
                            <img src={iconMoreImg} alt="icon more" />
                          </Button>
                          {openAction === index && (
                            <InvisibleBackdrop onClick={() => setOpenAction(null)}>
                              {renderListMenu()}
                            </InvisibleBackdrop>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </Swiper>

            {isHaveNext && (
              <Button buttonType="clear" className={classes.btnNext} onClick={goNext}>
                <img src={iconNext} alt={'Next Icon'} width={125} height={125} />
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
