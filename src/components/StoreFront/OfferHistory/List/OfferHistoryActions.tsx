import React, { FC, useState, useCallback, useEffect, KeyboardEvent } from 'react';
import Card from '@ui/Cards';
import Tooltip from '@ui/Tooltip/Tooltip';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import moment from 'moment';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import cx from 'classnames';
import images from 'assets/images';
import Dropdown from '@ui/Dropdown/Dropdown';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import Button from '@ui/Buttons/Primary/Button';
import Input from '@ui/Inputs/Input';
import { StatusHistoryOptions } from 'constants/offer-history';
import classes from './list-offer-history.module.scss';

interface Props {}

const OfferHistoryAction: FC<Props> = ({}) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [statusOffer, setStatusOffer] = useState<string>('All');
  const [actionTab, openActionTab] = useState<string>('');
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [ranges, setRanges] = useState({
    startDate: moment().utc(),
    endDate: moment().utc(),
  });

  const [rangesApplied, setRangesApplied] = useState({
    startDate: moment().utc(),
    endDate: moment().utc(),
  });
  const { query, replace, pathname } = useRouter();

  const handleOpenActionTab = useCallback(
    (nameAction: string) => {
      openActionTab(nameAction === actionTab ? '' : nameAction);
    },
    [actionTab],
  );

  useEffect(() => {
    replace({
      pathname,
      query: {
        ...omit(query, ['fromDay', 'toDay', 'content', 'statuses']),
        page: 1,
      },
    });
  }, []);

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values.startDate,
      endDate: values.endDate,
    });
  }, []);

  const handleCancelDate = useCallback(() => {
    setRangesApplied({
      startDate: null,
      endDate: null,
    });
    setRanges({
      startDate: null,
      endDate: null,
    });
    replace({
      pathname,
      query: {
        ...omit(query, ['fromDay', 'toDay']),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, replace]);

  const handleSubmitDate = useCallback(() => {
    setRangesApplied(ranges);
    replace({
      pathname,
      query: {
        ...query,
        fromDay: ranges.startDate.utc().startOf('day').unix(),
        toDay: ranges.endDate.utc().endOf('day').unix(),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, ranges, replace]);

  const handleChangeStatusOffer = useCallback(
    (status: { label: string; value: string }) => {
      setStatusOffer(status.label);
      handleOpenActionTab('');
      replace({
        pathname,
        query: {
          ...query,
          statuses: status.value,
          page: 1,
        },
      });
    },
    [handleOpenActionTab, pathname, query, replace],
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

  const handleCloseDateRange = useCallback(() => {
    setSelectDateVisible(false);
    setRanges(rangesApplied);
  }, [rangesApplied]);

  const renderTooltipForSearchDates = () => {
    return (
      <Card className={classes.card}>
        <h5>Search Dates</h5>
      </Card>
    );
  };

  return (
    <>
      <Card className={classes.offerAction}>
        <div className={classes.groupStatusOffer}>
          <div className={classes.statusOffer}>
            {query?.statuses ? startCase(camelCase(String(query?.statuses)?.replace(/_/g, ' '))) : 'All'}
          </div>
          <Dropdown
            className={'d-flex'}
            style={{ position: 'relative', width: 0 }}
            renderToggle={({ toggle }) => (
              <Button buttonType="clear" onClick={toggle}>
                <img src={images.common.icDropDownClose} alt="icon more" />
              </Button>
            )}
            renderMenu={({ hide }) => (
              <MenuDropdown className={cx(classes.dropDownContent, classes.customContentMenu)} onClose={hide}>
                <>
                  {StatusHistoryOptions.map((status: { label: string; value: string }, index: number) => (
                    <li key={String(index)}>
                      <Button
                        buttonType="clear"
                        className={classes.resizeBtn}
                        onClick={() => {
                          hide();
                          handleChangeStatusOffer(status);
                        }}>
                        {status.label}
                      </Button>
                    </li>
                  ))}
                </>
              </MenuDropdown>
            )}
          />
        </div>
        <div className={classes.wrapAction}>
          <Button buttonType="clear" onClick={() => handleOpenActionTab('search')}>
            <img src={images.iconSearch} alt="icon search" className={classes.icOfferAction} />
          </Button>
          <div className={classes.wrapCalendar}>
            <Button
              buttonType={'transparent'}
              onClick={() => {
                setSelectDateVisible(true);
              }}>
              <Tooltip renderTooltip={renderTooltipForSearchDates()}>
                <img src={images.icCalendar} alt={'Select Dates'} />
              </Tooltip>
            </Button>

            <div className={classes.dateRange}>
              {selectDateVisible && (
                <div className={classes.dateRangePicker}>
                  <DateRangePicker
                    handleCloseWhenClickOut={handleCloseDateRange}
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
        </div>
      </Card>
      {actionTab === 'search' && (
        <Card className={cx(classes.offerAction, classes.wrapSearch)}>
          <Input
            placeholder={'Search offers'}
            className={classes.inputSearch}
            type="text"
            onKeyDown={handleKeyPress}
            value={textSearch}
            onChange={(e: any) => setTextSearch(e.target.value)}
          />
          <Button buttonType="primary" onClick={handleSearchOffer}>
            Search
          </Button>
        </Card>
      )}
    </>
  );
};

export default OfferHistoryAction;
