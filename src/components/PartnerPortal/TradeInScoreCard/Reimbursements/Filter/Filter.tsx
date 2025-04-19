import React, { FC, useState, useCallback, useMemo, ReactElement } from 'react';
import Card from '@ui/Cards';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';
import dayjs from 'dayjs';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import cx from 'classnames';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import Select from '@ui/Select/Select';
import { ReimbursementStatus } from 'constants/scorecard';
import scoreCardAction, { GetListReimbursementPayload } from 'store/partner/scorecard/score-card.action';
import { useDispatch } from 'react-redux';
import classes from './filter.module.scss';

const FilterStatus = [
  { value: '', label: 'All Status' },
  { value: ReimbursementStatus.OPEN, label: 'Open' },
  { value: ReimbursementStatus.DUE, label: 'Due' },
  { value: ReimbursementStatus.PAID, label: 'Paid' },
  { value: ReimbursementStatus.CANCELED, label: 'Canceled' },
  { value: ReimbursementStatus.NON_COMPLIANT, label: 'Non Compliant' },
];

const StortSelect = [
  { value: 'DATE_RECEIVED', label: 'Date Received' },
  { value: 'LOCATION', label: 'Location' },
  { value: 'TRADE_IN_ID', label: 'Trade ID' },
  { value: 'TOTAL', label: 'Total' },
  { value: 'PO_ID', label: 'PO Number' },
];

interface Props {
  sortValue?: string;
  setSortValue?: any;
}

