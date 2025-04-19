import React, { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import Card from '@ui/Cards';
import { constHistoryPartnerTradeInTabName } from 'components/PartnerPortal/CostCalculator/constraint';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './history-tab.module.scss';

const HistoryTab: FC = () => {
  const role = useSelector((state: StoreState) => state.authenticate.user?.role);
  const partner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  const checkShowInstantPayoutTab = useMemo(() => {
    return partner?.is_instant_payout && ['user_administrator', 'user_manager'].indexOf(role) > -1;
  }, [partner, role]);

  const router = useRouter();
  const { query } = useRouter();
  const activeTab = query.tab || constHistoryPartnerTradeInTabName.INBOX;
  const onChangeTab = (tab: string) => {
    router.push({
      pathname: router.pathname,
      query: {
        tab,
      },
    });
  };

  return (
    <Card>
      <div className={classes.tabContainer}>
        <button
          type="button"
          className={classNames(classes.tabItem, {
            [classes.active]: activeTab === constHistoryPartnerTradeInTabName.INBOX,
          })}
          onClick={() => onChangeTab(constHistoryPartnerTradeInTabName.INBOX)}>
          Scorecards
        </button>
        <button
          type="button"
          className={classNames(classes.tabItem, {
            [classes.active]: activeTab === constHistoryPartnerTradeInTabName.LEAD,
          })}
          onClick={() => onChangeTab(constHistoryPartnerTradeInTabName.LEAD)}>
          Leads
        </button>
        <button
          type="button"
          className={classNames(classes.tabItem, {
            [classes.active]: activeTab === constHistoryPartnerTradeInTabName.QUOTES,
          })}
          onClick={() => onChangeTab(constHistoryPartnerTradeInTabName.QUOTES)}>
          Quotes
        </button>
        <button
          type="button"
          className={classNames(classes.tabItem, {
            [classes.active]: activeTab === constHistoryPartnerTradeInTabName.ARCHIVE,
          })}
          onClick={() => onChangeTab(constHistoryPartnerTradeInTabName.ARCHIVE)}>
          Archive
        </button>
        <button
          type="button"
          className={classNames(classes.tabItem, {
            [classes.active]: activeTab === constHistoryPartnerTradeInTabName.TRADE_IN_REQUEST,
          })}
          onClick={() => onChangeTab(constHistoryPartnerTradeInTabName.TRADE_IN_REQUEST)}>
          Trade-in Request
        </button>
        {checkShowInstantPayoutTab && (
          <button
            type="button"
            className={classNames(classes.tabItem, {
              [classes.active]: activeTab === constHistoryPartnerTradeInTabName.INSTANT_PAYOUT,
            })}
            onClick={() => onChangeTab(constHistoryPartnerTradeInTabName.INSTANT_PAYOUT)}>
            Instant payout
          </button>
        )}
      </div>
    </Card>
  );
};

export default HistoryTab;
