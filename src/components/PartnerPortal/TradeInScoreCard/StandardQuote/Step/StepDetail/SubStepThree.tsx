/* eslint-disable import/no-cycle */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { BicycleModel, Year } from 'model/store/value-guide.model';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import cx from 'classnames';
import {
  getBrandYearModelV2,
  getLogoBrandValueGuide,
  saveBrandYearModelV2,
} from 'store/value-guide/value-guide.action';
import { sortFilterBrand } from 'helpers/utilities.helper';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import { Button } from 'reactstrap';
import useScreenDetect from 'hooks/useScreenDetect';
import ValueGuideHeading from 'components/ValueGuide/Search/Heading';
import cloneDeep from 'lodash/cloneDeep';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import Product from './Product';
import ProductSkeleton from './ProductSkeleton';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import images from '@images';
import classes from './sub-step-three.module.scss';

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
  form: TradeInScoreCardsProps;
  formStepOneSubStepThree: GetListTradeInBicycleParams;
  setFormStepOneSubStepThree: (data: GetListTradeInBicycleParams) => void;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  isCompleted: boolean;
  handleCountinues: (newFormStepOneSubStepThree?: GetListTradeInBicycleParams) => void;
}

const SubStepThree: FC<Props> = ({
  form,
  formStepOneSubStepThree,
  isCompleted,
  setFormStepOneSubStepThree,
  onChangeForm,
  handleCountinues,
}) => {
  const dispatch = useDispatch();
  const dataBrandYearModel = useSelector((store: StoreState) => store.valueGuide.model.list.dataBrandYearModel);
  const loading = useSelector((store: StoreState) => store.valueGuide.model.list.loading);
  const [isHaveNext, setIsHaveNext] = useState(true);
  const [listBicycles, setListBicycles] = useState([]);
  const swiper: any = useRef<SwiperInstance>(null);
  const [activeYear, setActiveYear] = useState<number>(0);
  const [listYear, setListYear] = useState([]);
  const [isUpdateYear, setIsUpdateYear] = useState(true);
  const [selectedBicycleId, setSelectedBicycleId] = useState<string | number>(-1);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const fullContainerRef: any = useRef();
  const { currentWidthScreen } = useScreenDetect();
  const [checkShowButtonYear, setcheckShowButtonYear] = useState<boolean>(false);
  const brands = useSelector((store: StoreState) => store.valueGuide.baseComponent?.branchYearModel);
  const { listDataStepStandardQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  const brandOptions = useMemo(() => {
    return brands?.length > 0 ? sortFilterBrand(brands) : [];
  }, [brands]);

  const brandName = useMemo(() => {
    return brandOptions?.length ? brandOptions.find((it: any) => it.value === form.brand)?.label : '';
  }, [brandOptions, form.brand]);

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
    dispatch(getBrandYearModelV2({ brandId: form.brand, familyName: form.familyName, isEbike: false }));
    dispatch(getLogoBrandValueGuide(form.brand));
    return () => {
      dispatch(saveBrandYearModelV2({ brandId: form.brand, familyName: form.familyName }));
    };
  }, [dispatch, form.brand, form.familyName]);

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
      if (formStepOneSubStepThree?.bicycleId) {
        const indexYear = dataBrandYearModel?.years?.findIndex((it) => it.id === formStepOneSubStepThree.yearId);
        setActiveYear(indexYear);
        dispatch(
          getBrandYearModelV2({
            brandId: form.brand,
            familyName: form.familyName,
            yearId: formStepOneSubStepThree.yearId,
          }),
        );
        setSelectedBicycleId(formStepOneSubStepThree.bicycleId);
      }
    }
  }, [
    dataBrandYearModel,
    dispatch,
    form.brand,
    form.familyName,
    formStepOneSubStepThree,
    formStepOneSubStepThree.yearId,
    isUpdateYear,
  ]);

  const renderLoading = useMemo(() => {
    return new Array(24).fill(0).map((_, index) => (
      <Col xs={12} lg={4} key={String(index)}>
        <ProductSkeleton />
      </Col>
    ));
  }, []);

  const handleChangeYear = (yearId: number, index: number) => {
    if (isCompleted) {
      return;
    }
    dispatch(getBrandYearModelV2({ brandId: form.brand, familyName: form.familyName, yearId, isEbike: false }));
    setActiveYear(index);
    setSelectedBicycleId(-1);
    setFormStepOneSubStepThree({
      ...formStepOneSubStepThree,
      brandId: '',
      modelId: '',
      yearId: '',
      bicycleId: '',
      bicycleIndex: -1,
    });
  };

  const getModelId = useCallback(
    (item: BicycleModel) => {
      if (!dataBrandYearModel || dataBrandYearModel.models.length === 0) {
        return '';
      }
      for (const i of dataBrandYearModel.models) {
        if (i.bicycle.some((it) => `${it.bicycleId}` === `${item.bicycleId}`)) {
          return i.id;
        }
      }
      return '';
    },
    [dataBrandYearModel],
  );

  const handleSelectBicycle = useCallback(
    (item: BicycleModel, index: number) => {
      if (isCompleted) {
        if (selectedBicycleId === item.bicycleId) {
          handleCountinues();
        }
        return;
      }
      setSelectedBicycleId(item?.bicycleId);
      const newFormStepOneSubStepThree = {
        ...formStepOneSubStepThree,
        brandId: form.brand,
        modelId: getModelId(item),
        yearId: listYear?.length ? listYear[activeYear].id : '',
        bicycleId: item?.bicycleId,
        bicycleIndex: index,
      };
      setFormStepOneSubStepThree(newFormStepOneSubStepThree);
      onChangeForm({
        ...form,
        upgradeCompIds: [],
        condition: '',
      });

      const cloneArr = cloneDeep(listDataStepStandardQuote);
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        brandId: form.brand,
        modelId:
          dataBrandYearModel?.models && Array.isArray(dataBrandYearModel.models)
            ? dataBrandYearModel?.models[index]?.id
            : '',
        yearId: listYear?.length ? listYear[activeYear].id : '',
        bicycleId: item?.bicycleId,
        bicycleIndex: index,
        upgradeCompIds: [],
        condition: '',
        subStep: 4,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: cloneArr,
        }),
      );
      handleCountinues(newFormStepOneSubStepThree);
    },
    [
      activeYear,
      dataBrandYearModel,
      dispatch,
      form,
      formStepOneSubStepThree,
      getModelId,
      handleCountinues,
      indexScorecardSelected,
      isCompleted,
      listDataStepStandardQuote,
      listYear,
      onChangeForm,
      selectedBicycleId,
      setFormStepOneSubStepThree,
    ],
  );

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
    return listBicycles?.map((item: BicycleModel, index: number) => (
      <Col lg={4} md={6} key={item.bicycleId} onClick={() => handleSelectBicycle(item, index)}>
        <Product bicycle={item} selectedBicycleId={selectedBicycleId} />
      </Col>
    ));
  }, [handleSelectBicycle, listBicycles, selectedBicycleId]);

  return (
    <>
      <ValueGuideHeading title={brandName} name={form.familyName} />
      <div className={classes.wrapper} ref={fullContainerRef}>
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
    </>
  );
};

export default SubStepThree;
