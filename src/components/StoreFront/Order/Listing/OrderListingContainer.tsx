import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from 'store/store-front/orders/orders.action';
import { useRouter } from 'next/router';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import moment from 'moment';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import SearchBar from 'components/StoreFront/Order/Listing/SearchBar/SearchBar';
import OrderSkeleton from 'components/StoreFront/Order/Buyer/Listing/OrderItem/OrderSkeleton';
import NotFoundItem from 'components/StoreFront/Order/Listing/OrderItem/NotFoundItem';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
import classes from './order-listing-container.module.scss';
import OrderItem from './OrderItem/OrderItem';
import StoreState from '../../../../model/store';

const OrderListingContainer = () => {
  const dispatch = useDispatch();
  const { query, replace, pathname } = useRouter();
  const loading = useSelector((store: StoreState) => store.storeFront.order.listing.loading);
  const orders = useSelector((store: StoreState) => store.storeFront.order.listing.orders);
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [searchBoxVisible, setSearchBoxVisible] = useState<boolean>(false);
  const [ranges, setRanges] = useState({
    startDate: moment().utc(),
    endDate: moment().utc(),
  });
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const isSelectedStore = useSelector((store: StoreState) => store.common.isSelectedStore);

  useEffect(() => {
    dispatch(
      getOrders({
        ...query,
        status: query?.status === 'all' ? undefined : query.status,
        storefrontIds: [storefrontIds],
      }),
    );
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [dispatch, query, isSelectedStore, storefrontIds]);

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

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values.startDate,
      endDate: values.endDate,
    });
  }, []);

  const handleChangeStatus = useCallback(
    (value) => {
      replace({
        pathname,
        query: {
          ...query,
          status: value?.value || 'all',
          page: 1,
        },
      });
    },
    [pathname, query, replace],
  );

  const handleCancelDate = useCallback(() => {
    replace({
      pathname,
      query: {
        ...omit(query, ['time_start', 'time_end']),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, replace]);

  const handleSubmitDate = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        time_start: ranges.startDate.utc().startOf('day').unix(),
        time_end: ranges.endDate.utc().endOf('day').unix(),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, ranges, replace]);

  const orderGroupByDate = useMemo(() => {
    return groupBy(orders.data, (order) => moment(order.date_finish).format('DD MMMM YYYY'));
  }, [orders]);

  const isSearch = query.search || query.time_start || query.time_end;

  const renderNoResult = () => {
    return isSearch ? (
      <div className={'mt-5'}>
        <NotFoundItem title={'No orders matching your search'} />
      </div>
    ) : (
      <NotFoundItem title={"You haven't received any orders yet."} />
    );
  };

  const renderListOrder = () => {
    return Object.keys(orderGroupByDate).length === 0 ? (
      renderNoResult()
    ) : (
      <div className="mt-5">
        {Object.keys(orderGroupByDate).map((key) => (
          <div key={String(key)} className={'mb-4'}>
            <h4 className={'mb-4'}>{key}</h4>
            {orderGroupByDate[key].map((order) => (
              <OrderItem order={order} key={order._id} />
            ))}
          </div>
        ))}
        <div className={'mt-5'}>
          <Pagination
            totalPage={orders.total_page}
            page={+String(query.page || '') || orders.page}
            onChangePage={handleChangePage}
          />
        </div>
      </div>
    );
  };

  const renderLoading = useCallback(() => {
    return (
      <div>
        {new Array(3).fill(0).map((_, index) => (
          <div key={String(index)} className={'mb-4'}>
            <OrderSkeleton />
          </div>
        ))}
      </div>
    );
  }, []);

  return (
    <div className="position-relative">
      {/* <div className={cx('d-block d-md-none')}>
        <Button
          buttonType={'transparent'}
          className={'mr-2'}
          onClick={() => {
            setSearchBoxVisible((p) => !p);
          }}>
          <img src={images.iconSearch} alt={'Icon search'} />
        </Button>
        <Button
          buttonType={'transparent'}
          onClick={() => {
            setSelectDateVisible((p) => !p);
          }}>
          <img src={images.icCalendar} alt={'Select Dates'} />
        </Button>
      </div> */}

      <div className={classes.dateRange}>
        {selectDateVisible && (
          <div className={classes.dateRangePicker}>
            <DateRangePicker
              handleCloseWhenClickOut={() => setSelectDateVisible(false)}
              onDatesChange={handleChangeDate}
              startDate={ranges.startDate}
              endDate={ranges.endDate}
              handleCancel={handleCancelDate}
              handleSubmit={handleSubmitDate}
              isOutsideRange={(day) => moment(day).startOf('day').isAfter(moment(), 'day')}
            />
          </div>
        )}
      </div>

      {(isSearch || Object.keys(orderGroupByDate).length !== 0) && (
        <Card className={cx('d-flex flex-row', classes.headerCard)}>
          <div className={classes.selectContainer}>
            <Select
              inputId={'filter-status'}
              selectStyles={{
                control: { backgroundColor: 'transparent', cursor: 'pointer' },
                singleValue: { color: '#1b2028' },
              }}
              value={query?.status ? String(query?.status) : 'all'}
              options={[
                { value: 'all', label: 'All' },
                { value: 'completed', label: 'Completed' },
                { value: 'canceled', label: 'Canceled' },
              ]}
              onChange={handleChangeStatus}
            />
          </div>
          <div>
            <Button
              buttonType={'transparent'}
              onClick={() => {
                setSearchBoxVisible(!searchBoxVisible);
              }}>
              <img src={images.iconSearch} alt={'Icon search'} />
              {/* <span className={'ml-3'}>Search Orders</span> */}
            </Button>

            <Button
              buttonType={'transparent'}
              className={cx('ml-4')}
              onClick={() => {
                setSelectDateVisible(!selectDateVisible);
              }}>
              <img src={images.icCalendar} alt={'Select Dates'} />
              {/* <span className={'ml-3'}>Search Dates</span> */}
            </Button>
          </div>
        </Card>
      )}
      {searchBoxVisible && <SearchBar />}
      {loading ? <div className={'mt-5'}>{renderLoading()}</div> : renderListOrder()}
    </div>
  );
};

export default OrderListingContainer;
