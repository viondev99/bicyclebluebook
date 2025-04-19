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
import { getBrandYearModelV2, saveBrandYearModelV2 } from 'store/value-guide/value-guide.action';
import { sortFilterBrand } from 'helpers/utilities.helper';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import { getDetailBicycle } from 'api/value-guide.api';
import { BicycleDetailModel } from 'model/api/value-guide.model';
import { toastError } from 'helpers/utils.helper';
import classes from './sub-step-two.module.scss';
import Product from './Product';
import ProductSkeleton from './ProductSkeleton';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import images from '@images';

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
      slidesPerView: 3,
      spaceBetween: 20,
    },
    576: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 6,
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
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  setFormStepDetailSubStepTwo: (data: GetListTradeInBicycleParams) => void;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  isCompleted: boolean;
}

const SubStepTwo: FC<Props> = ({
  form,
  formStepDetailSubStepTwo,
  isCompleted,
  setFormStepDetailSubStepTwo,
  onChangeForm,
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
  const [loadingFindByBiycleId, setLoadingFindByBiycleId] = useState(false);

  const brands = useSelector((store: StoreState) => store.valueGuide.baseComponent.baseComponent.bicycleBrands);

  const brandOptions = useMemo(() => {
    return brands?.length > 0 ? sortFilterBrand(brands) : [];
  }, [brands]);

  const brandName = useMemo(() => {
    return brandOptions?.length ? brandOptions.find((it: any) => it.value === form.brand)?.label : '';
  }, [brandOptions, form.brand]);

  const handleGetBicycleByBicycleId = useCallback(async () => {
    try {
      setLoadingFindByBiycleId(true);
      const response: BicycleDetailModel = await getDetailBicycle({
        idOrName: String(formStepDetailSubStepTwo.bicycleId),
        isVGService: true,
      });
      setListYear([{ id: response.yearId, name: response.yearName }]);
      setListBicycles([
        {
          bicycleId: formStepDetailSubStepTwo.bicycleId,
          bicycleImageDefault: response?.imageDefault,
          bicycleName: response?.name,
        },
      ]);
      setSelectedBicycleId(formStepDetailSubStepTwo.bicycleId);
      setLoadingFindByBiycleId(false);
    } catch (error) {
      setLoadingFindByBiycleId(false);
      toastError(error);
    }
  }, [formStepDetailSubStepTwo.bicycleId]);

  useEffect(() => {
    if (!form.familyName || form.familyName === '') {
      handleGetBicycleByBicycleId();
    }
  }, [form.familyName, handleGetBicycleByBicycleId]);

  useEffect(() => {
    if (form.familyName && form.familyName !== '') {
      dispatch(getBrandYearModelV2({ brandId: form.brand, familyName: form.familyName }));
    }

    return () => {
      if (form.familyName && form.familyName !== '') {
        dispatch(saveBrandYearModelV2({ brandId: form.brand, familyName: form.familyName }));
      }
    };
  }, [dispatch, form.brand, form.familyName]);

  useEffect(() => {
    if (form.familyName && form.familyName !== '') {
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
    }
  }, [loading, listBicycles.length, form.familyName]);

  useEffect(() => {
    if (form.familyName && form.familyName !== '') {
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
        setListYear([...dataBrandYearModel?.years.filter((it: Year) => it.id)]);
        if (formStepDetailSubStepTwo?.bicycleId) {
          const indexYear = dataBrandYearModel?.years?.findIndex(
            (it) => `${it.id}` === `${formStepDetailSubStepTwo.yearId}`,
          );
          setActiveYear(indexYear);
          dispatch(
            getBrandYearModelV2({
              brandId: form.brand,
              familyName: form.familyName,
              yearId: formStepDetailSubStepTwo.yearId,
            }),
          );
          setSelectedBicycleId(formStepDetailSubStepTwo.bicycleId);
        }
      }
    }
  }, [
    dataBrandYearModel,
    dispatch,
    form.brand,
    form.familyName,
    formStepDetailSubStepTwo,
    formStepDetailSubStepTwo.yearId,
    isUpdateYear,
  ]);

  const renderLoading = () => {
    return new Array(24).fill(0).map((_, index) => (
      <Col xs={12} lg={4} key={String(index)}>
        <ProductSkeleton />
      </Col>
    ));
  };

  const handleChangeYear = (yearId: number, index: number) => {
    if (!isCompleted) {
      return;
    }
    dispatch(getBrandYearModelV2({ brandId: form.brand, familyName: form.familyName, yearId }));
    setActiveYear(index);
    setSelectedBicycleId(-1);
    setFormStepDetailSubStepTwo({
      ...formStepDetailSubStepTwo,
      brandId: '',
      modelId: '',
      yearId: '',
      bicycleId: '',
      bicycleIndex: -1,
    });
  };

  const handleSelectBicycle = useCallback(
    (item: BicycleModel, index: number) => {
      if (!isCompleted) {
        return;
      }
      setSelectedBicycleId(item?.bicycleId);
      setFormStepDetailSubStepTwo({
        ...formStepDetailSubStepTwo,
        brandId: form.brand,
        modelId:
          dataBrandYearModel?.models && Array.isArray(dataBrandYearModel.models)
            ? dataBrandYearModel?.models[index]?.id
            : '',
        yearId: listYear?.length ? listYear[activeYear].id : '',
        bicycleId: item?.bicycleId,
        bicycleIndex: index,
      });
      onChangeForm({
        ...form,
        upgradeCompIds: [],
        condition: '',
      });
    },
    [
      activeYear,
      dataBrandYearModel,
      form,
      formStepDetailSubStepTwo,
      isCompleted,
      listYear,
      onChangeForm,
      setFormStepDetailSubStepTwo,
    ],
  );

  const renderProducts = () => {
    if (listBicycles?.length === 0 || listYear?.length === 0) {
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
      <Col lg={4} md={6} key={item.bicycleId} onClick={() => handleSelectBicycle(item, index)}>
        <Product bicycle={item} selectedBicycleId={selectedBicycleId} index={index} />
      </Col>
    ));
  };

  return (
    <>
      <div className={classes.headerStep}>{brandName}</div>
      <div className={classes.headerDescription}>{form.familyName}</div>
      <div className={classes.wrapper}>
        <div className={classes.dragText}>
          <div>{` `}</div>
          <div className={classes.wrapDrag}>
            <img
              src={images.icLeftArrow}
              style={{
                display: 'inline-flex',
                marginRight: 10,
              }}
              alt={'arrow-left'}
              className="icon-button22"
            />
            <span>Drag</span>
          </div>
        </div>

        <div className={classes.swiperWrapper}>
          <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />
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
        <Row>{loading || loadingFindByBiycleId ? renderLoading() : renderProducts()}</Row>
      </div>
    </>
  );
};

export default SubStepTwo;
