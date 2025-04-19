import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import OrderReturnContainer from 'components/Account/Personal/Orders/ReturnOrder/OrderReturnContainer';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AccountPersonalLayout from 'layout/Account/Personal';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

const OrderReturn = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
  }, [query, dispatch]);

  return (
    <AccountPersonalLayout titleMobile="Orders">
      <OrderReturnContainer />
    </AccountPersonalLayout>
  );
};

OrderReturn.getInitialProps = () => {
  return {};
};

OrderReturn.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(OrderReturn as FC<ComponentType & ComponentStatic>),
);
