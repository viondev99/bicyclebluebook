import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import { BicycleModel, Year } from 'model/store/value-guide.model';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { getBrandYearModelV2, saveBrandYearModelV2 } from 'store/value-guide/value-guide.action';
import images from 'assets/images';
import useScreenDetect from 'hooks/useScreenDetect';
import ConditionModal from './ConditionModal';
import Product from './Product';
import ProductSkeleton from './ProductSkeleton';
import classes from './selectBicycle.module.scss';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  passiveListeners: true,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  // init: false,
  breakpoints: {
    320: {
      slidesPerView: 3.3,
      spaceBetween: 20,
    },
    576: {
      slidesPerView: 4.2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 6.3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 10,
      spaceBetween: 20,
    },
  },
};

interface Props {
  selectByContent?: boolean;
}

const SelectBicycle: FC<Props> = ({ selectByContent = false }) => {
  const dispatch = useDispatch();
  const fullContainerRef: any = useRef();
  const { currentWidthScreen } = useScreenDetect();
  const [checkShowButtonYear, setcheckShowButtonYear] = useState<boolean>(false);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);

  const [isConditionModalVisible, setIsConditionModalVisible] = useState<boolean>(false);
  const [selectedBicycle, setSelectedBicycle] = useState(null);
  const dataBrandYearModel = useSelector((store: StoreState) => store.valueGuide.model.list.dataBrandYearModel);
  const loading = useSelector((store: StoreState) => store.valueGuide.model.list.loading);
  const { query } = useRouter();
  const [listBicycles, setListBicycles] = useState([]);
  const swiper: any = useRef<SwiperInstance>(null);
  const [activeYear, setactiveYear] = useState(0);
  const [listYear, setListYear] = useState([]);
  const [isUpdateYear, setIsUpdateYear] = useState(true);

  useEffect(() => {
    return () => {
      dispatch(saveBrandYearModelV2());
    };
  }, []);

  const goNext = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slideNext();
      if (swiper?.current?.isEnd) {
        setIsHaveNext(false);
      }
      setIsHavePrev(true);
    }
  }, []);
  const goPrev = useCallback(() => {
    if (swiper?.current) {
      swiper?.current?.slidePrev();
      if (swiper?.current?.isBeginning) {
        setIsHavePrev(false);
      }
      setIsHaveNext(true);
    }
  }, []);

  useEffect(() => {
    if (swiper?.current && !loading) {
      const handler = () => {
        if (swiper?.current?.isBeginning) {
          setIsHaveNext(true);
          setIsHavePrev(false);
        } else if (swiper?.current?.isEnd) {
          setIsHaveNext(false);
          setIsHavePrev(true);
        } else {
          setIsHaveNext(true);
          setIsHavePrev(true);
        }
      };
      if (!swiper?.current?.destroyed) {
        swiper?.current?.on('slideChange', handler);
      }
      return () => swiper?.current?.off('slideChange', handler);
    }
  }, [loading, listYear.length]);

  useEffect(() => {
    let widthItemYear = 0;
    const widthFullContainer = fullContainerRef?.current?.offsetWidth;
    const getElementsByClassNameCustomItemYear: any = document.getElementsByClassName('custom-item-year');

    widthItemYear = getElementsByClassNameCustomItemYear?.length
      ? getElementsByClassNameCustomItemYear[0].offsetWidth
      : 0;
    widthItemYear += 20;

    setcheckShowButtonYear(
      widthFullContainer < (listYear?.length - 1) * widthItemYear && currentWidthScreen > 1199 && !loading,
    );
  }, [listYear, currentWidthScreen, loading]);

  useEffect(() => {
    let array: any = [];
    if (dataBrandYearModel) {
      // eslint-disable-next-line no-unused-expressions
      dataBrandYearModel?.models?.forEach((item) => {
        array = [...array, ...item.bicycle];
      });
    }
    setListBicycles(array);
    if (dataBrandYearModel?.years?.length && isUpdateYear) {
      setIsUpdateYear(false);
      setListYear([...dataBrandYearModel?.years]);
    }
  }, [dataBrandYearModel, isUpdateYear]);

  const handleSelectBicycle = (bicycle: BicycleModel) => {
    setSelectedBicycle(bicycle);
    setIsConditionModalVisible(true);
  };

  const handleCloseConditionModal = () => {
    setIsConditionModalVisible(false);
  };

  const renderLoading = useMemo(() => {
    return new Array(24).fill(0).map((_, index) => (
      <Col xs={12} md={4} key={String(index)}>
        <ProductSkeleton />
      </Col>
    ));
  }, []);

  const handleChangeYear = (yearId: number, index: number) => {
    const { brandId, familyName, modelId, brandName } = query;
    dispatch(getBrandYearModelV2({ brandId, brandName, familyName, modelId, yearId, isVGService: true }));
    setactiveYear(index);
  };

  const renderProducts = useMemo(() => {
    if (listBicycles?.length === 0) {
      return (
        <Row className={classes.description}>
          <Col>
            <h3 className={classes.title}> Can’t find what you’re looking for?</h3>
            <p className={classes.text}>
              We’re really sorry about that. We may be the definitive bicycle valuation authority, but we don’t have
              everything. However, we’re continually adding to our already vast database of bikes. Please check back if
              you have any other bikes you want to valuate.
            </p>
          </Col>
        </Row>
      );
    }
    return listBicycles.map((item: BicycleModel) => (
      <Col
        md={4}
        key={item.bicycleId}
        onClick={() => {
          handleSelectBicycle(item);
        }}>
        <Product bicycle={item} />
      </Col>
    ));
  }, [listBicycles]);

  return (
    <>
      <div className={cx(classes.wrapper, 'mt-5')} ref={fullContainerRef}>
        <div className={classes.dragText}>
          <div>
            {typeof selectByContent === 'string' && selectByContent !== '' ? (
              selectByContent
            ) : (
              <p>Select the model to see all available years.</p>
            )}
          </div>
        </div>

        <div className={classes.swiperWrapper}>
          <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />
          {isHavePrev && checkShowButtonYear ? (
            <Button buttonType="clear" className={classes.btnPrev} onClick={goPrev}>
              <img src={images.account.personal.iconNext} style={{ transform: 'rotateY(180deg)' }} alt={'Next Icon'} />
            </Button>
          ) : null}

          <Swiper
            {...slideOptions}
            key={2}
            getSwiper={(c) => {
              swiper.current = c;
            }}>
            {listYear?.map((item: Year, index) => (
              <div
                onClick={() => handleChangeYear(item.id, index)}
                className={cx(classes.itemYear, activeYear === index && classes.active, 'custom-item-year')}
                key={item.id}>
                {item?.name}
              </div>
            ))}
          </Swiper>

          {isHaveNext && checkShowButtonYear ? (
            <Button buttonType="clear" className={classes.btnNext} onClick={goNext}>
              <img src={images.account.personal.iconNext} alt={'Next Icon'} />
            </Button>
          ) : null}
        </div>
        <Row>{loading ? renderLoading : renderProducts}</Row>
      </div>

      {selectedBicycle && (
        <ConditionModal
          isOpen={isConditionModalVisible}
          onClose={handleCloseConditionModal}
          bicycle={selectedBicycle}
          key={selectedBicycle.bicycleId}
        />
      )}
    </>
  );
};

export default SelectBicycle;
