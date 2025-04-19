/* eslint-disable no-unused-expressions */
import React, { FC, memo, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import numeral from 'numeral';
import get from 'lodash/get';
import toLower from 'lodash/toLower';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { BicycleModel, Year } from 'model/store/value-guide.model';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import StoreState from 'model/store';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ConditionModal from '@ui/Condition/ConditionModal';
import { getBrandYearModelV2, saveBrandYearModelV2 } from 'store/value-guide/value-guide.action';
import useScreenDetect from 'hooks/useScreenDetect';
import { TradeInForm, TradeInValues } from 'pages/trade-in/request';
import ProductSkeleton from './ProductSkeleton';
import ProceedModal from './Modal/ProceedModal';
import ModalNotExistCondition from './Modal/ModalNotExistCondition';
import Product from './Product';
import classes from './form-request.module.scss';

import FormRequestButton from './FormRequestButton';

const slideOptionsProduct: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 0,
  passiveListeners: true,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  // init: false,
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    576: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 7,
      spaceBetween: 20,
    },
  },
};

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
      slidesPerView: 4.5,
      spaceBetween: 20,
    },
    576: {
      slidesPerView: 4.5,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4.5,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 6.5,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 7.5,
      spaceBetween: 20,
    },
  },
};

function formatTradeInValue(value: number) {
  return value ? numeral(value).format('0,0.00') : value;
}

interface Props {
  brand: { value: string; label: string };
  familyName: string;
  bicycleId: string;
  year: { value: string; label: string } | null;
  isIgnoreStep2: boolean;
  onChangeStep: (step: number, subStep?: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
}

const Step3: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const { brand, familyName, bicycleId, year, isIgnoreStep2, onChangeStep, onChangeForm } = props;

  const conditions = useSelector((store: StoreState) => store.tradeIn.conditions);
  const [openModal, setOpenModal] = useState(false);
  const [show, setShow] = useState(false);
  const [visibleModalNotExistCondition, setvisibleModalNotExistCondition] = useState(false);

  const dataBrandYearModel = useSelector((store: StoreState) => store.valueGuide.model.list.dataBrandYearModel);
  const loading = useSelector((store: StoreState) => store.valueGuide.model.list.loading);

  const [isHaveNext, setIsHaveNext] = useState(true);
  const [listBicycles, setListBicycles] = useState([]);
  const swiper: any = useRef<SwiperInstance>(null);
  const swiperProduct = useRef<SwiperInstance>(null);
  const [activeYear, setActiveYear] = useState(0);
  const [listYear, setListYear] = useState([]);
  const [isUpdateYear, setIsUpdateYear] = useState(true);
  const [selectedBicycleId, setSelectedBicycleId] = useState<string>('');

  const disableBtnNext = useMemo(() => {
    return selectedBicycleId === '';
  }, [selectedBicycleId]);

  useEffect(() => {
    dispatch(getBrandYearModelV2({ brandId: brand?.value, familyName, isSellTrade: true }));
    return () => {
      dispatch(saveBrandYearModelV2({ brandId: brand?.value, familyName }));
    };
  }, [brand, dispatch, familyName]);

