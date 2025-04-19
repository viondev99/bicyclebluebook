import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import RefundItemContainer from 'components/Account/Personal/Orders/RefundItem/RefundItemContainer';
import AccountStoreFrontLayout from 'layout/Account/StoreFront';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

const RefundItemPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
  }, [query, dispatch]);

  return (
    <AccountStoreFrontLayout titleMobile="Orders">
      <RefundItemContainer />
    </AccountStoreFrontLayout>
  );
};

RefundItemPage.getInitialProps = () => {
  return {};
};
RefundItemPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(RefundItemPage as FC<ComponentType & ComponentStatic>),
);
