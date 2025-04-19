import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder, getReturnDetail } from 'store/account/personal/orders/orders.action';
import ReturnDetailContainer from 'components/Account/Personal/Orders/ReturnDetail/ReturnDetailContainer';
import AccountStoreFrontLayout from 'layout/Account/StoreFront';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

const ReturnDetailPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
    dispatch(
      getReturnDetail({
        inventory_id: query?.inventory,
        market_listing_id: query?.marketListing,
        master_listing_id: query?.itemId,
        order_id: query?.id,
      }),
    );
  }, [query, dispatch]);

  return (
    <AccountStoreFrontLayout titleMobile="Orders">
      <ReturnDetailContainer />
    </AccountStoreFrontLayout>
  );
};

ReturnDetailPage.getInitialProps = () => {
  return {};
};
ReturnDetailPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(ReturnDetailPage as FC<ComponentType & ComponentStatic>),
);
