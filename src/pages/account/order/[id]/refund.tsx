import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import AccountLayout from 'layout/Account/Personal';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import RefundOrderContainer from 'components/Account/Personal/Orders/Detail/Refund/RefundOrderContainer';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const RefundOrder = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
  }, [query, dispatch]);

  return (
    <AccountLayout titleMobile="Orders">
      <RefundOrderContainer />
    </AccountLayout>
  );
};

RefundOrder.getInitialProps = async () => {
  return {};
};

RefundOrder.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(RefundOrder as FC<ComponentType & ComponentStatic>),
);
