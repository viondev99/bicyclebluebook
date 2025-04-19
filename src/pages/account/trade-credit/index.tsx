import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import StoreState from 'model/store';
import Card from '@ui/Cards/index';
import { getGiftByCustomer } from 'store/account/personal/trade-credit/trade-credit.action';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { useRouter } from 'next/router';
import HeaderTradeCredit from '../../../components/Account/Personal/trade-credit/HeaderTradeCredit';
import TradeCreditHistory from '../../../components/Account/Personal/trade-credit/TradeCreditHistory';
import AccountPersonalLayout from '../../../layout/Account/Personal';
import classes from '../../../components/Account/Personal/Profile/profile.module.scss';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

function TradeCredit() {
  const params = useSelector((store: StoreState) => store.account.personal.tradeCredit.queryParams);
  const { listTradeCredit, giftDetailCustomer } = useSelector(
    (store: StoreState) => store.account.personal.tradeCredit,
  );
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(
      getGiftByCustomer({
        customer: userInfo?.account,
        page: query.page ? query.page : params.page,
        page_size: params.page_size,
        sort: params.sort,
      }),
    );
  }, [dispatch, userInfo, params, query]);

  return (
    <AccountPersonalLayout titleMobile="Trade Credit">
      <>
        <Card className={classes.profileContainer}>
          <HeaderTradeCredit giftDetailCustomer={giftDetailCustomer} />
          <TradeCreditHistory listTradeCredit={listTradeCredit} giftDetailCustomer={giftDetailCustomer} />
        </Card>
      </>
    </AccountPersonalLayout>
  );
}

TradeCredit.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.PERSONAL })(TradeCredit));
