import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import RefundItemContainer from 'components/Account/Personal/Orders/RefundItem/RefundItemContainer';
import AccountPersonalLayout from 'layout/Account/Personal';
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
    <AccountPersonalLayout titleMobile="Orders">
      <RefundItemContainer />
    </AccountPersonalLayout>
  );
};

RefundItemPage.getInitialProps = () => {
  return {};
};
RefundItemPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(RefundItemPage as FC<ComponentType & ComponentStatic>),
);