const FilterReimbursements: FC<Props> = ({ sortValue, setSortValue }) => {
  const dispatch = useDispatch();
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [selectDateVisibleMobile, setSelectDateVisibleMobile] = useState<boolean>(false);
  const [filterMobile, toggleFilterMobile] = useState<boolean>(false);
  const [statusSelected, setStatusSelected] = useState<string>('');
  const [ranges, setRanges] = useState({
    startDate: null,
    endDate: null,
  });
  const { query, replace, pathname } = useRouter();

  const handleChangeDate = useCallback(
    (values) => {
      setRanges({
        startDate: values?.startDate,
        endDate: values?.endDate,
      });
      const body: GetListReimbursementPayload = {
        status: statusSelected,
        page: Number(query.page || 1),
        size: Number(query.size || 10),
        sortType: 'DESC',
        sortField: sortValue,
        toDay: dayjs(values?.endDate).utc().format('YYYY-MM-DD'),
        fromDay: dayjs(values?.startDate).utc().format('YYYY-MM-DD'),
      };
      dispatch(scoreCardAction.getListReimbursement(body));
    },
    [dispatch, query.page, query.size, sortValue, statusSelected],
  );

  const handleCancelDate = useCallback(() => {
    replace({
      pathname,
      query: {
        ...omit(query, ['fromDay', 'toDay']),
        page: 1,
      },
    });
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, [pathname, query, replace]);

  const handleSubmitDate = useCallback(() => {
    const body: GetListReimbursementPayload = {
      status: statusSelected,
      page: Number(query.page || 1),
      size: Number(query.size || 10),
      sortType: 'DESC',
      sortField: sortValue,
      toDay: dayjs(ranges?.endDate).utc().format('YYYY-MM-DD'),
      fromDay: dayjs(ranges?.startDate).utc().format('YYYY-MM-DD'),
    };
    dispatch(scoreCardAction.getListReimbursement(body));
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, [dispatch, query.page, query.size, ranges, sortValue, statusSelected]);

  const handleChangeStatus = useCallback(
    (status: { label: string; value: string }) => {
      // eslint-disable-next-line prefer-const
      let body: GetListReimbursementPayload = {
        status: status?.value,
        page: Number(query.page || 1),
        size: Number(query.size || 10),
        sortType: 'DESC',
        sortField: sortValue,
      };
      if (ranges?.endDate && ranges?.startDate) {
        body = {
          ...body,
          toDay: dayjs(ranges?.endDate).utc().format('YYYY-MM-DD'),
          fromDay: dayjs(ranges?.startDate).utc().format('YYYY-MM-DD'),
        };
      }
      dispatch(scoreCardAction.getListReimbursement(body));
      setStatusSelected(status?.value);
    },
    [dispatch, query.page, query.size, ranges, sortValue],
  );

  const handleSort = useCallback(
    (sorts: { label: string; value: string }) => {
      // eslint-disable-next-line prefer-const
      let body: GetListReimbursementPayload = {
        status: statusSelected,
        page: Number(query.page || 1),
        size: Number(query.size || 10),
        sortType: 'DESC',
        sortField: sorts?.value,
      };
      if (ranges?.endDate && ranges?.startDate) {
        body = {
          ...body,
          toDay: dayjs(ranges?.endDate).utc().format('YYYY-MM-DD'),
          fromDay: dayjs(ranges?.startDate).utc().format('YYYY-MM-DD'),
        };
      }
      dispatch(scoreCardAction.getListReimbursement(body));
      setSortValue(sorts?.value);
    },
    [dispatch, query.page, query.size, ranges, setSortValue, statusSelected],
  );

  const renderSelectMenu = useMemo((): ReactElement => {
    return (
      <div className={classes.groupStatusListing}>
        <div className={classes.selectContainer}>
          <Select
            inputId={'filter-status-2'}
            selectStyles={{
              control: { backgroundColor: 'transparent', cursor: 'pointer' },
              singleValue: { color: '#1b2028', fontWeight: 500 },
            }}
            value={statusSelected}
            options={FilterStatus}
            onChange={handleChangeStatus}
          />
        </div>
      </div>
    );
  }, [handleChangeStatus, statusSelected]);

  const renderGroupFilter = useCallback((): ReactElement => {
    return (
      <div className={classes.wrapAction}>
        <div className={classes.title}>Sort</div>
        <div className={classes.sortContainer}>
          <Select
            inputId={'filter-status-2'}
            selectStyles={{
              control: { backgroundColor: 'transparent', cursor: 'pointer' },
              singleValue: { color: '#1b2028', fontWeight: 500 },
            }}
            value={sortValue}
            options={StortSelect}
            onChange={handleSort}
          />
        </div>
        <div className={classes.wrapCalendar}>
          <Button
            buttonType={'transparent'}
            onClick={() => {
              setSelectDateVisible(true);
            }}>
            <img src={images.icCalendar} alt={'Select Dates'} />
          </Button>
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
                  // isOutsideRange={(day) => !dayjs(day).isBefore(dayjs(), 'day')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    handleCancelDate,
    handleChangeDate,
    handleSort,
    handleSubmitDate,
    ranges.endDate,
    ranges.startDate,
    selectDateVisible,
    sortValue,
  ]);

  const showFilterMobile = useMemo((): ReactElement => {
    return (
      <Card className={cx(classes.listingAction, classes.filterMobile)}>
        {!filterMobile && renderSelectMenu}
        {filterMobile && (
          <div className={classes.wrapAction}>
            <div className={classes.title}>Sort</div>
            <div className={classes.sortContainer}>
              <Select
                inputId={'filter-status-2'}
                selectStyles={{
                  control: { backgroundColor: 'transparent', cursor: 'pointer' },
                  singleValue: { color: '#1b2028', fontWeight: 500 },
                }}
                value={sortValue}
                options={StortSelect}
                onChange={handleSort}
              />
            </div>
            <div className={classes.wrapCalendar}>
              <Button
                buttonType={'transparent'}
                onClick={() => {
                  setSelectDateVisibleMobile(true);
                }}>
                <img src={images.icCalendar} alt={'Select Dates'} />
              </Button>
              <div className={classes.dateRange}>
                {selectDateVisibleMobile && (
                  <div className={classes.dateRangePicker}>
                    <DateRangePicker
                      key="mobile"
                      handleCloseWhenClickOut={() => setSelectDateVisibleMobile(false)}
                      onDatesChange={handleChangeDate}
                      startDate={ranges.startDate}
                      endDate={ranges.endDate}
                      handleCancel={handleCancelDate}
                      handleSubmit={handleSubmitDate}
                      // isOutsideRange={(day) => !dayjs(day).isBefore(dayjs(), 'day')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <Button buttonType="clear" onClick={() => toggleFilterMobile(!filterMobile)}>
          <img src={images.marketplace.iconFilterMarketplace} alt="filter icon" />
        </Button>
      </Card>
    );
  }, [
    filterMobile,
    handleCancelDate,
    handleChangeDate,
    handleSort,
    handleSubmitDate,
    ranges.endDate,
    ranges.startDate,
    renderSelectMenu,
    selectDateVisibleMobile,
    sortValue,
  ]);
  const showFilterDeskTop = useMemo((): ReactElement => {
    return (
      <Card className={cx(classes.listingAction, classes.filterDesktop)}>
        {renderSelectMenu}
        {renderGroupFilter()}
      </Card>
    );
  }, [renderGroupFilter, renderSelectMenu]);

  return (
    <>
      {showFilterMobile}
      {showFilterDeskTop}
    </>
  );
};

export default FilterReimbursements;
