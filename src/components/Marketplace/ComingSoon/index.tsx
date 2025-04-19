/* eslint-disable no-unused-expressions */
import React, { FC, useCallback, useEffect, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import { useRouter } from 'next/router';
import { getSeoHelmet } from 'helpers/constraint.helper';
import { ViewTypeMarketplace } from 'model/common';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './coming-soon.module.scss';
import LeftFilter from '../List/LeftFilter/LeftFilter';
import TopFilter from '../List/TopFilter/TopFilter';
import SelectedFilter from '../List/SelectedFilter/SelectedFilter';
import ListProduct from '../List/ListProduct/ListProduct';
import BannerViewSales from './banner/BannerComingSoon';
import LeftFilterMobile from '../List/LeftFilter/LeftFilterMobile';

export const MarketplaceFilterContext = React.createContext({});

const ComingSoonContainer: FC = () => {
  const [viewType, setViewType] = useState<ViewTypeMarketplace>('grid');
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const { currentWidthScreen } = useScreenDetect();
  const { query, replace, pathname } = useRouter();

  const renderInfo = useCallback(() => {
    if (query?.t) {
      const listBikes = `${query.t}`.split(',');
      const listBikeFilter = listBikes.filter((i) => i === 'Mountain' || i === 'Road');
      return listBikeFilter.length ? (
        listBikeFilter.map((it) => {
          if (it === 'Mountain' || it === 'Road') {
            return (
              <h1 key={it} className={classes.customSeoH1}>
                {getSeoHelmet().MARKETPLACE_BUYNOW[it].h}
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
  }, [query]);

  useEffect(() => {
    const savedViewType: ViewTypeMarketplace = checkExistLocalStorage()
      ? (localStorage?.getItem('viewType') as ViewTypeMarketplace)
      : null;
    if (savedViewType) {
      setViewType(savedViewType);
    }

    // remove params store name first loaded
    if (query?.sn) {
      delete query.sn;
      replace({
        pathname,
        query: {
          ...query,
        },
      });
    }
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
          header={<MobileModalHeader onClose={() => setOpenFilter(false)} />}>
          <h2 className={classes.titleFilterModal}>Filters</h2>
          {currentWidthScreen >= 1024 ? (
            <LeftFilter onCloseFilter={() => setOpenFilter(false)} />
          ) : (
            <LeftFilterMobile onCloseFilter={() => setOpenFilter(false)} />
          )}
        </Modal>
        <BannerViewSales customWrapBanner={classes.customWrapBanner} />
        <TopFilter
          isMarketplace
          isComingSoon
          viewType={viewType}
          onChangeViewType={handleChangeViewType}
          onOpenFilter={() => setOpenFilter(true)}
        />
        <SelectedFilter />
        <Row>
          <Col xs={'12'} sm="auto" className={cx(classes.left, 'd-none', 'd-lg-block')}>
            <div className={classes.leftLayout}>
              <LeftFilter />
            </div>
          </Col>
          <Col style={{ minWidth: 0 }}>
            <ListProduct viewType={viewType} sellerIsBBB />
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

export default ComingSoonContainer;
