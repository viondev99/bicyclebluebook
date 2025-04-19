import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import AccountLayout from 'layout/Account/Personal';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import CancelOrderContainer from 'components/Account/Personal/Orders/Cancel/Buyer';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const CancelOrderPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
  }, [query, dispatch]);

  return (
    <AccountLayout titleMobile="Orders">
      <CancelOrderContainer />
    </AccountLayout>
  );
};

CancelOrderPage.getInitialProps = () => {
  return {};
};

CancelOrderPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(CancelOrderPage as FC<ComponentType & ComponentStatic>),
);
