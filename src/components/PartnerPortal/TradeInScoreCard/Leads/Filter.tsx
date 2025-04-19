/* eslint-disable no-nested-ternary */
import React, { FC, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Option } from 'react-select/src/filters';
import { useRouter } from 'next/router';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import Button from '@ui/Buttons/Primary/Button';
import Input from '@ui/Inputs/Input';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import { stagesToTextHistoryLead, statusToTextHistoryLead } from 'components/PartnerPortal/CostCalculator/constraint';
import useScreenDetect from 'hooks/useScreenDetect';

import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import icSearchPrimary from 'assets/img/messages/ic_search_primary.svg';
import icSearchBlack from 'assets/img/messages/ic_search_black.svg';
import icCalendar from 'assets/img/common/ic_calendar.svg';
import icDownloadBlue from 'assets/img/account/partner/icDownloadBlue.svg';
import icDownload from 'assets/img/account/partner/ic_download.svg';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import moment from 'moment';

import { convertToUnixTime } from 'helpers/date.helper';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import classes from '../History/Filter/filter.module.scss';
import { LeadFilterStages, LeadFilterStatus } from '../History/Filter/filterContaints';

const Filter: FC = () => {
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const { query, replace, pathname } = useRouter();
  const loadingButton = useSelector((state: StoreState) => state.partner.scorecard.loadingButton);
  const status = String(query.statuses || '');
  const stages = String(query.stages || '');
  const content = String(query.content || '');
  const [searchValue, setSearchValue] = useState('');
  const [visibleDropdownExport, setVisibleDropdownExport] = useState<boolean>(false);
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [ranges, setRanges] = useState({
    startDate: moment().clone().startOf('month'),
    endDate: moment().clone().endOf('month'),
  });

  const [show, setShow] = useState(false);
  const styleSearch = useMemo(() => {
    if (show) {
      return { height: 60, marginTop: 20, padding: '16px', opacity: 1 };
    }
    return { height: 0, marginTop: 0, padding: '0px 5px 0px 0px', opacity: 0 };
  }, [show]);

  const renderFilterSelectStatus = useMemo(() => {
    return LeadFilterStatus;
  }, []);

  const renderFilterSecteStages = useMemo(() => {
    switch (query?.statuses) {
      case statusToTextHistoryLead.NEW_LEAD:
        return [
          { value: '', label: 'All Stages' },
          {
            value: stagesToTextHistoryLead.NEW_LEAD,
            label: 'New Lead',
          },
        ];

      case statusToTextHistoryLead.OPEN:
        return [
          { value: '', label: 'All Stages' },
          {
            value: stagesToTextHistoryLead.CONTACTED,
            label: 'Contacted',
          },
          {
            value: stagesToTextHistoryLead.FOLLOW_UP_LATER,
            label: 'Follow Up Later',
          },
        ];

      case statusToTextHistoryLead.CLOSED:
        return [
          { value: '', label: 'All Stages' },
          {
            value: stagesToTextHistoryLead.NO_INTEREST,
            label: 'No Interest',
          },
          {
            value: stagesToTextHistoryLead.NON_RESPONSE,
            label: 'Non-Responsive',
          },
        ];

      case statusToTextHistoryLead.CONVERTED:
        return [
          { value: '', label: 'All Stages' },
          {
            value: stagesToTextHistoryLead.CONVERTED,
            label: 'Converted',
          },
        ];

      default:
        return LeadFilterStages;
    }
  }, [query]);

  useEffect(() => {
    setSearchValue(content);
  }, [content]);
  const handleChangeStatus = useCallback(
    (fieds, option: Option) => {
      switch (fieds) {
        case 'statuses':
          replace({
            pathname,
            query: {
              ...query,
              statuses: option.value,
              stages: '',
              page: 1,
            },
          });
          break;

        case 'stages':
          replace({
            pathname,
            query: {
              ...query,
              stages: option.value,
              page: 1,
            },
          });
          break;

        default:
          break;
      }
      // replace({
      //   pathname,
      //   query: {
      //     ...query,
      //     [fieds]: option.value,
      //     page: 1,
      //     content: searchValue,
      //   },
      // });
    },
    [pathname, query, replace],
  );

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values.startDate,
      endDate: values.endDate,
    });
  }, []);

  const handleCancelDate = useCallback(() => {
    setRanges({
      startDate: moment().clone().startOf('month'),
      endDate: moment().clone().endOf('month'),
    });

    delete query?.startDate;
    delete query?.endDate;

    replace({
      pathname,
      query: {
        ...query,
        content: searchValue,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, replace, searchValue]);

  const handleSubmitDate = useCallback(() => {
    setSelectDateVisible(false);
    const newStartDate = moment(ranges.startDate).clone().startOf('day');
    const newEndDate = moment(ranges.endDate).clone().endOf('day');
    replace({
      pathname,
      query: {
        ...query,
        startDate: convertToUnixTime(newStartDate),
        endDate: convertToUnixTime(newEndDate),
        content: searchValue,
      },
    });
  }, [pathname, query, ranges.endDate, ranges.startDate, replace, searchValue]);

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      replace({
        pathname,
        query: {
          ...query,
          content: searchValue,
          page: 1,
        },
      });
    },
    [pathname, query, replace, searchValue],
  );
  const handleShow = useCallback(() => {
    if (!show) {
      return setShow(true);
    }
    delete query?.content;
    replace({
      pathname,
      query: {
        ...query,
        page: 1,
      },
    });
    setShow(false);
  }, [pathname, query, replace, show]);

  const handleExportScorecardHistoryStart = useCallback(
    (isExportAll?: boolean) => {
      if (!loadingButton) {
        dispatch(
          scoreCardAction.handleExportScorecardHistory({
            activeType: query?.tab || 'inbox',
            content: query?.content || '',
            statuses: query?.statuses,
            stages: query?.stages,
            startDate: query?.startDate,
            endDate: query?.endDate,
            isExportAll,
            ranges,
          }),
        );
        setVisibleDropdownExport(false);
      }
    },
    [dispatch, loadingButton, query, ranges],
  );

  const renderFilter = useMemo(() => {
    return (
      <div className={classes.wrapFilterLeft}>
        <Select
          isDisabled={loadingButton}
          inputId={'filter-for-status-hisory'}
          className={classes.filterDropdown}
          options={renderFilterSelectStatus}
          value={status}
          placeholder={'Select Status'}
          onChange={(e: Option) => handleChangeStatus('statuses', e)}
          selectSize={'l'}
          isHistory
          isAutoSize={true}
          selectStyles={{
            control: {
              background: 'transparent',
              minHeight: currentWidthScreen >= 1200 ? '20px' : currentWidthScreen > 767 ? '20px' : '20px',
              padding: 0,
            },
          }}
        />
        <Select
          isDisabled={loadingButton}
          inputId={'filter-for-status-hisory'}
          className={cx(classes.filterDropdown, 'ml-3')}
          options={renderFilterSecteStages}
          value={stages}
          placeholder={'Select Stages'}
          onChange={(e: Option) => handleChangeStatus('stages', e)}
          selectSize={'l'}
          isHistory
          isAutoSize={true}
          selectStyles={{
            control: {
              background: 'transparent',
              minHeight: currentWidthScreen >= 1200 ? '20px' : currentWidthScreen > 767 ? '20px' : '20px',
              padding: 0,
            },
          }}
        />
      </div>
    );
  }, [
    currentWidthScreen,
    handleChangeStatus,
    loadingButton,
    renderFilterSecteStages,
    renderFilterSelectStatus,
    stages,
    status,
  ]);

  const renderFilterRight = useMemo(() => {
    return (
      <div className={classes.wrapRight}>
        <div className={classes.wrapItemRight}>
          <ImageButton
            disabled={loadingButton}
            className={cx(classes.searchIconButton, classes.searchIconPadding)}
            onClick={handleShow}>
            <img className={classes.searchIcon} src={show ? icSearchPrimary : icSearchBlack} alt={'search-icon'} />
          </ImageButton>
          <div
            className={classes.customSelectCalender}
            onClick={() => {
              setSelectDateVisible(true);
            }}>
            <ImageButton
              disabled={loadingButton}
              className={cx(classes.searchIconButton, classes.searchIconPadding)}
              onClick={() => {
                setSelectDateVisible(true);
              }}>
              <img className={classes.setCalenderIcon} src={icCalendar} alt={'Select Dates'} />
            </ImageButton>
          </div>
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
        </div>
        <div className={classes.wrapItemRight}>
          <ImageButton disabled={loadingButton} onClick={() => setVisibleDropdownExport(true)}>
            <img src={visibleDropdownExport ? icDownloadBlue : icDownload} alt="" className={classes.btnExport} />
          </ImageButton>
        </div>
      </div>
    );
  }, [
    handleCancelDate,
    handleChangeDate,
    handleShow,
    handleSubmitDate,
    loadingButton,
    ranges.endDate,
    ranges.startDate,
    selectDateVisible,
    show,
    visibleDropdownExport,
  ]);

  return (
    <>
      <Card className={cx('mt-3', classes.wrapCardFilter)}>
        <div>
          <div className={cx(classes.filterContainer, classes.filterContainerSpace)}>
            {renderFilter}
            {renderFilterRight}
          </div>
        </div>

        {visibleDropdownExport && (
          <InvisibleBackdrop onClick={() => setVisibleDropdownExport(false)}>
            <div className={cx(classes.dropdownListExport)}>
              <div
                className={cx(classes.textExport, loadingButton && classes.disabled)}
                onClick={() => handleExportScorecardHistoryStart()}>
                Export
              </div>
              <div
                onClick={() => handleExportScorecardHistoryStart(true)}
                className={cx(classes.textExport, loadingButton && classes.disabled)}>
                Export All
              </div>
            </div>
          </InvisibleBackdrop>
        )}
      </Card>

      {show && (
        <>
          {currentWidthScreen > 767 ? (
            <Card className={classes.customCardInputSearch}>
              <form style={{ flex: 1 }} className="d-flex" action="#" onSubmit={handleSearch}>
                <Input
                  placeholder={'Search listings'}
                  className={cx(classes.searchInput, classes.customButtonSize)}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loadingButton}
                />
                <Button
                  disabled={loadingButton}
                  className={cx(classes.searchButton, classes.customButtonSize)}
                  type="submit">
                  Search
                </Button>
              </form>
            </Card>
          ) : (
            <Card className={cx(classes.cardSearch)} style={styleSearch}>
              <form className={classes.formSearch} onSubmit={handleSearch}>
                <Input
                  className={classes.inputSearch}
                  placeholder={'Search listings'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loadingButton}
                />
                <div onClick={(e: any) => handleSearch(e)} className={classes.btnSearch}>
                  Search
                </div>
              </form>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default Filter;
