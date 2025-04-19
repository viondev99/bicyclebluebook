import React, { FC, useCallback, useEffect, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import cx from 'classnames';
import Link from 'next/link';
import { ViewTypeMarketplace } from 'model/common';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import LeftFilter from 'components/Marketplace/List/LeftFilter/LeftFilter';
import TopFilter from 'components/Marketplace/List/TopFilter/TopFilter';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import ListProduct from 'components/Marketplace/List/ListProduct/ListProduct';
import classes from 'components/Marketplace/List/list-product.module.scss';
import SelectedFilter from 'components/Marketplace/List/SelectedFilter/SelectedFilter';
import LeftFilterMobile from 'components/Marketplace/List/LeftFilter/LeftFilterMobile';
import useScreenDetect from 'hooks/useScreenDetect';
import useMarketplaceFilter from '../../../../hocs/marketplace/useMarketplaceFilter';

import icCloseCircle from '../../../../assets/img/common/ic_close_circle.svg';

export const MarketplaceFilterContext = React.createContext({});

interface Props {
  onRestart?: () => void;
}

const CompleteStep: FC<Props> = ({ onRestart }) => {
  const [viewType, setViewType] = useState<ViewTypeMarketplace>('grid');
  const [openFilter, setOpenFilter] = useState<boolean>(false);
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

  const filter = useMarketplaceFilter();
  return (
    <MarketplaceFilterContext.Provider value={filter}>
      <h2>Here’s what we’ve found</h2>
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
            //       <img src={icCloseCircle} alt={'close'} className={'icon-button'} />
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
      <TopFilter viewType={viewType} onChangeViewType={handleChangeViewType} onOpenFilter={() => setOpenFilter(true)} />
      <SelectedFilter onRestart={onRestart} />
      <Row>
        <Col xs={'12'} sm="auto" className={cx(classes.left, 'd-none', 'd-lg-block')}>
          <div className={classes.leftLayout}>
            <LeftFilter onRestart={onRestart} />
          </div>
        </Col>
        <Col style={{ minWidth: 0 }}>
          <ListProduct viewType={viewType} />
        </Col>
      </Row>
    </MarketplaceFilterContext.Provider>
  );
};

export default CompleteStep;
