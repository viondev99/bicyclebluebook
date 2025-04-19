/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-expressions */
import cx from 'classnames';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
// import Link from 'next/link';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import { getSeoHelmet } from 'helpers/constraint.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import useScreenDetect from 'hooks/useScreenDetect';
import { ViewTypeMarketplace } from 'model/common';
import { useRouter } from 'next/router';
import LeftFilter from './LeftFilter/LeftFilter';
import LeftFilterMobile from './LeftFilter/LeftFilterMobile';
import classes from './list-product.module.scss';
import ListProduct from './ListProduct/ListProduct';
import SelectedFilter from './SelectedFilter/SelectedFilter';
import SEOPageMKP from './SEOPageMKP';
import TopFilter from './TopFilter/TopFilter';

// import icCloseCircle from '../../../assets/img/common/ic_close_circle.svg';

export const MarketplaceFilterContext = React.createContext({});

const MarketplaceContainer: FC = () => {
  const [viewType, setViewType] = useState<ViewTypeMarketplace>('grid');
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const { currentWidthScreen } = useScreenDetect();
  const { query, replace, pathname, asPath } = useRouter();

  const typeBicycleNames = useMemo(() => {
    if (asPath?.includes('hybrid-bikes')) {
      return 'Hybrid';
    }
    if (asPath?.includes('kids-bikes')) {
      return 'Kids';
    }
    return 'E-Bike';
  }, [asPath]);

  const renderInfo = useCallback(() => {
    if (asPath.includes('mountain-bikes')) {
      return <h1 className={classes.customSeoH1}>{getSeoHelmet().MARKETPLACE_BUYNOW.Mountain.h}</h1>;
    }
    if (asPath.includes('road-bikes')) {
      return <h1 className={classes.customSeoH1}>{getSeoHelmet().MARKETPLACE_BUYNOW.Road.h}</h1>;
    }
    if (asPath?.includes('hybrid-bikes') || asPath?.includes('e-bikes') || asPath?.includes('kids-bikes')) {
      return (
        <h1 className={classes.customSeoH1}>{getSeoHelmet(String(typeBicycleNames)).MARKETPLACE_BUYNOW.hotBike.h}</h1>
      );
    }
    if (query?.t) {
      const listBikes = `${query.t}`.split(',');
      const listBikeFilter = listBikes.filter(
        (i) => i === 'Mountain' || i === 'Road' || i === 'Hybrid' || i === 'E-Bike' || i === 'Kids',
      );
      return listBikeFilter.length ? (
        listBikeFilter.map((it) => {
          if (it === 'Mountain' || it === 'Road') {
            return (
              <h1 key={it} className={classes.customSeoH1}>
                {getSeoHelmet().MARKETPLACE_BUYNOW[it].h}
              </h1>
            );
          }
          if (it === 'Hybrid' || it === 'E-Bike' || it === 'Kids') {
            return (
              <h1 key={it} className={classes.customSeoH1}>
                {getSeoHelmet(it).MARKETPLACE_BUYNOW.hotBike.h}
              </h1>
            );
          }
          return '';
        })
      ) : (
        <h1 className={classes.customSeoH1}>{getSeoHelmet().MARKETPLACE_BUYNOW.default.h}</h1>
      );
    }
    switch (query?.id) {
      case 'road-bikes': {
        return <h1 className={classes.customSeoH1}>{getSeoHelmet().MARKETPLACE_BUYNOW.Road.h}</h1>;
      }
      case 'mountain-bikes': {
        return <h1 className={classes.customSeoH1}>{getSeoHelmet().MARKETPLACE_BUYNOW.Mountain.h}</h1>;
      }
      default:
        return <h1 className={classes.customSeoH1}>{getSeoHelmet().MARKETPLACE_BUYNOW.default.h}</h1>;
    }
  }, [asPath, query, typeBicycleNames]);

  useEffect(() => {
    const savedViewType: ViewTypeMarketplace = checkExistLocalStorage()
      ? (localStorage?.getItem('viewType') as ViewTypeMarketplace)
      : null;
    if (savedViewType) {
      setViewType(savedViewType);
    }

    // remove params store name first loaded
    if (query?.sn) {
      // delete query.sn;
      replace({
        pathname,
        query: {
          ...query,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeViewType = useCallback((v: ViewTypeMarketplace) => {
    setViewType(v);
    if (checkExistLocalStorage()) {
      localStorage?.setItem('viewType', v);
    }
  }, []);

  useEffect(() => {
    // Effect for detect resize to mobile should change viewType to grid
    const onResize = () => {
      if (window.innerWidth < 992) {
        handleChangeViewType('grid');
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [handleChangeViewType]);

  const filter = useMarketplaceFilter();
  return (
    <MarketplaceFilterContext.Provider value={filter}>
      <Container className={classes.container}>
        <Modal
          isOpen={openFilter}
          onClose={() => setOpenFilter(false)}
          showClose={false}
          bodyClassName={classes.modalBody}
          header={
            <MobileModalHeader
              onClose={() => setOpenFilter(false)}
              // renderRight={
              //   <Link scroll={false} shallow={true} replace={true} href={''}>
              //     <a className={classes.clearAllButton} type="button">
              //       <img src={icCloseCircle} alt={'close'} className={'icon-button'} />
              //       Remove all
              //     </a>
              //   </Link>
              // }
            />
          }>
          <div>
            <h2 className={classes.titleFilterModal}>Filters</h2>
            {currentWidthScreen >= 1024 ? (
              <LeftFilter onCloseFilter={() => setOpenFilter(false)} />
            ) : (
              <LeftFilterMobile onCloseFilter={() => setOpenFilter(false)} />
            )}
          </div>
        </Modal>
        <TopFilter
          isMarketplace
          viewType={viewType}
          onChangeViewType={handleChangeViewType}
          onOpenFilter={() => setOpenFilter(true)}
        />
        <SelectedFilter />
        <Row>
          <Col xs={'12'} sm="auto" className={cx(classes.left, 'd-none', 'd-lg-block')}>
            <div className={classes.leftLayout}>
              <LeftFilter onCloseFilter={() => setOpenFilter(false)} />
            </div>
          </Col>
          <Col style={{ minWidth: 0 }}>
            <ListProduct viewType={viewType} />
            <SEOPageMKP />
          </Col>
        </Row>
        <Row className={classes.h1SeoHidden}>
          <Col xs={'12'} sm="auto" className={cx(classes.left, 'd-none', 'd-lg-block')}>
            <div className={classes.leftLayout}>{` `}</div>
          </Col>
          <Col style={{ minWidth: 0 }}>{renderInfo()}</Col>
        </Row>
      </Container>
    </MarketplaceFilterContext.Provider>
  );
};

export default MarketplaceContainer;
