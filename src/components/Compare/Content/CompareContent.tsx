import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SwiperOptions } from 'swiper';
import classNames from 'classnames';
import Swiper, { SwiperInstance } from 'react-id-swiper';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import StoreState from '../../../model/store';
import CompareCard from './CompareCard/CompareCard';

import classes from './compare-content.module.scss';
import { Product } from '../../../model/common';
import compareAction from '../../../store/compare/compare.action';

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  // init: false,
  centeredSlides: false,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  spaceBetween: 20,
  height: 430,
  breakpoints: {
    768: {
      slidesPerView: 2.3,
      spaceBetween: 20,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 2.3,
      spaceBetween: 20,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 3.2,
      spaceBetween: 20,
    },
  },
};
const infoSlideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  // init: false,
  centeredSlides: false,
  height: 430,
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: false,
    invert: false,
  },
  breakpoints: {
    768: {
      slidesPerView: 2.3,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 2.3,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 3.2,
    },
  },
};

interface CompareList {
  name: string;
  keyName: keyof Product;
  filter?: boolean;
  render?: (a: any) => any;
  main?: boolean;
  isMaching?: boolean;
}

interface Props {
  compareList: CompareList[];
}

const CompareValue: FC<CompareList & { compareItem: Partial<Product> }> = ({ name, render, compareItem, keyName }) => {
  return (
    <>
      <div className={classNames(classes.value, classes.title)}>{name}</div>
      <div className={classes.value}>
        {render ? render(compareItem[keyName]) : compareItem[keyName] ? compareItem[keyName] : '_'}
      </div>
    </>
  );
};

