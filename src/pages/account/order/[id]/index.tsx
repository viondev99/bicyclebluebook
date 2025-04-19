import React, { ComponentType, FC, useEffect } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import OrderDetailContainer from 'components/Account/Personal/Orders/Detail/OrderDetailContainer';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import AccountPersonalLayout from '../../../../layout/Account/Personal';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const OrderDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDetailOrder(router.query.id));
  }, [dispatch, router.query.id]);

  return (
    <AccountPersonalLayout titleMobile="Orders">
      <OrderDetailContainer />
    </AccountPersonalLayout>
  );
};

OrderDetail.getInitialProps = () => {
  return {};
};
OrderDetail.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(OrderDetail as FC<ComponentType & ComponentStatic>),
);
