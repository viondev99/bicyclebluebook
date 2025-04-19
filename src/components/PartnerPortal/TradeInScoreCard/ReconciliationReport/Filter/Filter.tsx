import React, { FC, useState, useCallback, useMemo, ReactElement } from 'react';
import Card from '@ui/Cards';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import cx from 'classnames';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import Select from '@ui/Select/Select';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { checkRangeDatePicker, convertToUnixTime } from 'helpers/date.helper';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { ReconciliationReportPayload } from 'api/partner/reconciliation-report.api';
import moment from 'moment';
import MultiSelect from '@ui/MutilSelect';
import { ReconciliationReportStatus } from 'constants/reconciliation-report';
import ScoreCardList from '../ScoreCardList/ScoreCardList';
import classes from './filter.module.scss';

const valueEndOfDate = moment().endOf('day');
const last13days = moment(valueEndOfDate).subtract(13, 'days');
const FilterStatus = [
  { value: ReconciliationReportStatus.OPEN, label: 'Open' },
  { value: ReconciliationReportStatus.DUE, label: 'Due' },
  { value: ReconciliationReportStatus.PAID, label: 'Paid' },
  { value: ReconciliationReportStatus.CANCELED, label: 'Canceled' },
  { value: ReconciliationReportStatus.NON_COMPLIANT, label: 'Non Compliant' },
];

const SortSelect = [
  { value: 'account_name', label: 'Account Name' },
  { value: 'inventory_date_received', label: 'Date Received' },
  { value: 'inventory_trade_in', label: 'Trade in Value' },
  { value: 'inventory_created_date', label: 'Date created' },
];

const dataSelect = [
  { label: 'Today', value: 'day' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom Date', value: 'custom_date' },
];

const FilterReconciliationReport: FC = () => {
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [selectDateVisibleMobile, setSelectDateVisibleMobile] = useState<boolean>(false);
  const [filterMobile, toggleFilterMobile] = useState<boolean>(false);
  const [status, setStatus] = useState('Due,Non-Compliant,Open');
  const [sortField, setSortField] = useState('');
  const [dateReceived, setDateReceived] = useState('custom_date');
  const [isCustomDate, setIsCustomDate] = useState(true);
  const [statusMutilSelect, setStatusMutilSelect] = useState<{ label: string; value: string }[]>([
    { value: ReconciliationReportStatus.OPEN, label: 'Open' },
    { value: ReconciliationReportStatus.DUE, label: 'Due' },
    { value: ReconciliationReportStatus.NON_COMPLIANT, label: 'Non Compliant' },
  ]);
  const { partnerId } = useSelector((store: StoreState) => ({
    partnerId: store.authenticate?.user?.partner,
  }));
  const [bodyReconciliationReport, setBodyReconciliationReport] = useState<ReconciliationReportPayload>({
    status,
    parent_id: partnerId,
    is_exists_salesforce_id: true,
    start_time: 0,
    end_time: convertToUnixTime(last13days),
  });

  const dispatch = useDispatch();

  const [ranges, setRanges] = useState(() => {
    return {
      startDate: null,
      endDate: last13days,
    };
  });

  const handleChangeDate = useCallback(
    (values) => {
      setRanges({
        startDate: values?.startDate,
        endDate: values?.endDate,
      });
      setBodyReconciliationReport({
        ...bodyReconciliationReport,
        start_time: convertToUnixTime(values?.startDate),
        end_time: convertToUnixTime(values?.endDate),
      });
      dispatch(
        scoreCardAction.getListReconciliationReport({
          ...bodyReconciliationReport,
          start_time: convertToUnixTime(values?.startDate),
          end_time: convertToUnixTime(values?.endDate),
        }),
      );
    },
    [bodyReconciliationReport, dispatch],
  );

  const handleCancelDate = useCallback(() => {
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, []);

  const handleSubmitDate = useCallback(() => {
    dispatch(scoreCardAction.getListReconciliationReport(bodyReconciliationReport));
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, [bodyReconciliationReport, dispatch]);

  const handleChangeStatus = useCallback(
    (statusHandle: [{ label: string; value: string }]) => {
      const statusString = statusHandle.map((el) => el.value).join(',');
      const bodyReconciliationReportConvert = {
        ...bodyReconciliationReport,
        status: statusString,
      };
      setStatus(statusString);
      setStatusMutilSelect(statusHandle);
      setBodyReconciliationReport(bodyReconciliationReportConvert);
      // dispatch(scoreCardAction.getListReconciliationReport(bodyReconciliationReportConvert));
    },
    [bodyReconciliationReport],
  );
  const handleSortSelect = useCallback((sortSelect: { label: string; value: string }) => {
    setSortField(sortSelect.value);
  }, []);

  const handleDateReceived = useCallback(
    (select: { label: string; value: string }) => {
      const results = checkRangeDatePicker(ranges.startDate, ranges.endDate, select.value);
      const bodyReconciliationReportConvert = {
        ...bodyReconciliationReport,
        start_time: convertToUnixTime(results?.fromDate),
        end_time: convertToUnixTime(results?.toDate),
      };
      setDateReceived(select?.value);
      setBodyReconciliationReport(bodyReconciliationReportConvert);
      select.value === 'custom_date' ? setIsCustomDate(true) : setIsCustomDate(false);
      dispatch(scoreCardAction.getListReconciliationReport(bodyReconciliationReportConvert));
    },
    [ranges.startDate, ranges.endDate, bodyReconciliationReport, dispatch],
  );

  const renderSelectMenu = useMemo((): ReactElement => {
    return (
      <div className={classes.groupStatusListing}>
        <div className={classes.selectContainer}>
          <MultiSelect
            fieldName={''}
            onChange={handleChangeStatus}
            options={FilterStatus}
            value={statusMutilSelect}
            labelSelectAll={'All PO Status'}
            hideSearch={true}
            placeholder="Select PO Status"
            onBlur={() => dispatch(scoreCardAction.getListReconciliationReport(bodyReconciliationReport))}
          />
        </div>
      </div>
    );
  }, [bodyReconciliationReport, dispatch, handleChangeStatus, statusMutilSelect]);

  const renderGroupFilter = useCallback((): ReactElement => {
    return (
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
        {/* <div className={classes.title}>Sort</div>
        <div className={classes.sortContainer}>
          <Select
            inputId={'filter-status-2'}
            selectStyles={{
              control: { backgroundColor: 'transparent', cursor: 'pointer' },
              singleValue: { color: '#1b2028', fontWeight: 500 },
            }}
            value={sortField}
            options={SortSelect}
            onChange={handleSortSelect}
          />
        </div> */}
      </div>
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
        {!filterMobile && renderSelectMenu}
        {filterMobile && (
          <div className={classes.wrapAction}>
            <div className={classes.sortContainer}>
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
    renderSelectMenu,
    selectDateVisibleMobile,
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
      <ScoreCardList sortField={sortField} />
    </>
  );
};

export default FilterReconciliationReport;
