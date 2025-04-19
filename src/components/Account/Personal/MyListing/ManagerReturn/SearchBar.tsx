import React, { FC, useState, useCallback, KeyboardEvent } from 'react';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import { useRouter } from 'next/router';
import Tooltip from '@ui/Tooltip/Tooltip';
import icSearchHome from 'assets/img/home/ic_search_home.svg';
import icCalendar from 'assets/img/common/ic_calendar.svg';
import omit from 'lodash/omit';
import moment from 'moment';
import Card from '@ui/Cards';
import Input from '@ui/Inputs/Input';
import Button from '@ui/Buttons/Primary/Button';
import classes from './manager-return.module.scss';

interface Props {
  keySearch?: string;
}

const SearchBar: FC<Props> = ({ keySearch }) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const { query, replace, pathname } = useRouter();
  const [ranges, setRanges] = useState({
    startDate: moment(),
    endDate: moment(),
  });

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values.startDate,
      endDate: values.endDate,
    });
  }, []);

  const handleSubmitDate = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        time_start: ranges.startDate.startOf('day').unix(),
        time_end: ranges.endDate.endOf('day').unix(),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, ranges, replace]);

  const handleCancelDate = useCallback(() => {
    setRanges({
      startDate: null,
      endDate: null,
    });
    replace({
      pathname,
      query: {
        ...omit(query, ['time_start', 'time_end']),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, replace]);

  const handleSearch = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        pattern: textSearch ? `${keySearch || 'reason_buyer_return'}:${textSearch}` : '',
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [keySearch, pathname, query, replace, textSearch]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const renderTooltipForSearchDates = () => {
    return (
      <Card className={classes.card}>
        <h5>Search Dates</h5>
      </Card>
    );
  };

  return (
    <Card className={classes.cardSearchBar}>
      <div className={classes.wrapInput}>
        <Input
          type="string"
          className={classes.inputSearch}
          value={textSearch}
          onKeyDown={handleKeyPress}
          renderSuffix={
            <Button buttonType="clear" onClick={handleSearch} className={classes.showWhenMobile}>
              <img src={icSearchHome} alt={'search'} />
            </Button>
          }
          onChange={(e) => setTextSearch(e.target.value)}
        />
        <Button className={classes.hideWhenMobile} buttonSize="s" buttonType="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div className={classes.dateRange}>
        <Button
          buttonType={'transparent'}
          className={classes.customDateBtn}
          onClick={() => {
            setSelectDateVisible(!selectDateVisible);
          }}>
          <Tooltip renderTooltip={renderTooltipForSearchDates()}>
            <img src={icCalendar} alt={'Select Dates'} />
          </Tooltip>
        </Button>
        {selectDateVisible && (
          <div className={classes.dateRangePicker}>
            <DateRangePicker
              handleCloseWhenClickOut={() => setSelectDateVisible(false)}
              onDatesChange={handleChangeDate}
              startDate={ranges.startDate}
              endDate={ranges.endDate}
              handleCancel={handleCancelDate}
              handleSubmit={handleSubmitDate}
              // isOutsideRange={(day) => !moment(day).isBefore(moment(), 'day')}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchBar;
