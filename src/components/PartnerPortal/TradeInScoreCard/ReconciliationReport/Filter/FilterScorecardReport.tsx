import React, { FC, useState, useCallback, useMemo, ReactElement, useEffect } from 'react';
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
import { parseJwt } from 'helpers/utilities.helper';
import { getPartners } from 'store/common/common.action';
import ScorecardReportList from '../ScoreCardList/ScorecardReportList';
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
  const dispatch = useDispatch();
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [selectDateVisibleMobile, setSelectDateVisibleMobile] = useState<boolean>(false);
  const [filterMobile, toggleFilterMobile] = useState<boolean>(false);
  const [status, setStatus] = useState('Due,Non-Compliant,Open');
  const [sortField, setSortField] = useState('');
  const [dateReceived, setDateReceived] = useState('month');
  const [isCustomDate, setIsCustomDate] = useState(false);
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

  const dataReport = useSelector((store: StoreState) => store.partner.scorecard.dataReportScorecard);
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const partners = useSelector((state: StoreState) => state.common.partners);
  const token = parseJwt(useSelector((state: StoreState) => state.authenticate.token));

  const [ranges, setRanges] = useState(() => {
    return {
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month'),
    };
  });

  useEffect(() => {
    if (partners?.length > 0) {
      const listPartnerIds = partners.map((it) => it.id);
      dispatch(
        scoreCardAction.reportScorecard({
          displayTypes: ['DETAIL'],
          fromDate: convertToUnixTime(ranges.startDate),
          partnerIds: listPartnerIds,
          privateAPI: true,
          sortField: 'TITLE',
          sortType: 'ASC',
          toDate: convertToUnixTime(ranges.endDate, true),
        }),
      );
    }
  }, [dispatch, partners, ranges.endDate, ranges.startDate]);

  useEffect(() => {
    dispatch(getPartners({ page_size: -1 }));
  }, [dispatch]);

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

  const handleSubmitDate = useCallback(() => {
    setSelectDateVisible(false);
    setSelectDateVisibleMobile(false);
  }, []);

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
      setRanges({
        startDate: results?.fromDate,
        endDate: results?.toDate,
      });
      setDateReceived(select?.value);
      setIsCustomDate(select.value === 'custom_date');
    },
    [ranges.startDate, ranges.endDate],
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
    selectDateVisibleMobile,
  ]);
  const showFilterDeskTop = useMemo((): ReactElement => {
    return <Card className={cx(classes.listingAction, classes.filterDesktop)}>{renderGroupFilter()}</Card>;
  }, [renderGroupFilter]);

  return (
    <>
      {showFilterMobile}
      {showFilterDeskTop}
      <ScorecardReportList sortField={sortField} />
    </>
  );
};

export default FilterReconciliationReport;
