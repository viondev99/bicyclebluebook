import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import cx from 'classnames';
import Link from 'next/link';
import { ViewTypeMarketplace } from 'model/common';
import LeftFilter from 'components/Marketplace/List/LeftFilter/LeftFilter';
import TopFilter from 'components/Marketplace/List/TopFilter/TopFilter';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import images from 'assets/images';
import ListProduct from 'components/Marketplace/List/ListProduct/ListProduct';
import classes from 'components/Marketplace/List/list-product.module.scss';
import SelectedFilter from 'components/Marketplace/List/SelectedFilter/SelectedFilter';
import { useRouter } from 'next/router';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import LeftFilterMobile from 'components/Marketplace/List/LeftFilter/LeftFilterMobile';
import useScreenDetect from 'hooks/useScreenDetect';
import useMarketplaceFilter from '../../../../hocs/marketplace/useMarketplaceFilter';
import HomePageHeader from './Header/HomePageHeader';
import HomePageHeaderPrivateSeller from './Header/HomePageHeaderPrivateSeller';
import customClass from './home-page.module.scss';

export const MarketplaceFilterContext = React.createContext({});

interface Props {}

const HomePage: FC<Props> = ({}) => {
  const [viewType, setViewType] = useState<ViewTypeMarketplace>('grid');
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const router = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  // const product = useSelector((state: StoreState) => state.marketplace.list.product);
  useEffect(() => {
    const savedViewType: ViewTypeMarketplace = checkExistLocalStorage()
      ? (localStorage?.getItem('viewType') as ViewTypeMarketplace)
      : null;
    if (savedViewType) {
      setViewType(savedViewType);
    }
  }, []);
  const handleChangeViewType = useCallback((v: ViewTypeMarketplace) => {
    setViewType(v);
    if (checkExistLocalStorage()) {
      // eslint-disable-next-line no-unused-expressions
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
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [handleChangeViewType]);

  const isSellerPersonal = useMemo(() => {
    return router.pathname.includes('seller');
  }, [router]);

  const filter = useMarketplaceFilter();
  return (
    <div className={customClass.container}>
      {isSellerPersonal ? <HomePageHeaderPrivateSeller /> : <HomePageHeader />}

      <MarketplaceFilterContext.Provider value={filter}>
        <Modal
          isOpen={openFilter}
          onClose={() => setOpenFilter(false)}
          showClose={false}
          header={
            <MobileModalHeader
              onClose={() => setOpenFilter(false)}
              // renderRight={
              //   <Link scroll={false} shallow={true} replace={true} href={''}>
              //     <a className={classes.clearAllButton} type="button">
              //       <img src={images.common.icCloseCircle} alt={'close'} className={'icon-button'} />
              //       Remove all
              //     </a>
              //   </Link>
              // }
            />
          }>
          {/* <LeftFilter /> */}
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
          viewType={viewType}
          isMarketplace
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
            <ListProduct viewType={viewType} />
          </Col>
        </Row>
      </MarketplaceFilterContext.Provider>
    </div>
  );
};

export default HomePage;
