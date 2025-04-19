/* eslint-disable no-unused-expressions */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Button from 'reactstrap/lib/Button';
import { BicycleBasicDetailModel, BicycleModel, Year } from 'model/store/value-guide.model';
import Pagination from '@ui/Pagination/Pagination';
import { useRouter } from 'next/router';
import { toastError } from 'helpers/utils.helper';
import cloneDeep from 'lodash/cloneDeep';
import { SwiperOptions } from 'swiper';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import useScreenDetect from 'hooks/useScreenDetect';
import { CommonComponents } from 'model/store/common.model';
import { getComponents } from 'store/common/common.action';
import ConditionModal from './ConditionModal';
import Product from './Product';
import ProductSkeleton from './ProductSkeleton';
import images from '@images';
import classes from './selectBicycle.module.scss';

interface Props {
  selectByContent?: boolean;
}

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

const SelectBicycle: FC<Props> = ({ selectByContent = false }) => {
  const dispatch = useDispatch();
  const { query, replace, pathname } = useRouter();
  const swiper: any = useRef<SwiperInstance>(null);
  const fullContainerRef: any = useRef();
  const { currentWidthScreen } = useScreenDetect();
  const [checkShowButtonYear, setcheckShowButtonYear] = useState<boolean>(false);
  const [isHavePrev, setIsHavePrev] = useState(false);
  const [isHaveNext, setIsHaveNext] = useState(true);

  const bicycles = useSelector((store: StoreState) => store.valueGuide.bicycle.list.bicycles);
  const loading = useSelector((store: StoreState) => store.valueGuide.bicycle.list.loading);

  const components = useSelector((store: StoreState) => store.common.components);

  const [isConditionModalVisible, setIsConditionModalVisible] = useState<boolean>(false);
  const [selectedBicycle, setSelectedBicycle] = useState<BicycleModel | null>(null);
  const [listBicycles, setListBicycles] = useState([]);

  const [activeYear, setActiveYear] = useState(0);
  const [listYear, setListYear] = useState([]);
  const [keySearch, setKeySearch] = useState<string>('');

  const checkNodataFound = useMemo(() => {
    return bicycles?.data?.length === 0 && !loading;
  }, [bicycles, loading]);

  const checkLengthDataIsSearch = useMemo(() => {
    return checkNodataFound ? (
      <p>Sorry, this bike is not available in your database. Here are some related items</p>
    ) : null;
  }, [checkNodataFound]);

  const renderTextSelectModelAvail = useMemo(() => {
    if (checkNodataFound) {
      return '';
    }
    return typeof selectByContent === 'string' && selectByContent !== '' ? (
      selectByContent
    ) : (
      <p>Select the model to see all available years.</p>
    );
  }, [checkNodataFound, selectByContent]);

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

  const handleGetListYearDefault = useCallback(async () => {
    try {
      let array: BicycleBasicDetailModel[] = [];
      if (query?.content !== keySearch) {
        setKeySearch(`${query?.content}`);
      }
      if (bicycles?.data?.length) {
        if (bicycles?.data?.length) {
          bicycles?.data?.forEach((item) => {
            array = [...array, ...[item]];
          });
        }
        if (bicycles?.dataReplace?.length) {
          bicycles?.dataReplace?.forEach((item) => {
            array = [...array, ...[item]];
          });
        }
        setListBicycles(array);
        const listYearClone = cloneDeep(bicycles?.years?.sort((a: any, b: any) => (a.id > b.id ? -1 : 1)));
        setListYear(listYearClone);
        const indexDefaultActiveYear = listYearClone.findIndex((it: any) => it.id === Number(`${query?.yearId}`));
        setActiveYear(indexDefaultActiveYear === -1 ? 0 : indexDefaultActiveYear);
      }
    } catch (error) {
      toastError(error);
    }
  }, [bicycles, keySearch, query]);

  useEffect(() => {
    dispatch(getComponents([CommonComponents.Condition]));
  }, [dispatch]);

  useEffect(() => {
    handleGetListYearDefault();
  }, [handleGetListYearDefault, bicycles]);

  const handleChangePage = useCallback(
    (page) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [pathname, query, replace],
  );

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

  const handleChangeYear = (yearId: number, index: number) => {
    replace({
      pathname,
      query: {
        ...query,
        page: 1,
        yearId,
      },
    });
    setActiveYear(index);
  };

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

  const renderProducts = useMemo(() => {
    if (listBicycles?.length === 0) {
      return (
        <Row className={classes.description}>
          <Col>
            {checkNodataFound ? (
              ''
            ) : (
              <>
                <h3 className={classes.title}> Can’t find what you’re looking for?</h3>
                <p className={classes.text}>
                  We’re really sorry about that. We may be the definitive bicycle valuation authority, but we don’t have
                  everything. However, we’re continually adding to our already vast database of bikes. Please check back
                  if you have any other bikes you want to valuate.
                </p>
              </>
            )}
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
  }, [checkNodataFound, listBicycles]);

  return (
    <>
      <div className={cx(classes.wrapper, 'mt-5')} ref={fullContainerRef}>
        {checkLengthDataIsSearch}
        <div className={classes.dragText}>
          <div>{renderTextSelectModelAvail}</div>
        </div>
        {loading ? (
          <div className={classes.swiperWrapper}>
            <Skeleton height={54} />
          </div>
        ) : (
          <div className={classes.swiperWrapper}>
            <div className={cx('d-xl-block d-none', classes.swiperSlideHint, { [classes.hide]: !isHaveNext })} />
            {isHavePrev && checkShowButtonYear ? (
              <Button buttonType="clear" className={classes.btnPrev} onClick={goPrev}>
                <img
                  src={images.account.personal.iconNext}
                  style={{ transform: 'rotateY(180deg)' }}
                  alt={'Next Icon'}
                />
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
        )}

        <Row>{loading ? renderLoading : renderProducts}</Row>
        <Row className={classes.pagination}>
          <Col xs={12}>
            <Pagination
              onChangePage={handleChangePage}
              totalPage={Math.ceil(bicycles.total_items_year / 9)}
              page={+String(query.page || '') || bicycles.page}
            />
          </Col>
        </Row>
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
