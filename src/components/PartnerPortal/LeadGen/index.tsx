/* eslint-disable import/named */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';
import moment from 'moment';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import OrderSkeleton from 'components/StoreFront/Order/Buyer/Listing/OrderItem/OrderSkeleton';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import StoreState from 'model/store';
import { getListLeadGen, saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import { ItemLeadGen } from 'model/store/partner/lead-gen.model';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import useScreenDetect from 'hooks/useScreenDetect';
import SearchBar from './SearchBar';
import classes from './lead-gen.module.scss';
import LeadGenItem from './LeadGenItem';

const PAGE_SIZE_DEFAULT = 10;

const LeadGen = () => {
  const dispatch = useDispatch();
  const { query, replace, pathname } = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const dataLeadGen = useSelector((store: StoreState) => store.partner.account.dataLeadGen);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [searchBoxVisible, setSearchBoxVisible] = useState<boolean>(query?.search && `${query?.search}`?.trim() !== '');
  const [ranges, setRanges] = useState({
    startDate: moment(query?.time_start),
    endDate: moment(query?.time_end),
  });
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);

  useEffect(() => {
    const payload: any = {
      page_size: PAGE_SIZE_DEFAULT,
      sort: 'date_updated:-1',
    };
    if (query.page) {
      payload.page = query.page;
    }
    if (query.search) {
      payload.search_key = query.search;
    }
    if (query.time_start) {
      payload.start_date = query.time_start;
    }
    if (query.time_end) {
      payload.end_date = query.time_end;
    }
    dispatch(getListLeadGen(payload));
  }, [dispatch, query]);

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
        time_start: moment(ranges.startDate).format('MM/DD/YYYY'),
        time_end: moment(ranges.endDate).format('MM/DD/YYYY'),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, ranges, replace]);

  const isSearch = query.search || query.time_start || query.time_end;

  const renderNoResult = useMemo(() => {
    return <div className={classes.notFoundText}>There’s no data.</div>;
  }, []);

  const renderListLeadGen = useMemo(() => {
    const renderListItem =
      dataLeadGen?.data?.length > 0
        ? dataLeadGen.data.map((item: ItemLeadGen, index: number) => {
            return <LeadGenItem item={item} key={item._id} index={index} />;
          })
        : renderNoResult;

    return (
      <div>
        {renderListItem}
        {dataLeadGen && (
          <Pagination totalPage={dataLeadGen?.total_page} page={dataLeadGen?.page} onChangePage={handleChangePage} />
        )}
      </div>
    );
  }, [dataLeadGen, handleChangePage, renderNoResult]);

  const renderLoading = useMemo(() => {
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
    <>
      <div className={classes.wrapTour}>
        {stepTour === 10 && currentWidthScreen >= 768 && !loading && (
          <div className={classes.wrapItem}>
            <Row className={classes.mb13}>
              <Col lg={3} md={4}>
                <div className={classes.wrapColLeft}>
                  <div className={classes.titleItem}>Date</div>
                  <div className={classes.description}>02/02/2022</div>
                </div>
              </Col>
              <Col lg={9} md={8}>
                <div className={classes.wrapColRight}>
                  <div className={classes.titleItem}>Item</div>
                  <div className={classes.description}>2020 All-City Cosmic Stallion Force 1</div>
                </div>
              </Col>
            </Row>

            <Row className={classes.mb13}>
              <Col lg={3} md={4} xs={6}>
                <div className={cx('d-flex align-items-center', classes.cp)}>
                  <div className={cx(classes.text18Blue, 'mr-3')}>Full Details</div>
                  <img
                    src={images.icArrowDownBlue}
                    alt="arrow-down"
                    // className={item.visibleFullDetail && classes.isRotate180}
                  />
                </div>
              </Col>
              <Col lg={9} md={4} xs={6}>
                <div className={cx(classes.wrapColRight, classes.mobileFlexEnd)}>
                  <button type="button" className={cx(classes.linkButtonAfterClick, classes.linkButton)}>
                    Create scorecard
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        )}
        {/* {stepTour === 10 && !loading && (
          <div className={classes.wrapModal}>
            {currentWidthScreen >= 768 && <div className={classes.arrowUp} />}
            <div className="mb-3">
              Lead Gen is where you can access the sales qualified leads that come in from your trade-in webpage. You
              can view the details of the lead and see the customer’s contact information and see what they want to buy.
            </div>
            <div>
              If they decide to move forward with the purchase from your store, you can start the trade-in scorecard
              within the lead by clicking “create scorecard.”
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                onClick={() => {
                  dispatch(saveStatusShowPartnerTour(false));
                  dispatch(handleChangeStepTour({ steps: 9 }));
                  replace('/trade-in-account/cost-calculator');
                }}
                className={classes.buttonBack}>
                Back
              </button>
              <button
                type="button"
                className={classes.buttonNext}
                onClick={() => {
                  dispatch(saveStatusShowPartnerTour(false));
                  dispatch(handleChangeStepTour({ steps: 11 }));
                  replace('/trade-in-account/sales-calculator');
                }}>
                Next
              </button>
            </div>
          </div>
        )} */}
      </div>
      <Card className={cx('position-relative', classes.wrapCard)}>
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

        {(isSearch || dataLeadGen?.data?.length > 0) && (
          <div className={cx('d-flex flex-row', classes.headerCard)}>
            <div className={classes.headerTitle}>Lead Gen History</div>
            <div>
              <Button
                buttonType={'transparent'}
                onClick={() => {
                  setSearchBoxVisible(!searchBoxVisible);
                }}>
                <img src={images.iconSearch} alt={'Icon search'} />
              </Button>

              <Button
                buttonType={'transparent'}
                className={cx('ml-4')}
                onClick={() => {
                  setSelectDateVisible(!selectDateVisible);
                }}>
                <img src={images.icCalendar} alt={'Select Dates'} />
              </Button>
            </div>
          </div>
        )}
        {searchBoxVisible && <SearchBar />}
        {loading ? <div className={'mt-5'}>{renderLoading}</div> : renderListLeadGen}
      </Card>
    </>
  );
};

export default LeadGen;
