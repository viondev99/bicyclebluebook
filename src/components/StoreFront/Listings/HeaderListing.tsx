/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState, useCallback, KeyboardEvent, useMemo, ReactElement } from 'react';
import Card from '@ui/Cards';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';
import moment from 'moment';
import { TypeListingOptions, StatusSoldListingOptions, ReturnManageOptions } from 'constants/listing';
import { StageInventory } from 'model/store/common.model';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import cx from 'classnames';
import Checkbox from '@ui/CheckBox';
import Button from '@ui/Buttons/Primary/Button';
import Input from '@ui/Inputs/Input';
import Select from '@ui/Select/Select';
import useScreenDetect from 'hooks/useScreenDetect';
import Dropdown from '@ui/Dropdown/Dropdown';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import icCalendar from 'assets/img/common/ic_calendar.svg';
import iconFilterMarketplace from 'assets/img/marketplace/ic_filter.svg';
import iconSearch from 'assets/img/header/ic_search.svg';
import icArrowFilterSelect from 'assets/img/common/ic_arrow_filter_select.svg';
import classes from './listing.module.scss';
import { useUserIsBBB } from '../../../hooks/useUserIsBBB';
import MenuSort from './MenuSort';
import MenuFilterStatus from './MenuFilterStatus';

interface Props {
  totalItem: number;
}