const CompareContent: FC<Props> = ({ compareList }) => {
  const [sticky, setSticky] = useState(false);
  const compare = useSelector((state: StoreState) => state.compare.listCompare);
  console.log('compare', compare);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<SwiperInstance>(null);
  const cardRef = useRef<SwiperInstance>(null);
  const diffRef = useRef<SwiperInstance>(null);
  const matchRef = useRef<SwiperInstance>(null);
  useEffect(() => {
    // effect for sync slides
    cardRef.current.controller.control = modelRef.current;
    modelRef.current.controller.control = [cardRef.current, diffRef.current];
    diffRef.current.controller.control = [modelRef.current, matchRef.current];
    matchRef.current.controller.control = diffRef.current;
  }, [compare]);
  const mainCompare = useMemo(() => {
    return compareList.filter((i) => i.main);
  }, [compareList]);
  const compareSpecification = useMemo(() => {
    return compareList.filter((i) => !i.main);
  }, [compareList]);
  const [differenceSpecification, matchSpecification] = useMemo(() => {
    if (compare.length <= 1) {
      return [compareSpecification, []];
    }
    const match = compareSpecification.filter((i) => i?.isMaching);
    const diff = compareSpecification.filter((i) => !match.includes(i));
    return [diff, match];
  }, [compare, compareSpecification]);

  const onRemove = useCallback(
    (id: number) => {
      dispatch(compareAction.removeFromListCompare(id));
    },
    [dispatch],
  );

  const [containerOffsetTop, setContainerOffsetTop] = useState(0);
  useEffect(() => {
    setContainerOffsetTop(containerRef.current.offsetTop);
    const listener = () => setContainerOffsetTop(containerRef.current.offsetTop);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);

  const isCompareEmpty = compare.length === 0;

  // const scroll = useScrollTracking(600);
  useEffect(() => {
    const onScroll = () => {
      const threshold = containerOffsetTop - 40;
      if (!sticky && window.scrollY >= threshold) {
        setSticky(true);
      }
      if (sticky && window.scrollY < threshold) {
        setSticky(false);
      }
    };
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, [containerOffsetTop, sticky]);

  useEffect(() => {
    if (sticky) {
      cardRef.current.update();
    }
  }, [sticky]);

  return (
    <div className={classes.compareContentContainer} ref={containerRef}>
      <div
        className={classNames({
          [classes.stick]: sticky,
        })}>
        <div
          className={classNames({
            container: sticky,
          })}>
          <Row className={classes.cardRow}>
            <Col
              sm={{
                size: 9,
                offset: 3,
              }}>
              <Swiper
                {...slideOptions}
                getSwiper={(swiper) => {
                  cardRef.current = swiper;
                }}>
                {compare.map((item) => (
                  <div key={item.masterListingId}>
                    <CompareCard
                      onRemove={onRemove}
                      image={item.imageDefault}
                      name={item.title}
                      id={item.masterListingId}
                      sticky={sticky}
                    />
                  </div>
                ))}
              </Swiper>
            </Col>
          </Row>
        </div>
      </div>
      <div className={classNames({ [classes.stickyPlaceholder]: sticky && !isCompareEmpty })} />
      <Row className={classes.compareRow}>
        <Col
          sm={isCompareEmpty ? 12 : 3}
          className={classNames(classes.compareCol, { 'd-none': !isCompareEmpty }, 'd-sm-block')}>
          {mainCompare.map((i) => (
            <div className={classNames(classes.compareItem, classes.head)} key={i.keyName}>
              <span>{i.name}</span>
            </div>
          ))}
        </Col>
        <Col sm={9} className={classes.compareCol}>
          <Swiper
            {...infoSlideOptions}
            getSwiper={(swiper) => {
              modelRef.current = swiper;
            }}>
            {compare.map((item) => (
              <div key={item.masterListingId}>
                {mainCompare.map((i) => (
                  <div className={classNames(classes.compareItem)} key={i.keyName}>
                    <CompareValue {...i} compareItem={item} />
                  </div>
                ))}
              </div>
            ))}
          </Swiper>
        </Col>
      </Row>
      {differenceSpecification.length > 0 && <h2 className={classes.specificationTitle}>Compare Specifications</h2>}
      <Row className={classes.compareRow}>
        <Col
          sm={isCompareEmpty ? 12 : 3}
          className={classNames(classes.compareCol, { 'd-none': !isCompareEmpty }, 'd-sm-block')}>
          {differenceSpecification.map((i) => (
            <div className={classNames(classes.compareItem, classes.head)} key={i.keyName}>
              <span>{i.name}</span>
            </div>
          ))}
        </Col>
        <Col sm={9} className={classes.compareCol}>
          <Swiper
            {...infoSlideOptions}
            getSwiper={(swiper) => {
              diffRef.current = swiper;
            }}>
            {compare.map((item) => (
              <div key={item.masterListingId}>
                {differenceSpecification.map((i) => (
                  <div className={classNames(classes.compareItem)} key={i.keyName}>
                    <CompareValue {...i} compareItem={item} />
                  </div>
                ))}
              </div>
            ))}
          </Swiper>
        </Col>
      </Row>
      {matchSpecification.length > 0 && <h2 className={classes.specificationTitle}>Matching Specifications</h2>}
      <Row className={classes.compareRow}>
        <Col
          sm={isCompareEmpty ? 12 : 3}
          className={classNames(classes.compareCol, { 'd-none': !isCompareEmpty }, 'd-sm-block')}>
          {matchSpecification.map((i) => (
            <div className={classNames(classes.compareItem, classes.head)} key={i.keyName}>
              <span>{i.name}</span>
            </div>
          ))}
        </Col>
        <Col sm={9} className={classes.compareCol}>
          <Swiper
            {...infoSlideOptions}
            getSwiper={(swiper) => {
              matchRef.current = swiper;
            }}>
            {compare.map((item) => (
              <div key={item.masterListingId}>
                {matchSpecification.map((i) => (
                  <div className={classNames(classes.compareItem)} key={i.keyName}>
                    <CompareValue {...i} compareItem={item} />
                  </div>
                ))}
              </div>
            ))}
          </Swiper>
        </Col>
      </Row>
    </div>
  );
};

export default CompareContent;
