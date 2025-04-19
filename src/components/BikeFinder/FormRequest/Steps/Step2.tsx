import React, { FC, memo, useMemo, useEffect, useRef, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { BodyQueryModel } from 'model/store/bike-finder.model';
import { TypeFinderBike, TypeRiding, ItemTypeBike } from 'constants/bike-finder';
import useScreenDetect from 'hooks/useScreenDetect';
import { Col, Row } from 'reactstrap';
import classes from './step.module.scss';
import GroupButton from './GroupButton';
import ItemBikeType from './StepComponent/ItemBikeTypeSwiper';

import icArrowLeftPrimary from '../../../../assets/img/finder-bike/ic_arrow_left_primary.svg';
import icArrowRightPrimary from '../../../../assets/img/finder-bike/ic_arrow_right_primary.svg';
import icLeftArrow from '../../../../assets/img/home/ic_left_arrow.svg';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  passiveListeners: true,
  breakpoints: {
    576: {
      slidesPerView: 1.2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 1.8,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 2.3,
      spaceBetween: 18,
    },
  },
};

const Step2Schema = Yup.object().shape({});

interface Props {
  onChangeForm: (values: Partial<BodyQueryModel>) => void;
}

// const components = [CommonComponents.BicycleType];

interface Step2Form {
  listTypes: string[];
}