const HeaderListing: FC<Props> = ({ totalItem }) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [showSearch, openSearch] = useState<boolean>(false);
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [selectDateVisibleMobile, setSelectDateVisibleMobile] = useState<boolean>(false);
  const [filterMobile, toggleFilterMobile] = useState<boolean>(false);
  const isUserBBBStaff = useUserIsBBB();
  const { currentWidthScreen } = useScreenDetect();
  const [ranges, setRanges] = useState({
    startDate: moment().utc(),
    endDate: moment().utc(),
  });
  const { query, replace, pathname } = useRouter();
  useEffect(() => {
    setTextSearch(query?.content ? String(query?.content) : '');
    setRanges({
      startDate: query?.fromDay ? moment.unix(Number(query?.fromDay)) : moment().utc(),
      endDate: query?.toDay ? moment.unix(Number(query?.toDay)) : moment().utc(),
    });
  }, [query]);

  const handleOpenSearch = useCallback(() => {
    openSearch(!showSearch);
  }, [showSearch]);

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values.startDate,
      endDate: values.endDate,
    });
  }, []);

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
    replace({
      pathname,
      query: {
        ...query,
        fromDay: ranges.startDate.utc().startOf('day').unix(),
        toDay: ranges.endDate.utc().unix(),
        page: 1,
      },
    });
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, [pathname, query, ranges.endDate, ranges.startDate, replace]);

  const handleChangeStatusListing = useCallback(
    (status: { label: string; value: string }) => {
      replace({
        pathname,
        query: {
          ...omit(query, ['fromDay', 'toDay', 'content', 'sortField', 'sortType', 'soldFilter', 'sort']),
          statuses: status.value,
          page: 1,
        },
      });
    },
    [pathname, query, replace],
  );

  const handleChangeStatusSoldListing = useCallback(
    (status: { label: string; value: string }) => {
      replace({
        pathname,
        query: {
          ...query,
          soldFilter: status.value,
          page: 1,
        },
      });
    },
    [pathname, query, replace],
  );

  const handleSearchAssembled = useCallback(
    (value) => {
      replace({
        pathname,
        query: {
          ...query,
          isAvailableAssembled: !value === true ? true : null,
          page: 1,
        },
      });
    },
    [pathname, query, replace],
  );

  const handleSearchOffer = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        content: textSearch,
        page: 1,
      },
    });
  }, [pathname, query, replace, textSearch]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        handleSearchOffer();
      }
    },
    [handleSearchOffer],
  );

  const addTotalItemToLabel = useMemo(() => {
    const result = TypeListingOptions.map((item) => {
      if (item.value === query.statuses) {
        return { label: `${item.label} ${totalItem ? `(${totalItem})` : ''}`, value: item.value };
      }
      return item;
    });
    return result;
  }, [query.statuses, totalItem]);

  const renderLabelListing = useMemo(() => {
    const result = TypeListingOptions.map((item) => {
      if (item.value === query.statuses) {
        return `${item.label} ${totalItem ? `(${totalItem})` : ''}`;
      }
    });
    return result;
  }, [query.statuses, totalItem]);

  const renderSelectStatusTabSold = useMemo((): ReactElement => {
    return (
      <div
        className={cx(classes.selectStatusSold, {
          [classes.selectStatusSoldMobile]: currentWidthScreen === 1024,
        })}>
        <Select
          inputId={'filter-status'}
          selectStyles={{
            control: { backgroundColor: 'transparent', cursor: 'pointer' },
            singleValue: { color: '#1b2028' },
          }}
          value={query?.soldFilter ? String(query?.soldFilter) : 'all'}
          options={StatusSoldListingOptions}
          onChange={handleChangeStatusSoldListing}
        />
      </div>
    );
  }, [handleChangeStatusSoldListing, query, currentWidthScreen]);

  const renderSelectMenu = useMemo((): ReactElement => {
    return (
      <div className={classes.groupStatusListing}>
        <div
          className={cx(classes.selectContainer, {
            [classes.selectContainerMobile]:
              currentWidthScreen === 1024 && !(query?.isManagerReturn || query?.isCancellations),
          })}>
          {query?.isManagerReturn || query?.isCancellations ? (
            <span className="ml-3">{renderLabelListing}</span>
          ) : (
            <Select
              inputId={'filter-status-2'}
              selectStyles={{
                control: { backgroundColor: 'transparent', cursor: 'pointer' },
                singleValue: { color: '#1b2028', fontWeight: 500 },
              }}
              value={query?.statuses ? String(query?.statuses) : StageInventory.Listed}
              options={addTotalItemToLabel}
              onChange={handleChangeStatusListing}
            />
          )}
        </div>
        {query?.statuses === StageInventory.Sold && renderSelectStatusTabSold}
      </div>
    );
  }, [addTotalItemToLabel, handleChangeStatusListing, query, renderSelectStatusTabSold, currentWidthScreen]);

  const renderAssembled = useMemo(() => {
    if (
      String(query?.statuses) !== StageInventory.CustomerReturned &&
      String(query?.statuses) !== StageInventory.Cancelled &&
      isUserBBBStaff
    ) {
      return (
        <div className={classes.groupAssembled}>
          <Checkbox
            checked={query?.isAvailableAssembled === 'true'}
            onChange={() => handleSearchAssembled(query?.isAvailableAssembled === 'true')}
          />
          Assembled
        </div>
      );
    }
    return null;
  }, [handleSearchAssembled, isUserBBBStaff, query]);

  const renderGroupFilter = useCallback((): ReactElement => {
    return (
      <div className={classes.wrapAction}>
        {query?.isManagerReturn && <MenuFilterStatus />}
        <MenuSort />
        <Button buttonType="clear" onClick={handleOpenSearch} className={classes.btnSearchOffer}>
          <img src={iconSearch} alt="icon search" className={classes.icSearchOffer} />
        </Button>
        <div className={classes.wrapCalendar}>
          <Button
            buttonType={'transparent'}
            onClick={() => {
              setSelectDateVisible(true);
            }}>
            <img src={icCalendar} alt={'Select Dates'} />
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
                  // isOutsideRange={(day) => !moment(day).isBefore(moment(), 'day')}
                />
              </div>
            )}
          </div>
        </div>
        {renderAssembled}
      </div>
    );
  }, [
    handleCancelDate,
    handleChangeDate,
    handleOpenSearch,
    handleSubmitDate,
    ranges.endDate,
    ranges.startDate,
    renderAssembled,
    selectDateVisible,
  ]);

  const showFilterMobile = useMemo((): ReactElement => {
    return (
      <>
        {currentWidthScreen < 1024 && (
          <Card className={cx(classes.listingAction, classes.filterMobile)}>
            {!filterMobile && renderSelectMenu}
            {filterMobile && (
              <div className={classes.wrapAction}>
                {query?.isManagerReturn && <MenuFilterStatus />}
                <MenuSort />
                <Button buttonType="clear" onClick={handleOpenSearch}>
                  <img src={iconSearch} alt="icon search" className={classes.icOfferAction} />
                </Button>
                <div className={classes.wrapCalendar}>
                  <Button
                    buttonType={'transparent'}
                    onClick={() => {
                      setSelectDateVisibleMobile(true);
                    }}>
                    <img src={icCalendar} alt={'Select Dates'} />
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
                          // isOutsideRange={(day) => !moment(day).isBefore(moment(), 'day')}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {renderAssembled ? <>{renderAssembled}</> : <div className={classes.groupAssembled} />}
              </div>
            )}
            <Button buttonType="clear" onClick={() => toggleFilterMobile(!filterMobile)}>
              <img src={iconFilterMarketplace} alt="filter icon" />
            </Button>
          </Card>
        )}
      </>
    );
  }, [
    filterMobile,
    handleCancelDate,
    handleChangeDate,
    handleOpenSearch,
    handleSubmitDate,
    ranges.endDate,
    ranges.startDate,
    renderAssembled,
    renderSelectMenu,
    selectDateVisibleMobile,
    currentWidthScreen,
  ]);
  const showFilterDeskTop = useMemo((): ReactElement => {
    return (
      <Card
        className={cx(classes.listingAction, {
          [classes.filterDesktop]: currentWidthScreen < 1024,
        })}>
        {renderSelectMenu}
        {renderGroupFilter()}
      </Card>
    );
  }, [renderGroupFilter, renderSelectMenu, currentWidthScreen]);

  return (
    <>
      {showFilterMobile}
      {showFilterDeskTop}
      {showSearch && (
        <Card className={cx(classes.listingAction, classes.wrapSearch)}>
          <div className={classes.wrapInput}>
            <Input
              placeholder={''}
              className={classes.inputSearch}
              type="text"
              onKeyDown={handleKeyPress}
              value={textSearch}
              onChange={(e: any) => setTextSearch(e.target.value)}
            />
            <Button buttonType="clear" onClick={handleSearchOffer} className={classes.iconSearch}>
              <img src={iconSearch} alt="icon search" />
            </Button>
          </div>
          <Button buttonType="primary" onClick={handleSearchOffer} className={classes.btnSearch}>
            Search
          </Button>
        </Card>
      )}
    </>
  );
};

export default HeaderListing;