  useEffect(() => {
    if (swiper?.current && swiperProduct?.current && !loading && currentWidthScreen < 768) {
      const handler = () => {
        const totalSlide = listBicycles.length;
        if (swiperProduct?.current?.activeIndex >= totalSlide - +swiperProduct?.current?.params?.slidesPerView) {
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
  }, [loading, listBicycles.length, currentWidthScreen]);

  useEffect(() => {
    if (swiper?.current && !loading) {
      const handler = () => {
        const totalSlide = listBicycles.length;
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
  }, [loading, listBicycles.length]);

  useEffect(() => {
    let array: any = [];
    if (dataBrandYearModel) {
      dataBrandYearModel?.models?.forEach((item) => {
        array = [...array, ...item.bicycle];
      });
    }
    setListBicycles(array);
    if (dataBrandYearModel?.years?.length && isUpdateYear) {
      setIsUpdateYear(false);
      setListYear([...dataBrandYearModel?.years]);
      if (bicycleId) {
        const indexYear = dataBrandYearModel?.years?.findIndex((it) => `${it.id}` === `${year?.value}`);
        setActiveYear(indexYear);
        dispatch(
          getBrandYearModelV2({
            brandId: brand.value,
            familyName,
            yearId: `${year.value}`,
            isSellTrade: true,
          }),
        );
        setSelectedBicycleId(bicycleId);
      }
    }
  }, [bicycleId, brand, dataBrandYearModel, dispatch, familyName, isUpdateYear, year]);

  const toggleModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  const onProceed = useCallback(() => {
    let tradeInValues: Partial<TradeInValues>;
    get(conditions, 'listConditions', []).forEach((item) => {
      if (item.condition) {
        tradeInValues = {
          ...tradeInValues,
          [toLower(item.condition)]: `$${formatTradeInValue(item.tradeInValueMin)} - $${formatTradeInValue(
            item.tradeInValueMax,
          )}`,
        };
      }
    });
    setShow(false);
    onChangeStep(2, 1);
    onChangeForm({
      id: get(conditions, 'bicycleId', null),
      tradeInValues,
    });
  }, [onChangeStep, onChangeForm, conditions]);

  const handleSelectBicycle = useCallback(
    (bicycle: BicycleModel, index: number) => {
      if (String(bicycle?.bicycleId) !== selectedBicycleId) {
        setSelectedBicycleId(`${bicycle?.bicycleId}`);
        onChangeForm({
          model:
            dataBrandYearModel?.models && Array.isArray(dataBrandYearModel.models)
              ? { label: dataBrandYearModel?.models[index]?.name, value: String(dataBrandYearModel?.models[index]?.id) }
              : null,
          bicycleId: String(bicycle?.bicycleId),
          year: listYear?.length ? { label: listYear[activeYear].name, value: String(listYear[activeYear].id) } : null,
          condition: '',
          tradeInValue: null,
        });
      } else {
        onChangeForm({
          model:
            dataBrandYearModel?.models && Array.isArray(dataBrandYearModel.models)
              ? { label: dataBrandYearModel?.models[index]?.name, value: String(dataBrandYearModel?.models[index]?.id) }
              : null,
          bicycleId: String(bicycle?.bicycleId),
          year: listYear?.length ? { label: listYear[activeYear].name, value: String(listYear[activeYear].id) } : null,
        });
      }
    },
    [activeYear, dataBrandYearModel, listYear, onChangeForm, selectedBicycleId],
  );

  const renderLoading = useMemo(() => {
    return new Array(9).fill(0).map((_, index) => (
      <Col xs={12} lg={4} key={String(index)}>
        <ProductSkeleton />
      </Col>
    ));
  }, []);

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
    return listBicycles.map((item: BicycleModel, index: number) => (
      <Col
        className={classes.stepTwoCol}
        lg={4}
        key={item.bicycleId}
        onClick={() => {
          handleSelectBicycle(item, index);
        }}>
        <Product bicycle={item} selectedBicycleId={selectedBicycleId} totalItem={listBicycles?.length} index={index} />
      </Col>
    ));
  }, [handleSelectBicycle, listBicycles, selectedBicycleId]);

  const handleNextStep = () => {
    onChangeStep(2, 1);
  };

  const handleChangeYear = (yearId: number, index: number) => {
    dispatch(getBrandYearModelV2({ brandId: brand?.value, familyName, yearId, isSellTrade: true }));
    setActiveYear(index);
    setSelectedBicycleId('');
    onChangeForm({
      model: null,
      bicycleId: '',
      year: null,
    });
  };

  const handleBackStep = useCallback(() => {
    if (isIgnoreStep2) {
      onChangeStep(1, 1);
      return;
    }
    onChangeStep(1, 2);
  }, [isIgnoreStep2, onChangeStep]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.formContainer}>
          <h1 className={classes.formTitle}>{brand?.label}</h1>
          <p className={classes.formDescription}>{familyName}</p>
          <div className={classes.swiperWrapper}>
            <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />
            <style>
              {`
              .swiper-wrapper {

              }
              `}
            </style>
            <Swiper
              {...slideOptions}
              key={2}
              getSwiper={(c) => {
                swiper.current = c;
              }}>
              {listYear?.map((item: Year, index) => (
                <div
                  onClick={() => handleChangeYear(item.id, index)}
                  className={cx(classes.itemYear, activeYear === index && classes.active)}
                  key={item.id}>
                  {item?.name}
                </div>
              ))}
            </Swiper>
          </div>
          {currentWidthScreen < 768 ? (
            <Row className={cx(classes.stepTwoRow, 'd-block', 'd-md-none')}>
              <div className={classes.swiperWrapperProduct}>
                <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />
                <style>
                  {`
              .swiper-wrapper {

              }
              `}
                </style>
                <Swiper
                  {...slideOptionsProduct}
                  key={1}
                  getSwiper={(c) => {
                    swiperProduct.current = c;
                  }}>
                  {loading ? renderLoading : renderProducts}
                </Swiper>
              </div>
            </Row>
          ) : (
            <Row className={classes.stepTwoRow}>{loading ? renderLoading : renderProducts}</Row>
          )}
        </div>
      </div>
      <FormRequestButton
        disabledBack={false}
        disabledContinue={loading || disableBtnNext}
        onClickBack={handleBackStep}
        onClickContinue={handleNextStep}
      />
      {openModal && <ConditionModal isOpen={openModal} onClose={toggleModal} />}
      {show && <ProceedModal isOpen={show} onClose={() => setShow(false)} onProceed={onProceed} />}
      {visibleModalNotExistCondition && (
        <ModalNotExistCondition
          isOpen={visibleModalNotExistCondition}
          onClose={() => setvisibleModalNotExistCondition(false)}
        />
      )}
    </>
  );
};

export default memo(Step3);
