import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { BICYCLE_OUTLET_LOGGED_INFO, formatCurrency, formatCurrencyFixed } from 'helpers/string.helper';
import StoreState from 'model/store';
import { getStorefrontChart } from 'store/store-front/dashboard/dashboard.action';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import { pxToRem } from 'helpers/common.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classes from './dashboard.module.scss';

dayjs.extend(utc);

enum FilterOptions {
  Today = 'TODAY',
  Yesterday = 'YESTERDAY',
  ThisWeek = 'THIS_WEEK',
  ThisMonth = 'THIS_MONTH',
  LastMonth = 'LAST_MONTH',
  Past30days = 'PAST_30_DAYS',
}

const filterOptions = [
  { label: 'Today', value: FilterOptions.Today },
  { label: 'Yesterday', value: FilterOptions.Yesterday },
  { label: 'This Week', value: FilterOptions.ThisWeek },
  { label: 'This Month', value: FilterOptions.ThisMonth },
  { label: 'Last Month', value: FilterOptions.LastMonth },
  { label: 'Past 30 days', value: FilterOptions.Past30days },
];

interface Props {
  isMenu?: boolean;
}

const ChartSection: FC<Props> = ({ isMenu }) => {
  const dispatch = useDispatch();
  const { chart, totalSales, isSelectedStore, timelineRecommendation } = useSelector((store: StoreState) => ({
    chart: store.storeFront.dashboard.chart,
    totalSales: store.storeFront.dashboard.totalSales,
    isSelectedStore: store.common.isSelectedStore,
    timelineRecommendation: store?.storeFront?.dashboard?.timelineRecommendation,
  }));
  const { currentWidthScreen } = useScreenDetect();
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.Past30days);
  const storeFront = checkExistLocalStorage() && localStorage.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  const data = useMemo(() => {
    return chart.map((item) => ({
      date: dayjs(item.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
      sale: item.sale,
    }));
  }, [chart]);

  useEffect(() => {
    let payload = {};
    switch (filter) {
      case FilterOptions.Today:
        payload = {
          type: 'day',
          fromDay: dayjs().utc().startOf('day').unix(),
          toDay: dayjs().utc().unix(),
          storefrontIds,
        };
        break;

      case FilterOptions.Yesterday:
        payload = {
          type: 'day',
          fromDay: dayjs().utc().add(-1, 'days').startOf('day').unix(),
          toDay: dayjs().utc().add(-1, 'days').endOf('day').unix(),
          storefrontIds,
        };
        break;

      case FilterOptions.ThisWeek:
        payload = {
          type: 'day',
          fromDay: dayjs().utc().startOf('week').unix(),
          toDay: dayjs().utc().unix(),
          storefrontIds,
        };
        break;

      case FilterOptions.LastMonth:
        payload = {
          type: 'month',
          month: dayjs().utc().add(-1, 'month').format('YYYY-MM'),
          storefrontIds,
        };
        break;

      case FilterOptions.Past30days:
        payload = {
          type: 'day',
          fromDay: dayjs().utc().add(-30, 'days').startOf('day').unix(),
          toDay: dayjs().utc().endOf('day').unix(),
          storefrontIds,
        };
        break;

      case FilterOptions.ThisMonth:
        payload = {
          type: 'month',
          month: dayjs().utc().format('YYYY-MM'),
          storefrontIds,
        };
        break;

      default:
        break;
    }
    dispatch(getStorefrontChart(payload));
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [filter, storeFront, storefrontIds, isSelectedStore]);

  const handleChangeFilter = useCallback((value: { label: string; value: FilterOptions }) => {
    setFilter(value.value);
  }, []);

  const renderTooltip = useCallback(({ active, payload, label }) => {
    if (active) {
      return (
        <div className={classes.customTooltip}>
          <p className={classes.valueTooltip}>{formatCurrency((payload || [])[0]?.value || 0, false)}</p>
          <p className={classes.labelTooltip}>{label}</p>
        </div>
      );
    }
    return null;
  }, []);

  const renderFilterDate = useCallback(() => {
    return (
      <div className={classes.select}>
        <Select
          inputId={'chart-filter'}
          value={filter}
          options={filterOptions}
          onChange={handleChangeFilter}
          selectStyles={{
            control: { backgroundColor: 'transparent', fontWeight: 500, padding: '0px !important' },
            singleValue: {
              fontSize:
                currentWidthScreen >= 1200 ? pxToRem(22) : currentWidthScreen >= 768 ? pxToRem(18) : pxToRem(16),
              color: '#828D9B',
            },
          }}
        />
      </div>
    );
  }, [currentWidthScreen, filter, handleChangeFilter]);

  return (
    <div>
      <div className={classes.heading}>
        <h3
          className={cx(classes.subTitle, {
            [classes.salesSubtitle]: isMenu && currentWidthScreen >= 768,
          })}>
          Sales – Past 30 days
          {!isMenu ? (
            <span className={classes.totalSales}>{formatCurrency(totalSales, false)}</span>
          ) : (
            <div>{renderFilterDate()}</div>
          )}
        </h3>
        {!isMenu && <div>{renderFilterDate()}</div>}
      </div>
      <Card className={classes.chartCard}>
        <ResponsiveContainer width={'100%'} height={400} className={classes.chart}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 5,
            }}>
            <CartesianGrid vertical={false} strokeDasharray={'3 3'} />
            <XAxis
              type={'category'}
              dataKey={'date'}
              angle={45}
              interval={'preserveStartEnd'}
              tickLine={false}
              tick={false}
              tickMargin={10}
            />
            <YAxis type={'number'} axisLine={false} tickLine={false} />
            <Tooltip content={renderTooltip} />
            <Bar dataKey={'sale'} fill={'#4cb3e4'} />
          </BarChart>
        </ResponsiveContainer>
        <div className={classes.saleToday}>
          <div>Today</div>
          <div>{formatCurrencyFixed(timelineRecommendation?.today || 0, false)}</div>
        </div>
        <div className={classes.sale7Today}>
          <div>Last 7 days</div>
          <div>{formatCurrencyFixed(timelineRecommendation?.last7Days || 0, false)}</div>
        </div>
        <div className={classes.sale7Today}>
          <div>Last 30 days</div>
          <div>{formatCurrencyFixed(timelineRecommendation?.last30Days || 0, false)}</div>
        </div>
        <div className={classes.saleLast90day}>
          <div>Last 90 days</div>
          <div>{formatCurrencyFixed(timelineRecommendation?.last90Days || 0, false)}</div>
        </div>
      </Card>
    </div>
  );
};

export default ChartSection;
