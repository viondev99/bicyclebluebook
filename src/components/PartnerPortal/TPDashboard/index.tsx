/* eslint-disable no-nested-ternary */
import Card from '@ui/Cards';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import StoreState from 'model/store';
import moment from 'moment';
import { useRouter } from 'next/router';
import images from 'assets/images';
import Select from '@ui/Select/Select';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getActionNewesteNotification,
  getListPartnerLocation,
  getNewesteNotification,
  getTradeInScorecardReports,
  saveStatusShowPartnerTour,
} from 'store/partner/account/account.action';
import { convertToUnixTime } from 'helpers/date.helper';
import { useCheckLogin } from 'hooks/useCheckLogin';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Link from 'next/dist/client/link';
import useScreenDetect from 'hooks/useScreenDetect';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { PARTNER_ROLES } from 'helpers/constraint.helper';
import { parseJwt } from 'helpers/utilities.helper';
import BodyTPDashboard from './BodyTPDashboard';
import classes from './tp-dashboard.module.scss';
import NewesteNotification from './NewesteNotification';

const defaultOnlineStoreOptions = [
  {
    _id: '',
    name: 'All',
  },
];

const ProgramTerms: FC = () => {
  const dispatch = useDispatch();
  const dataPartnerLocation = useSelector((store: StoreState) => store.partner.account.dataPartnerLocation);
  const checkRoleUserLogin = useSelector((store: StoreState) => store.authenticate.user?.role);
  const { currentWidthScreen } = useScreenDetect();
  const checkLogged = useCheckLogin();
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  // const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const { query, replace, pathname } = useRouter();
  const [ranges, setRanges] = useState({
    startDate: moment().clone().startOf('month'),
    endDate: moment().clone().endOf('month'),
  });
  const dataNewesteNoti = useSelector((state: StoreState) => state.partner.account.dataNewesteNotification?.data);
  const itemNoti = dataNewesteNoti?.filter((it) => dataNewesteNoti?.indexOf(it) === 0);
  const idNoti = itemNoti?.map((it) => it._id).toString();
  const [partnerIds, setpartnerIds] = useState('');
  const token = parseJwt(useSelector((state: StoreState) => state.authenticate.token));
  const idPartner = token?.partner;

  const onlineStoreOptions = useMemo(() => {
    return Array.isArray(dataPartnerLocation?.data) && dataPartnerLocation?.data.length > 0
      ? [...defaultOnlineStoreOptions, ...dataPartnerLocation.data].map((it) => {
          return {
            label: it.name,
            value: it._id,
          };
        })
      : [];
  }, [dataPartnerLocation]);

  useEffect(() => {
    if (checkLogged) {
      handleGetListingOnlineStore();
      handleGetTradeInScorecardReports();
    }
  }, [checkLogged]);

  useEffect(() => {
    handleGetTradeInScorecardReports();
  }, [partnerIds]);

  const handleGetListingOnlineStore = useCallback(() => {
    if (checkRoleUserLogin !== PARTNER_ROLES.EMPLOYEE) {
      dispatch(getListPartnerLocation({ page_size: -1 }));
    }
  }, [checkRoleUserLogin, dispatch]);

  const handleGetTradeInScorecardReports = useCallback(() => {
    dispatch(
      getTradeInScorecardReports({
        fromDate: convertToUnixTime(ranges.startDate),
        toDate: convertToUnixTime(ranges.endDate, true),
        partnerIds: partnerIds !== '' ? [partnerIds] : [],
      }),
    );
  }, [dispatch, partnerIds, ranges]);

  const handleGetTradeInScorecardReportsDefault = useCallback(() => {
    dispatch(
      getTradeInScorecardReports({
        fromDate: convertToUnixTime(moment().clone().startOf('month')),
        toDate: convertToUnixTime(moment().clone().endOf('month'), true),
        partnerIds: [],
      }),
    );
  }, [dispatch]);

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
    handleGetTradeInScorecardReportsDefault();
    setSelectDateVisible(false);
  }, [pathname, query, replace]);

  const handleSubmitDate = useCallback(() => {
    handleGetTradeInScorecardReports();
    setSelectDateVisible(false);
  }, [pathname, query, ranges, replace]);

  const handleChangeSelect = (value: string) => {
    setpartnerIds(value);
  };

  const handleActionTour = useCallback(() => {
    dispatch(saveStatusShowPartnerTour(false));
    dispatch(handleChangeStepTour({ steps: 2 }));
  }, [dispatch]);

  useEffect(() => {
    if (checkLogged) {
      dispatch(
        getNewesteNotification({
          is_partner_list: true,
          partner_id: token?.partner,
          sort: 'date_published:-1',
        }),
      );
    }
  }, [checkLogged, dispatch]);

  const actionRead = useCallback(
    (isRead?: boolean, isDismis?: boolean) => {
      const payload = {
        body: { partner: idPartner, is_read: isRead, is_dismiss: isDismis },
        id: idNoti,
        partner_id: token?.partner,
      };
      if (idPartner && idNoti) {
        dispatch(getActionNewesteNotification(payload));
      }
    },
    [dispatch, idNoti, idPartner],
  );

  return (
    <>
      <div>
        {stepTour === 1 && (
          <div className={classes.wrapModal}>
            {currentWidthScreen >= 768 && <div className={classes.arrowLeft} />}
            <div className="mb-4">You will automatically be taken to the dashboard when logged in.</div>
            <div className="d-flex justify-content-between">
              <button type="button" disabled className={classes.buttonBack}>
                Back
              </button>
              <button type="button" className={classes.buttonNext} onClick={handleActionTour}>
                Next
              </button>
            </div>
          </div>
        )}
        <NewesteNotification actionRead={actionRead} actionDismiss={actionRead} />
        <Card className={classes.wrapContainerSelect}>
          <Row className={classes.wrapFilter}>
            <Col xs={6} className={classes.customSelectAll}>
              <Select
                inputId={'Search-miles-within'}
                className={classes.customSelect}
                selectSize={'l'}
                options={onlineStoreOptions}
                value={String(partnerIds)}
                onChange={(option: any) => handleChangeSelect(option.value)}
                selectStyles={{
                  control: {
                    backgroundColor: 'transparent',
                    padding: '0',
                    minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                  },
                }}
              />

              <div
                className={classes.customSelectCalender}
                onClick={() => {
                  setSelectDateVisible(true);
                }}>
                <img className={classes.setCalenderIcon} src={images.icCalendar} alt={'Select Dates'} />
              </div>
            </Col>

            <Col xs={6} className={classes.wrapLink}>
              <span className={classes.setLinkToNewScoreCard}>
                <Link href="/trade-in-account/trade-in/new">
                  <a>Create new scorecard</a>
                </Link>
              </span>
            </Col>
          </Row>
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
        </Card>

        <BodyTPDashboard />
      </div>
    </>
  );
};

export default ProgramTerms;
