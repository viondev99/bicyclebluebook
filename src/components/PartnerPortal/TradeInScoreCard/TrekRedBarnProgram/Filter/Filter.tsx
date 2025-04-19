import React, { FC, useEffect, useState, useCallback, useMemo, ReactElement } from 'react';
import Card from '@ui/Cards';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import cx from 'classnames';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import Select from '@ui/Select/Select';
import { convertToUnixTime } from 'helpers/date.helper';
import moment from 'moment';
import { RedBarnReportPayload } from 'api/partner/trade-in-account.api';
import { pickBy } from 'lodash';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import ScoreCardList from '../ScoreCardList/ScoreCardList';
import classes from './filter.module.scss';

const valueEndOfDate = moment().endOf('day');
const last13days = moment(valueEndOfDate).subtract(13, 'days');

type Duration = 'day' | 'week' | 'month' | 'year' | 'custom_date';

const dataSelect: { label: string; value: Duration }[] = [
  { label: 'Today', value: 'day' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom Date', value: 'custom_date' },
];

const convertDuration: Record<Duration, { startDateFilter: number; endDateFilter: number }> = {
  day: {
    startDateFilter: dayjs().startOf('day').utc().unix(),
    endDateFilter: dayjs().endOf('day').utc().unix(),
  },
  week: {
    startDateFilter: dayjs().startOf('week').utc().unix(),
    endDateFilter: dayjs().endOf('week').utc().unix(),
  },
  month: {
    startDateFilter: dayjs().startOf('month').utc().unix(),
    endDateFilter: dayjs().endOf('month').utc().unix(),
  },
  year: {
    startDateFilter: dayjs().startOf('year').utc().unix(),
    endDateFilter: dayjs().endOf('year').utc().unix(),
  },
  custom_date: {
    startDateFilter: 0,
    endDateFilter: 0,
  },
};

const FilterTrekRedBarnProgram: FC = () => {
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [selectDateVisibleMobile, setSelectDateVisibleMobile] = useState<boolean>(false);
  const [filterMobile, toggleFilterMobile] = useState<boolean>(false);
  const [dateReceived, setDateReceived] = useState('month');
  const [isCustomDate, setIsCustomDate] = useState(false);
  const { query, push, pathname } = useRouter();

  const [bodyRedBarnReport, setBodyRedBarnReport] = useState<RedBarnReportPayload>({
    page: 1,
    size: 20,
    sort: 'DESC',
    startDateFilter: dayjs().startOf('month').utc().unix(),
    endDateFilter: dayjs().endOf('month').utc().unix(),
  });

  useEffect(() => {
    const cleanBody = pickBy(bodyRedBarnReport, (value) => {
      return value !== undefined || value !== null || value !== '';
    });
    push({
      pathname,
      query: {
        ...query,
        ...cleanBody,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyRedBarnReport]);

  const [ranges, setRanges] = useState({
    startDate: null,
    endDate: last13days,
  });

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values?.startDate,
      endDate: values?.endDate,
    });
  }, []);

  const handleCancelDate = useCallback(() => {
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, []);

  const handleDateReceived = useCallback((select: { label: string; value: Duration }) => {
    setDateReceived(select?.value);
    if (select.value !== 'custom_date') {
      setBodyRedBarnReport((prev) => ({ ...prev, ...convertDuration[select.value] }));
    }
    select.value === 'custom_date' ? setIsCustomDate(true) : setIsCustomDate(false);
  }, []);

  const handleSubmitDate = useCallback(() => {
    setBodyRedBarnReport((prev) => ({
      ...prev,
      startDateFilter: convertToUnixTime(ranges?.startDate),
      endDateFilter: convertToUnixTime(ranges?.endDate),
    }));
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, [ranges]);

  const renderGroupFilter = useCallback((): ReactElement => {
    return (
      <>
        <div className={classes.wrapAction}>
          <div className={classes.dateReceived}>
            <Select
              inputId={'filter-status-2'}
              selectStyles={{
                control: { backgroundColor: 'transparent', cursor: 'pointer' },
                singleValue: { color: '#1b2028', fontWeight: 500 },
              }}
              value={dateReceived}
              options={dataSelect}
              onChange={handleDateReceived}
            />
          </div>
          {isCustomDate ? (
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
                    />
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }, [
    dateReceived,
    handleCancelDate,
    handleChangeDate,
    handleDateReceived,
    handleSubmitDate,
    isCustomDate,
    ranges.endDate,
    ranges.startDate,
    selectDateVisible,
  ]);

  const showFilterMobile = useMemo((): ReactElement => {
    return (
      <Card className={cx(classes.listingAction, classes.filterMobile)}>
        {filterMobile && (
          <div className={classes.wrapAction}>
            <div className={classes.sortContainer}>
              <Select
                inputId={'filter-status-2'}
                selectStyles={{
                  control: { backgroundColor: 'transparent', cursor: 'pointer', width: 150 },
                  singleValue: { color: '#1b2028', fontWeight: 500 },
                }}
                value={dateReceived}
                options={dataSelect}
                onChange={handleDateReceived}
              />
              {isCustomDate ? (
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
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
        <Button buttonType="clear" onClick={() => toggleFilterMobile(!filterMobile)}>
          <img src={images.marketplace.iconFilterMarketplace} alt="filter icon" style={{ marginLeft: '20px' }} />
        </Button>
      </Card>
    );
  }, [
    dateReceived,
    filterMobile,
    handleCancelDate,
    handleChangeDate,
    handleDateReceived,
    handleSubmitDate,
    isCustomDate,
    ranges.endDate,
    ranges.startDate,
    selectDateVisibleMobile,
  ]);
  const showFilterDeskTop = useMemo((): ReactElement => {
    return <Card className={cx(classes.listingAction, classes.filterDesktop)}>{renderGroupFilter()}</Card>;
  }, [renderGroupFilter]);

  return (
    <>
      {showFilterMobile}
      {showFilterDeskTop}
      <ScoreCardList />
    </>
  );
};

export default FilterTrekRedBarnProgram;
