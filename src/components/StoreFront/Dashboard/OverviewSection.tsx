import React, { FC, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import images from 'assets/images';
import StoreState from 'model/store';
import { getUnreadAndTotalMessageFilter } from 'store/store-front/dashboard/dashboard.action';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import Select from '@ui/Select/Select';
import { checkExistLocalStorage, roundNumberLarge } from 'helpers/utilities.helper';
import { pxToRem } from 'helpers/common.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import { Col, Row } from 'reactstrap';
import { BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
import classes from './dashboard.module.scss';

enum FilterOptions {
  ThisMonth = 'THIS_MONTH',
  LastMonth = 'LAST_MONTH',
}

const SelectDateOptions = [
  { label: 'This Month', value: FilterOptions.ThisMonth },
  { label: 'Last Month', value: FilterOptions.LastMonth },
];

interface Props {
  isMenu?: boolean;
}

const OverviewSection: FC<Props> = ({ isMenu }) => {
  const dispatch = useDispatch();
  const dataUnreadAndTotalMessageCardDashboard = useSelector(
    (store: StoreState) => store.storeFront.dashboard.dataUnreadAndTotalMessageCardDashboard,
  );
  const isSelectedStore = useSelector((store: StoreState) => store.common.isSelectedStore);
  const { currentWidthScreen } = useScreenDetect();
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.ThisMonth);
  const [show, setShow] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>();
  const storeFront = checkExistLocalStorage() && localStorage.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    window.addEventListener('mousedown', clickOutside);
    return () => {
      window.removeEventListener('mousedown', clickOutside);
    };
  });

  useEffect(() => {
    dispatch(getUnreadAndTotalMessageFilter({ filter, storefrontIds }));
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [filter, dispatch, storeFront, isSelectedStore, storefrontIds]);

  const handleChangeFilter = useCallback((value: FilterOptions) => {
    setFilter(value);
    setShow(false);
  }, []);

  const renderModal = useCallback(() => {
    return (
      <div
        className={cx(classes.dropdownFilter, {
          [classes.hidden]: !show,
        })}
        ref={dropdownRef}>
        <Button
          className={cx(classes.filterOption, {
            [classes.active]: filter === FilterOptions.ThisMonth,
          })}
          buttonType="clear"
          onClick={() => handleChangeFilter(FilterOptions.ThisMonth)}>
          This Month
        </Button>
        <Button
          className={cx(classes.filterOption, {
            [classes.active]: filter === FilterOptions.LastMonth,
          })}
          buttonType="clear"
          onClick={() => handleChangeFilter(FilterOptions.LastMonth)}>
          Last Month
        </Button>
      </div>
    );
  }, [show, filter, handleChangeFilter]);

  const renderCartDashboard = useCallback(() => {
    return (
      <div className={classes.overviewRow}>
        <Card className={classes.overviewCard}>
          <div className={cx(classes.iconContainer, classes.primaryContainer)}>
            <img src={images.dashboard.icPriceTag} alt="price-tag" />
          </div>
          <Link
            href={{
              pathname: '/store-front/mylistings',
              query: {
                statuses: 'SOLD',
                page: 1,
              },
            }}>
            <a className={classes.link}>
              ${roundNumberLarge(dataUnreadAndTotalMessageCardDashboard?.totalSaleOnlineStore) || 0}
            </a>
          </Link>
          <Link
            href={{
              pathname: '/store-front/mylistings',
              query: {
                statuses: 'SOLD',
                page: 1,
              },
            }}>
            <a className={classes.description}>Total Sales</a>
          </Link>
        </Card>
        <Card className={classes.overviewCard} style={{ marginLeft: 15 }}>
          <div className={cx(classes.iconContainer, classes.dangerContainer)}>
            <img src={images.dashboard.icCart} alt="price-tag" />
          </div>
          <Link
            href={{
              pathname: '/store-front/mylistings',
              query: {
                statuses: 'SOLD',
                page: 1,
              },
            }}>
            <a className={classes.link}>
              {dataUnreadAndTotalMessageCardDashboard?.totalAwaitingShipment || 0}{' '}
              {(Number(dataUnreadAndTotalMessageCardDashboard?.totalAwaitingShipment) || 0) > 1 ? 'items' : 'item'}
            </a>
          </Link>
          <Link
            href={{
              pathname: '/store-front/mylistings',
              query: {
                statuses: 'SOLD',
                page: 1,
              },
            }}>
            <a className={classes.description}>Awaiting Shipment</a>
          </Link>
        </Card>
        <Card className={classes.overviewCard} style={{ marginLeft: 15 }}>
          <div className={classes.note}>Sold / For Sale</div>
          <div className={cx(classes.iconContainer, classes.warningContainer)}>
            <img src={images.dashboard.icListing} alt="price-tag" />
          </div>
          <h2 className={classes.value}>
            <Link
              href={{
                pathname: '/store-front/mylistings',
                query: {
                  statuses: 'SOLD',
                  page: 1,
                },
              }}>
              <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.totalListingSold || 0}</a>
            </Link>{' '}
            /{' '}
            <Link
              href={{
                pathname: '/store-front/mylistings',
                query: {
                  statuses: 'LISTED',
                  page: 1,
                },
              }}>
              <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.totalListingForSale || 0}</a>
            </Link>
          </h2>
          <Link href={'/store-front/mylistings'}>
            <a className={classes.description}>Listings</a>
          </Link>
        </Card>
        <Card className={classes.overviewCard} style={{ marginLeft: 15 }}>
          <div className={classes.note}>Unread / Total</div>
          <div className={cx(classes.iconContainer, classes.successContainer)}>
            <img src={images.dashboard.icBubble} alt="price-tag" />
          </div>
          <h2 className={classes.value}>
            <Link href={'/store-front/messages'}>
              <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.unreadMessage || 0}</a>
            </Link>{' '}
            /{' '}
            <Link href={'/store-front/messages'}>
              <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.totalMessage || 0}</a>
            </Link>
          </h2>
          <Link href={'/store-front/messages'}>
            <a className={classes.description}>Messages</a>
          </Link>
        </Card>
      </div>
    );
  }, [dataUnreadAndTotalMessageCardDashboard]);

  const renderCartDashboards = useCallback(() => {
    return (
      <div
        className={cx(classes.overviewRow, {
          [classes.isMenu]: isMenu,
        })}>
        <Row>
          <Col lg={6} md={6}>
            <Card
              className={cx(classes.overviewCard, {
                [classes.isOverviewCard]: isMenu,
              })}>
              <div className={cx(classes.iconContainer, classes.primaryContainer)}>
                <img src={images.dashboard.icPriceTag} alt="price-tag" />
              </div>
              <Link
                href={{
                  pathname: '/store-front/mylistings',
                  query: {
                    statuses: 'SOLD',
                    page: 1,
                  },
                }}>
                <a className={classes.link}>
                  ${roundNumberLarge(dataUnreadAndTotalMessageCardDashboard?.totalSaleOnlineStore) || 0}
                </a>
              </Link>
              <Link
                href={{
                  pathname: '/store-front/mylistings',
                  query: {
                    statuses: 'SOLD',
                    page: 1,
                  },
                }}>
                <a className={classes.description}>Total Sales</a>
              </Link>
            </Card>
          </Col>
          <Col lg={6} md={6}>
            <Card
              className={cx(classes.overviewCard, {
                [classes.isOverviewCard]: isMenu,
              })}>
              <div className={cx(classes.iconContainer, classes.dangerContainer)}>
                <img src={images.dashboard.icCart} alt="price-tag" />
              </div>
              <Link
                href={{
                  pathname: '/store-front/mylistings',
                  query: {
                    statuses: 'SOLD',
                    page: 1,
                  },
                }}>
                <a className={classes.link}>
                  {dataUnreadAndTotalMessageCardDashboard?.totalAwaitingShipment || 0}{' '}
                  {(Number(dataUnreadAndTotalMessageCardDashboard?.totalAwaitingShipment) || 0) > 1 ? 'items' : 'item'}
                </a>
              </Link>
              <Link
                href={{
                  pathname: '/store-front/mylistings',
                  query: {
                    statuses: 'SOLD',
                    page: 1,
                  },
                }}>
                <a className={classes.description}>Awaiting Shipment</a>
              </Link>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6}>
            <Card
              className={cx(classes.overviewCard, {
                [classes.isOverviewCard]: isMenu,
              })}
              style={{ marginTop: 19 }}>
              <div className={classes.note}>Sold / For Sale</div>
              <div className={cx(classes.iconContainer, classes.warningContainer)}>
                <img src={images.dashboard.icListing} alt="price-tag" />
              </div>
              <h2 className={classes.value}>
                <Link
                  href={{
                    pathname: '/store-front/mylistings',
                    query: {
                      statuses: 'SOLD',
                      page: 1,
                    },
                  }}>
                  <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.totalListingSold || 0}</a>
                </Link>{' '}
                /{' '}
                <Link
                  href={{
                    pathname: '/store-front/mylistings',
                    query: {
                      statuses: 'LISTED',
                      page: 1,
                    },
                  }}>
                  <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.totalListingForSale || 0}</a>
                </Link>
              </h2>
              <Link href={'/store-front/mylistings'}>
                <a className={classes.description}>Listings</a>
              </Link>
            </Card>
          </Col>
          <Col lg={6} md={6}>
            <Card
              className={cx(classes.overviewCard, {
                [classes.isOverviewCard]: isMenu,
              })}
              style={{ marginTop: 19 }}>
              <div className={classes.note}>Unread / Total</div>
              <div className={cx(classes.iconContainer, classes.successContainer)}>
                <img src={images.dashboard.icBubble} alt="price-tag" />
              </div>
              <h2 className={classes.value}>
                <Link href={'/store-front/messages'}>
                  <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.unreadMessage || 0}</a>
                </Link>{' '}
                /{' '}
                <Link href={'/store-front/messages'}>
                  <a className={classes.link}>{dataUnreadAndTotalMessageCardDashboard?.totalMessage || 0}</a>
                </Link>
              </h2>
              <Link href={'/store-front/messages'}>
                <a className={classes.description}>Messages</a>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }, [dataUnreadAndTotalMessageCardDashboard, isMenu]);

  return (
    <>
      <h3
        className={cx(classes.subTitle, {
          [classes.isSubTitle]: isMenu,
        })}>
        Overview
      </h3>
      {!isMenu && (
        <div className={cx('d-flex align-items-center')}>
          <div className={classes.overViewFilterSelect}>
            <Select
              inputId={'chart-filter'}
              selectStyles={{
                control: { backgroundColor: 'transparent', fontWeight: 500, padding: '0px !important' },
                singleValue: {
                  fontSize:
                    currentWidthScreen >= 1200 ? pxToRem(22) : currentWidthScreen >= 768 ? pxToRem(18) : pxToRem(16),
                  color: '#828D9B',
                },
              }}
              value={filter}
              options={SelectDateOptions}
              onChange={(value: any) => handleChangeFilter(value?.value)}
            />
          </div>
          <div className="position-relative">{show && renderModal()}</div>
        </div>
      )}
      {!isMenu ? (
        <div>{renderCartDashboard()}</div>
      ) : (
        <div>{currentWidthScreen === 1024 ? renderCartDashboards() : renderCartDashboard()}</div>
      )}
    </>
  );
};

export default OverviewSection;