const Step2: FC<Props> = (props) => {
  const { onChangeForm } = props;
  const { query } = useRouter();
  const swiperRef = useRef<SwiperInstance>(null);
  const [swipper, setSwiper] = useState<SwiperInstance>(null);
  const [btnPrevShow, setBtnPrevVisible] = useState<boolean>(false);
  const [btnNextShow, setBtnNextVisible] = useState<boolean>(true);
  const [listBikeChecked, setNewBike] = useState<string[]>([]);
  const { currentWidthScreen } = useScreenDetect();
  const queryToListType = useMemo(() => {
    if (query?.t) {
      const arrayListTypes = String(query?.t).split(',');
      const isContainGravelAndCy = arrayListTypes.find((item) => TypeFinderBike.GravelAndCyclocross.includes(item));
      if (isContainGravelAndCy) {
        const filterOldData = arrayListTypes.filter((item) => !TypeFinderBike.GravelAndCyclocross.includes(item));
        return filterOldData.concat([TypeFinderBike.GravelAndCyclocross]);
      }
      return arrayListTypes;
    }
    // if (query?.isAdult) {
    //   return [TypeFinderBike.Road];
    // }
    return [];
  }, [query]);

  useEffect(() => {
    setNewBike(queryToListType);
  }, [queryToListType]);

  const toggleBtnWhenSlideChange = useCallback(() => {
    setBtnPrevVisible(!swiperRef?.current?.isBeginning);
    setBtnNextVisible(!swiperRef?.current?.isEnd);
  }, []);

  const checkTablet = useMemo(() => {
    if (currentWidthScreen >= 768 && currentWidthScreen <= 1024) {
      return true;
    }
    return false;
  }, [currentWidthScreen]);

  useEffect(() => {
    const swiperInstance = swiperRef?.current;
    if (swiperInstance && !checkTablet) {
      // use 3 event because just slide change not working right sometime
      swiperInstance.on('reachEnd', toggleBtnWhenSlideChange);
      swiperInstance.on('slideChange', toggleBtnWhenSlideChange);
      swiperInstance.on('reachBeginning', toggleBtnWhenSlideChange);
    }

    return () => {
      if (swiperInstance) {
        swiperInstance.off('reachEnd');
        swiperInstance.off('slideChange');
        swiperInstance.off('reachBeginning');
      }
    };
  }, [checkTablet, currentWidthScreen, toggleBtnWhenSlideChange]);

  const onSubmit = useCallback(
    (values: Step2Form) => {
      if (listBikeChecked?.length > 0) {
        onChangeForm({
          t: listBikeChecked?.join(','),
          step: 3,
        });
      } else {
        onChangeForm({
          step: 3,
          t: '',
        });
      }
    },
    [listBikeChecked, onChangeForm],
  );

  const goNext = useCallback(() => {
    swipper.slideNext();
  }, [swipper]);
  const goPrev = useCallback(() => {
    swipper.slidePrev();
  }, [swipper]);
  const bikeIsChecked = useCallback(
    (name: string) => {
      if (listBikeChecked?.find((bikeName: string) => bikeName === name)) {
        return true;
      }
      return false;
    },
    [listBikeChecked],
  );
  const handleCheckBike = useCallback(
    (name: string) => {
      if (listBikeChecked?.find((bikeName: string) => bikeName === name)) {
        const newListBike = listBikeChecked?.filter((bikeName: string) => bikeName !== name);
        setNewBike(newListBike);
      } else {
        setNewBike([name]);
      }
    },
    [listBikeChecked],
  );
  // const isDisabled = useCallback(
  //   (name: string) => {
  //     const exitMountainType = listBikeChecked?.find((bikeName: string) => bikeName === TypeFinderBike.Mountain);
  //     if (exitMountainType && name !== TypeFinderBike.Mountain) {
  //       return true;
  //     }
  //     if (!exitMountainType && name === TypeFinderBike.Mountain && listBikeChecked?.length > 0) {
  //       return true;
  //     }
  //     return false;
  //   },
  //   [listBikeChecked],
  // );
  const renderBtnPrev = useMemo(() => {
    return (
      btnPrevShow && (
        <Button buttonType="clear" className={cx(classes.btnCustom, classes.btnPrev)} onClick={goPrev}>
          <img src={icArrowLeftPrimary} alt={'Prev Icon'} />
        </Button>
      )
    );
  }, [btnPrevShow, goPrev]);
  const renderBtnNext = useMemo(() => {
    return (
      btnNextShow && (
        <Button buttonType="clear" className={cx(classes.btnCustom, classes.btnNext)} onClick={goNext}>
          <img src={icArrowRightPrimary} alt={'Next Icon'} />
        </Button>
      )
    );
  }, [btnNextShow, goNext]);

  const showDragBtn = useMemo(() => {
    return (
      <span className={classes.dragRecommend} onClick={goPrev}>
        <img src={icLeftArrow} alt={'arrow-left'} />
        Drag
      </span>
    );
  }, [goPrev]);

  return (
    <Formik
      initialValues={{ listTypes: [] }}
      validationSchema={Step2Schema}
      onSubmit={onSubmit}
      enableReinitialize={true}>
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={classes.stepTitle}>What type of riding will you be doing?</div>
            <div className={classes.wrapSwiper}>
              {renderBtnPrev}
              {checkTablet ? (
                <Row>
                  {TypeRiding?.map((typeBike: ItemTypeBike, index: number) => (
                    <Col xs={6} className={classes.ItemStep} key={typeBike?.name}>
                      <ItemBikeType
                        typeBike={typeBike}
                        bikeIsChecked={bikeIsChecked(typeBike?.name)}
                        handleCheckBike={handleCheckBike}
                        isDisabled={false}
                        // isDisabled={isDisabled(typeBike?.name)}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Swiper
                  {...slideOptions}
                  getSwiper={(c) => {
                    setSwiper(c);
                    swiperRef.current = c;
                  }}>
                  {TypeRiding?.map((typeBike: ItemTypeBike, index: number) => (
                    <div key={typeBike?.name}>
                      <ItemBikeType
                        typeBike={typeBike}
                        bikeIsChecked={bikeIsChecked(typeBike?.name)}
                        handleCheckBike={handleCheckBike}
                        isDisabled={false}
                        // isDisabled={isDisabled(typeBike?.name)}
                      />
                    </div>
                  ))}
                </Swiper>
              )}

              {btnNextShow && !checkTablet && <div className={classes.blurNextStep} />}
              {renderBtnNext}
              <div className={classes.marginTop}>{showDragBtn}</div>
            </div>
            <GroupButton step={2} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step2);
