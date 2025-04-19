import React, { FC, useCallback, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import Dropdown from '@ui/Dropdown/Dropdown';
import Button from '@ui/Buttons/Primary/Button';
import { SEARCH_TYPE } from 'constants/marketplace';
import StoreState from 'model/store';
import { ViewTypeMarketplace } from 'model/common';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from '../list-product.module.scss';

import iconGridView from '../../../../assets/img/marketplace/ic_grid.component.svg';
import iconListView from '../../../../assets/img/marketplace/ic_list.component.svg';
import iconFilterMarketplace from '../../../../assets/img/marketplace/ic_filter.svg';
import icViewSales from '../../../../assets/img/marketplace/ic_view_sale.svg';
import icCommingSoon from '../../../../assets/img/marketplace/ic_comming_soon.svg';
import icDropDown from '../../../../assets/img/common/ic_dropdown.svg';

// const SORT_TYPE = ['Recent', 'Oldest', 'Price High-Low', 'Price Low-high'];

interface Props {
  viewType: string;
  onChangeViewType: (v: ViewTypeMarketplace) => void;
  onOpenFilter: () => void;
  isMarketplace?: boolean;
  isViewSales?: boolean;
  isComingSoon?: boolean;
}

const SORT_TYPE = [
  { label: 'Recent', value: '-TIME_START_LISTING_NEWEST' },
  { label: 'Oldest', value: 'TIME_END_LISTING_SOONEST' },
  { label: 'Price High-Low', value: '-LISTED_PRICE' },
  { label: 'Price Low-High', value: 'LISTED_PRICE' },
];

const GridView = iconGridView;
const ListView = iconListView;

const TopFilter: FC<Props> = ({
  viewType,
  onChangeViewType,
  onOpenFilter,
  isMarketplace,
  isViewSales,
  isComingSoon,
}) => {
  const router = useRouter();
  const { query, replace, pathname, push } = router;
  const { currentWidthScreen } = useScreenDetect();
  const sortType = query[SEARCH_TYPE.sort];
  const product = useSelector((state: StoreState) => state.marketplace.list.product);
  const handleChangeSort = (sort: string) => {
    const pathName = pathname?.split('[')[0];
    const checkPathname = pathname?.includes('[') && (query?.storeId || query?.id);
    push({
      pathname: checkPathname ? `${pathName}${query?.storeId || query?.id}` : pathname,
      query: {
        ...query,
        [SEARCH_TYPE.sort]: sort,
        page: 1,
      },
    });
  };
  const sortValue = useMemo(() => {
    return (
      SORT_TYPE.find((item) => {
        return item.value === sortType;
      }) || SORT_TYPE[0]
    );
  }, [sortType]);

  const getName = useMemo(() => {
    switch (query?.id) {
      case 'road-bikes': {
        return 'road bikes for sale';
      }
      case 'mountain-bikes': {
        return 'mountain bikes for sale';
      }
      case 'hybrid-bikes': {
        return 'hybrid bikes for sale';
      }
      case 'kids-bikes': {
        return 'kids bikes for sale';
      }
      case 'e-bikes': {
        return 'e-bikes for sale';
      }
      default:
        return `used ${product.total_item > 1 ? 'bikes' : 'bike'} for sale`;
    }
  }, [product.total_item, query]);

  const hiddenViewSales = useMemo(() => {
    return (isMarketplace || isComingSoon) && !isViewSales;
  }, [isComingSoon, isMarketplace, isViewSales]);

  const hiddenComingSoon = useMemo(() => {
    return (isMarketplace || isViewSales) && !isComingSoon;
  }, [isComingSoon, isMarketplace, isViewSales]);

  const handleComingSoon = useCallback(() => {
    push({
      pathname: '/marketplace/coming-soon',
      query: {
        ...query,
        isComingSoon: true,
        page: 1,
      },
    });
  }, [push, query]);
  return (
    <Row className={classes.filterWrapper}>
      <Col xs={'auto'} className={cx(classes.left, 'align-items-center', 'd-none', 'd-lg-flex')}>
        <div className={cx(classes.leftLayout)}>
          <span className={classes.itemFound}>{`${product.total_item} ${getName}`}</span>
        </div>
      </Col>
      <Col className="justify-content-between d-flex align-items-center">
        {currentWidthScreen >= 1024 ? (
          <>
            <div className={cx(classes.itemFound, 'd-flex', 'd-lg-none')}>{product.total_item} Items</div>
            <button
              type="button"
              className={cx(classes.filterButtonMobile, 'd-flex', 'd-lg-none')}
              onClick={onOpenFilter}>
              <img src={iconFilterMarketplace} alt={'filter'} />
              Filter
            </button>
          </>
        ) : (
          <div className={classes.ml10}>
            <div className={cx(classes.itemFound, classes.h55, 'd-flex', 'd-lg-none', 'align-items-center')}>
              <span className={classes.itemFound}>{`${product.total_item} ${getName}`}</span>
            </div>
            <button
              type="button"
              className={cx(classes.filterButtonMobile, 'd-flex', 'd-lg-none')}
              onClick={onOpenFilter}>
              <img src={iconFilterMarketplace} alt={'filter'} />
              Filter
            </button>
          </div>
        )}
        <div className={cx(classes.viewButtonGroup, 'd-none', 'd-lg-flex')}>
          <ImageButton onClick={() => onChangeViewType('grid')} aria-label="grid">
            <GridView
              className={cx(classes.viewTypeIcon, {
                [classes.activeGrid]: viewType === 'grid',
              })}
            />
          </ImageButton>
          <ImageButton onClick={() => onChangeViewType('list')} aria-label="list">
            <ListView
              className={cx(classes.viewTypeIcon, {
                [classes.activeList]: viewType === 'list',
              })}
            />
          </ImageButton>
        </div>
        {currentWidthScreen >= 1024 ? (
          <div className="d-flex align-items-center">
            {hiddenComingSoon && (
              <div className={classes.viewSales} onClick={handleComingSoon}>
                <img src={icCommingSoon} alt={'compare'} /> Coming Soon
              </div>
            )}
            {hiddenViewSales && (
              <>
                <div className={classes.viewSales} onClick={() => replace('/marketplace/view-sales')}>
                  <img src={icViewSales} alt={'compare'} /> View Sale
                </div>
                <Dropdown
                  className={'d-flex'}
                  style={{ position: 'relative' }}
                  renderToggle={({ toggle }) => (
                    <Button buttonType={'transparent'} className={classes.sortButton} onClick={toggle}>
                      {sortValue.label}
                      <img
                        src={icDropDown}
                        alt="dropdown"
                        style={{ marginLeft: 10, transform: 'rotate(180deg)' }}
                        width={14}
                        height={7}
                      />
                    </Button>
                  )}
                  renderMenu={({ hide }) => (
                    <MenuDropdown style={{ position: 'absolute', top: 50, right: 0, zIndex: 9 }} onClose={hide}>
                      {SORT_TYPE.map((item) => {
                        return (
                          <MenuDropdown.Item onClick={() => handleChangeSort(item.value)} key={item.value}>
                            {item.label}
                          </MenuDropdown.Item>
                        );
                      })}
                    </MenuDropdown>
                  )}
                />
              </>
            )}
          </div>
        ) : (
          <div className={cx('d-grid align-items-end mb-3', classes.mr10)}>
            <Dropdown
              className={'d-flex justify-content-end'}
              style={{ position: 'relative' }}
              renderToggle={({ toggle }) => (
                <Button buttonType={'recent'} className={classes.sortButton} onClick={toggle}>
                  {sortValue.label}
                  <img
                    src={icDropDown}
                    alt="dropdown"
                    style={{ marginLeft: 10, transform: 'rotate(180deg)' }}
                    width={14}
                    height={7}
                  />
                </Button>
              )}
              renderMenu={({ hide }) => (
                <MenuDropdown style={{ position: 'absolute', top: 50, right: 0, zIndex: 9 }} onClose={hide}>
                  {SORT_TYPE.map((item) => {
                    return (
                      <MenuDropdown.Item onClick={() => handleChangeSort(item.value)} key={item.value}>
                        {item.label}
                      </MenuDropdown.Item>
                    );
                  })}
                </MenuDropdown>
              )}
            />
            <div className={'d-flex'}>
              {hiddenComingSoon && (
                <div className={classes.viewSales} onClick={handleComingSoon}>
                  <img src={icCommingSoon} alt={'compare'} /> Coming Soon
                </div>
              )}
              {hiddenViewSales && (
                <div className={classes.viewSales} onClick={() => replace('/marketplace/view-sales')}>
                  <img src={icViewSales} alt={'compare'} /> View Sale
                </div>
              )}
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default TopFilter;
